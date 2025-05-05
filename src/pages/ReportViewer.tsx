import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { isValidArchetypeId, normalizeArchetypeId } from '@/utils/archetypeValidation';
import { toast } from 'sonner';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import { useReportUserData } from '@/hooks/useReportUserData';
import { useReportAccess } from '@/hooks/useReportAccess';
import DeepDiveReport from '@/components/report/DeepDiveReport';
import { Card } from '@/components/ui/card';
import ReportLoadingState from '@/components/report/ReportLoadingState';
import ReportError from '@/components/report/ReportError';
import { checkCacheHealth, getCacheStats } from '@/utils/reports/reportCache';
import FallbackBanner from '@/components/report/FallbackBanner';

/**
 * ReportViewer - A simplified token-based report viewer
 * 
 * This component handles:
 * 1. Token-based authentication for report access
 * 2. Loading report data from level4_report_secure
 * 3. Fallback to cached data when network issues occur
 * 4. Error and expiration handling with graceful degradation
 * 
 * The component implements progressive enhancement:
 * - Report data persists in cache even if token validation fails
 * - Expired tokens in grace period still show reports with warning
 * - Reports continue to be viewable even after page refresh if cache exists
 */
const ReportViewer = () => {
  const { archetypeId: rawArchetypeId, token } = useParams();
  const [debugMode, setDebugMode] = useState(false); // Changed to false to hide debug by default
  // State to track when to refresh data
  const [refreshCounter, setRefreshCounter] = useState(0);
  // State for token monitoring
  const [tokenStatus, setTokenStatus] = useState<'valid' | 'checking' | 'warning' | 'error' | 'grace-period'>('checking');
  const [lastStatusCheck, setLastStatusCheck] = useState<number>(Date.now());
  const [sessionStartTime] = useState<number>(Date.now());
  const [errorDetails, setErrorDetails] = useState<any>(null);
  const [isUsingFallbackData, setIsUsingFallbackData] = useState<boolean>(false);
  const pageActive = useRef<boolean>(true);
  
  // Normalize the archetype ID to handle case sensitivity
  const archetypeId = rawArchetypeId ? normalizeArchetypeId(rawArchetypeId) : undefined;
  
  // Debug logging for URL parameters
  useEffect(() => {
    console.log('[ReportViewer] Session started:', new Date(sessionStartTime).toISOString());
    console.log('[ReportViewer] URL parameters:', {
      rawArchetypeId,
      normalizedArchetypeId: archetypeId,
      token: token ? `${token.substring(0, 5)}...` : 'missing',
      dataSource: 'level4_report_secure' // Explicitly log the data source
    });
    
    // Log cache health at start
    const cacheHealth = checkCacheHealth();
    console.log('[ReportViewer] Initial cache health:', cacheHealth);
    
    // Track page visibility
    const handleVisibilityChange = () => {
      pageActive.current = document.visibilityState === 'visible';
      console.log(`[ReportViewer] Page visibility changed: ${pageActive.current ? 'active' : 'background'}`);
      
      if (pageActive.current) {
        // When page becomes visible again, check token status
        console.log('[ReportViewer] Page back in focus, checking token status');
        checkTokenStatus();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [sessionStartTime]);
  
  // Simple helper for valid access
  const isAdminView = token === 'admin-view';
  const navigate = useNavigate();
  
  // Validate archetypeId
  if (!archetypeId || !isValidArchetypeId(archetypeId)) {
    console.error('[ReportViewer] Invalid archetype ID:', rawArchetypeId);
    return (
      <ReportError
        title="Invalid Archetype ID"
        message={`The requested archetype report (${rawArchetypeId}) could not be found.`}
        actionLabel="Return Home"
        onAction={() => navigate('/')}
        secondaryAction={() => window.location.reload()}
        secondaryActionLabel="Retry"
      />
    );
  }

  // Use the simplified user data hook for token validation
  const {
    userData,
    isLoading: userDataLoading,
    isValid: isValidAccess,
    error: userDataError,
    debugInfo: userDataDebugInfo
  } = useReportUserData(token, archetypeId);

  // Use report data hook to fetch EXCLUSIVELY from level4_report_secure
  const {
    reportData, 
    archetypeData, // Kept for compatibility
    averageData,
    isLoading: reportLoading,
    error: reportError,
    debugInfo: reportDebugInfo,
    refreshData,
    isUsingFallbackData: isFallbackData = false // Add default value
  } = useReportAccess({
    archetypeId, 
    token: token || '',
    isAdminView,
    skipCache: refreshCounter > 0 // Skip cache if we're refreshing
  });
  
  // Update fallback data state
  useEffect(() => {
    setIsUsingFallbackData(isFallbackData || false);
  }, [isFallbackData]);
  
  /**
   * Check token status - improved version
   * 
   * This check is designed to be less aggressive and more forgiving:
   * 1. For admin views, always valid
   * 2. For cached reports with existing session data, use progressive validation
   * 3. Report continues to be visible even if token validation fails after session start
   * 4. Only show clear errors for completely invalid tokens, not just expired ones
   */
  const checkTokenStatus = useCallback(() => {
    if (token && !isAdminView) {
      // Set status to checking
      setTokenStatus('checking');
      setLastStatusCheck(Date.now());
      
      const sessionDuration = (Date.now() - sessionStartTime) / 1000; // in seconds
      console.log(`[ReportViewer] Checking token status at ${sessionDuration.toFixed(1)}s into session`);
      
      // Special case: If we have reportData and the token was previously valid,
      // but now fails validation, we still allow viewing with a warning
      const hasLoadedReportData = !!reportData;
      
      if (userDataError) {
        console.warn('[ReportViewer] Token validation issue:', userDataError.message);
        
        // Check for grace period
        if (userData?.status === 'grace-period') {
          console.log('[ReportViewer] Token is in grace period, still showing data with warning');
          setTokenStatus('grace-period');
          return;
        }
        
        // If we already loaded the report data, show warning but don't block access
        if (hasLoadedReportData) {
          console.log('[ReportViewer] Using progressive validation - showing report despite token issues');
          setTokenStatus('warning');
          return;
        }
        
        // Otherwise, show error
        setTokenStatus('error');
        setErrorDetails({
          type: 'token',
          message: userDataError.message,
          timestamp: Date.now()
        });
        return;
      }
      
      if (!isValidAccess) {
        console.warn('[ReportViewer] Token is not valid');
        
        // If we already loaded the report, still show it with a warning
        if (hasLoadedReportData) {
          console.log('[ReportViewer] Using progressive validation - showing report despite invalid token');
          setTokenStatus('warning');
          return;
        }
        
        setTokenStatus('error');
        setErrorDetails({
          type: 'access',
          message: 'Access validation failed',
          timestamp: Date.now()
        });
        return;
      }
      
      // Check if token is about to expire - adding null check and default value
      if (userData?.status === 'expiring-soon') {
        console.warn('[ReportViewer] Token will expire soon');
        setTokenStatus('warning');
        return;
      } else if (userData?.status === 'grace-period') {
        console.warn('[ReportViewer] Token is in grace period');
        setTokenStatus('grace-period');
        return;
      }
      
      // All checks passed
      setTokenStatus('valid');
      setErrorDetails(null);
    }
  }, [token, isAdminView, isValidAccess, userDataError, userData, sessionStartTime, reportData]);
  
  // Set up REDUCED periodic token checks - now every 5 minutes instead of 30 seconds
  useEffect(() => {
    if (!token || isAdminView) return;
    
    // Initial check after data is loaded
    if (!userDataLoading && !reportLoading) {
      checkTokenStatus();
    }
    
    // Set up timer for periodic checks - increased to 5 minutes
    const timer = setInterval(() => {
      // Only run check if page is active
      if (pageActive.current) {
        checkTokenStatus();
      }
    }, 5 * 60 * 1000); // Every 5 minutes instead of 30 seconds
    
    return () => {
      clearInterval(timer);
    };
  }, [token, isAdminView, checkTokenStatus, userDataLoading, reportLoading]);

  // Handle manual refresh
  const handleRefresh = () => {
    console.log('[ReportViewer] Manual refresh requested');
    if (refreshData) {
      refreshData();
    }
    setRefreshCounter(prev => prev + 1);
    checkTokenStatus();
    toast('Refreshing report data...', {
      description: 'Getting the latest information from the server'
    });
  };

  // Data source verification logging
  useEffect(() => {
    // Log details about the data source and SWOT data
    console.log('[ReportViewer] Data source verification:', {
      source: 'level4_report_secure',
      hasReportData: !!reportData,
      hasSwotAnalysis: !!reportData?.swot_analysis,
      hasStrengths: !!reportData?.strengths,
      hasWeaknesses: !!reportData?.weaknesses,
      hasOpportunities: !!reportData?.opportunities,
      hasThreats: !!reportData?.threats,
      swotAnalysisType: reportData?.swot_analysis ? typeof reportData.swot_analysis : 'N/A'
    });
    
    // Log token status when data is loaded
    if (reportData && !reportLoading) {
      console.log('[ReportViewer] Report data loaded with token status:', tokenStatus);
    }
  }, [reportData, reportLoading, tokenStatus]);

  // Handler for requesting new access token
  const handleRequestNewToken = () => {
    // Redirect to a form or API to request a new token
    const emailSubject = `Token renewal request for ${archetypeId}`;
    const emailBody = `Hi, my token for archetype ${archetypeId} has expired. Please provide a new access token.`;
    window.open(`mailto:support@example.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`);
  };

  // Combined debug info
  const combinedDebugInfo = {
    ...userDataDebugInfo,
    ...reportDebugInfo,
    reportViewerState: {
      dataSource: 'level4_report_secure',
      userDataLoading,
      reportLoading,
      isValidAccess,
      hasUserData: !!userData,
      hasReportData: !!reportData,
      hasSwotData: !!(reportData?.swot_analysis || reportData?.strengths),
      timestamp: new Date().toISOString(),
      tokenStatus,
      lastStatusCheck: new Date(lastStatusCheck).toISOString(),
      sessionDuration: ((Date.now() - sessionStartTime) / 1000).toFixed(1) + 's',
      cacheHealth: checkCacheHealth(),
      cacheStats: getCacheStats(),
      isUsingFallbackData,
      validationFrequency: '5 minutes' // Document new validation frequency
    }
  };

  // Handler for when ErrorBoundary catches an error
  const handleError = useCallback((error: Error, errorInfo: React.ErrorInfo) => {
    console.error('[ReportViewer] ErrorBoundary caught error:', error, errorInfo);
    setErrorDetails({
      type: 'component',
      message: error.message,
      stack: errorInfo.componentStack,
      timestamp: Date.now()
    });
    
    // Try to recover by refreshing the data
    setTimeout(() => {
      if (refreshData) {
        console.log('[ReportViewer] Attempting recovery by refreshing data');
        refreshData();
      }
    }, 2000);
  }, [refreshData]);

  // Show loading state
  if (userDataLoading || reportLoading) {
    return <ReportLoadingState />;
  }

  // Handle various error and fallback scenarios

  // If we have a token error but fallback data is available, show the report with a warning
  if (tokenStatus === 'error' && isUsingFallbackData && reportData) {
    return (
      <ErrorBoundary onError={handleError} name="Report Viewer">
        <div className="min-h-screen bg-gray-50">
          {/* Error banner for expired token but showing fallback data */}
          <div className="bg-red-50 border-b border-red-200 p-4 text-center">
            <p className="text-base text-red-700">
              <span className="font-semibold">Access Token Expired:</span> You're viewing a cached copy of this report.
            </p>
            <button
              onClick={handleRequestNewToken}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Request New Access Token
            </button>
          </div>
          
          <DeepDiveReport
            reportData={reportData}
            userData={userData}
            averageData={averageData}
            isAdminView={false}
            debugInfo={combinedDebugInfo}
            isLoading={false}
            error={null} // Suppress error since we're showing fallback
          />
        </div>
      </ErrorBoundary>
    );
  }

  // Show access error with enhanced debug info
  if (!isAdminView && token && !isValidAccess && !isUsingFallbackData) {
    console.error('[ReportViewer] Access error:', {
      token: token ? `${token.substring(0, 5)}...` : 'missing',
      error: userDataError?.message || 'Unknown validation error',
      debugInfo: userDataDebugInfo
    });
    
    return (
      <ReportError
        title="Access Error"
        message={userDataError?.message || 'Invalid or expired access token.'}
        actionLabel="Return Home"
        onAction={() => navigate('/')}
        secondaryAction={handleRequestNewToken}
        secondaryActionLabel="Request New Access Token"
      />
    );
  }

  // Show data fetch error with more helpful details
  if (reportError && !isUsingFallbackData) {
    console.error('[ReportViewer] Data error:', reportError);
    
    return (
      <ReportError
        title="Error Loading Report"
        message={`${reportError.message} (Data source: level4_report_secure)`}
        actionLabel="Retry"
        onAction={() => {
          console.log('[ReportViewer] Retrying after error');
          handleRefresh();
        }}
        secondaryAction={() => navigate('/')}
        secondaryActionLabel="Return Home"
      />
    );
  }

  // Show missing data error with archetype details
  if (!reportData && !isUsingFallbackData) {
    console.error('[ReportViewer] No report data found for:', archetypeId);
    
    return (
      <ReportError
        title="Report Not Found"
        message={`Could not find report data for archetype: ${archetypeId} in level4_report_secure table.`}
        actionLabel="Return Home"
        onAction={() => navigate('/')}
      />
    );
  }

  // Render the report using only data from level4_report_secure with enhanced error boundary
  return (
    <ErrorBoundary onError={handleError} name="Report Viewer">
      <div className="min-h-screen bg-gray-50">
        {/* Token warning banner for near-expired tokens */}
        {tokenStatus === 'warning' && !isAdminView && (
          <div className="bg-yellow-50 border-b border-yellow-200 p-2 text-center">
            <p className="text-sm text-yellow-700">
              <span className="font-semibold">Note:</span> This report access will expire soon.
              Please contact your administrator if you need continued access.
            </p>
          </div>
        )}
        
        {/* Grace period banner */}
        {tokenStatus === 'grace-period' && !isAdminView && (
          <div className="bg-orange-50 border-b border-orange-200 p-3 text-center">
            <p className="text-sm text-orange-700">
              <span className="font-semibold">Access Token Expired:</span> This report is viewable in grace period mode.
            </p>
            <button
              onClick={handleRequestNewToken}
              className="mt-2 px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700"
            >
              Request New Access Token
            </button>
          </div>
        )}
        
        {/* Fallback data banner */}
        <FallbackBanner 
          show={isUsingFallbackData} 
          message="This report is showing previously cached data because the latest data could not be retrieved."
        />
        
        <DeepDiveReport
          reportData={reportData} // Using only the data from level4_report_secure
          userData={userData}
          averageData={averageData}
          isAdminView={isAdminView}
          debugInfo={combinedDebugInfo}
          isLoading={userDataLoading || reportLoading}
          error={reportError || userDataError}
        />
      </div>
      
      {/* Debug button visible only with ?debug=true in URL */}
      {(isAdminView || window.location.search.includes('debug=true')) && (
        <div className="fixed bottom-4 right-4 z-50 print:hidden">
          <button
            onClick={() => {
              console.group('[ReportViewer] Debug Info');
              console.log('Session Duration:', ((Date.now() - sessionStartTime) / 1000).toFixed(1) + 's');
              console.log('Token Status:', { status: tokenStatus, lastCheck: new Date(lastStatusCheck).toLocaleString() });
              console.log('User Data:', userData);
              console.log('Using Fallback Data:', isUsingFallbackData);
              console.log('Report Data Sample:', reportData ? {
                id: reportData.id || reportData.archetype_id,
                name: reportData.name || reportData.archetype_name
              } : null);
              console.log('Cache Health:', checkCacheHealth());
              console.log('Token Validation History:', userDataDebugInfo?.validationHistory || 'Not available');
              console.groupEnd();
              
              toast('Debug info logged to console', {
                description: `Token status: ${tokenStatus}`
              });
            }}
            className="bg-gray-800 text-white px-3 py-1 rounded text-xs shadow-lg"
          >
            Log Debug Data
          </button>
        </div>
      )}
    </ErrorBoundary>
  );
};

export default ReportViewer;
