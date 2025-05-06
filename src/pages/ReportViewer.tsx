
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { isValidArchetypeId, normalizeArchetypeId } from '@/utils/archetypeValidation';
import { toast } from 'sonner';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import { useReportUserData } from '@/hooks/useReportUserData';
import { useReportAccess } from '@/hooks/useReportAccess';
import ReportLoadingState from '@/components/report/ReportLoadingState';
import { checkCacheHealth, getCacheStats } from '@/utils/reports/reportCache';
import { useTokenStatus } from '@/hooks/useTokenStatus';
import ReportViewerContent from '@/components/report/viewer/ReportViewerContent';
import ErrorHandler from '@/components/report/viewer/ErrorHandler';

/**
 * ReportViewer - A simplified token-based report viewer
 * 
 * This component handles:
 * 1. Token-based authentication for report access
 * 2. Loading report data from level4_report_secure
 * 3. Fallback to cached data when network issues occur
 * 4. Error and expiration handling with graceful degradation
 */
const ReportViewer = () => {
  const { archetypeId: rawArchetypeId, token } = useParams();
  // State to track when to refresh data
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [errorDetails, setErrorDetails] = useState<any>(null);
  const [isUsingFallbackData, setIsUsingFallbackData] = useState<boolean>(false);
  const [sessionStartTime] = useState<number>(Date.now());
  const pageActive = useRef<boolean>(true);
  const tokenCheckInitialized = useRef<boolean>(false);
  
  // Normalize the archetype ID to handle case sensitivity
  const archetypeId = rawArchetypeId ? normalizeArchetypeId(rawArchetypeId) : undefined;
  const isValidArchetype = !!archetypeId && isValidArchetypeId(archetypeId);
  
  // Simple helper for valid access
  const isAdminView = token === 'admin-view';
  const navigate = useNavigate();
  
  // Debug logging for URL parameters
  useEffect(() => {
    console.log('[ReportViewer] Session started:', new Date(sessionStartTime).toISOString());
    console.log('[ReportViewer] URL parameters:', {
      rawArchetypeId,
      normalizedArchetypeId: archetypeId,
      token: token ? `${token.substring(0, 5)}...` : 'missing',
      dataSource: 'level4_report_secure'
    });
    
    // Log cache health at start
    const cacheHealth = checkCacheHealth();
    console.log('[ReportViewer] Initial cache health:', cacheHealth);
    
    // Track page visibility
    const handleVisibilityChange = () => {
      pageActive.current = document.visibilityState === 'visible';
      console.log(`[ReportViewer] Page visibility changed: ${pageActive.current ? 'active' : 'background'}`);
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [sessionStartTime, rawArchetypeId, archetypeId, token]);

  // Use the simplified user data hook for token validation
  const {
    userData,
    isLoading: userDataLoading,
    isValid: isValidAccess,
    error: userDataError,
    debugInfo: userDataDebugInfo
  } = useReportUserData(token, archetypeId || '');

  // Use report data hook to fetch EXCLUSIVELY from level4_report_secure
  const {
    reportData, 
    archetypeData, // Kept for compatibility
    averageData,
    isLoading: reportLoading,
    error: reportError,
    debugInfo: reportDebugInfo,
    refreshData,
    isUsingFallbackData: isFallbackData = false
  } = useReportAccess({
    archetypeId: archetypeId || '', 
    token: token || '',
    isAdminView,
    skipCache: refreshCounter > 0
  });
  
  // Update fallback data state
  useEffect(() => {
    setIsUsingFallbackData(isFallbackData || false);
  }, [isFallbackData]);
  
  // Use the token status hook - ONLY INITIALIZE ONCE WHEN USER DATA AND REPORT DATA ARE READY
  const {
    tokenStatus,
    lastStatusCheck,
    errorDetails: tokenErrorDetails,
    checkTokenStatus
  } = useTokenStatus({
    token,
    isAdminView,
    isValidAccess,
    userDataError,
    userData,
    sessionStartTime,
    reportData
  });
  
  // Set up a single periodic token check after everything is loaded
  useEffect(() => {
    if (!token || isAdminView || tokenCheckInitialized.current) return;
    
    // Only set up the periodic check once
    if (!userDataLoading && !reportLoading) {
      tokenCheckInitialized.current = true;
      console.log('[ReportViewer] Setting up token check interval');
      
      // Set up timer for periodic checks - increased to 5 minutes
      const timer = setInterval(() => {
        // Only run check if page is active
        if (pageActive.current) {
          checkTokenStatus();
        }
      }, 5 * 60 * 1000); // Every 5 minutes
      
      return () => {
        clearInterval(timer);
      };
    }
  }, [token, isAdminView, checkTokenStatus, userDataLoading, reportLoading]);

  // Handle manual refresh
  const handleRefresh = useCallback(() => {
    console.log('[ReportViewer] Manual refresh requested');
    if (refreshData) {
      refreshData();
    }
    setRefreshCounter(prev => prev + 1);
    checkTokenStatus();
    toast('Refreshing report data...', {
      description: 'Getting the latest information from the server'
    });
  }, [refreshData, checkTokenStatus]);

  // Handler for requesting new access token
  const handleRequestNewToken = useCallback(() => {
    // Redirect to a form or API to request a new token
    const emailSubject = `Token renewal request for ${archetypeId}`;
    const emailBody = `Hi, my token for archetype ${archetypeId} has expired. Please provide a new access token.`;
    window.open(`mailto:support@example.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`);
  }, [archetypeId]);

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
      validationFrequency: '5 minutes'
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

  // Handle error cases with our error handler component
  const errorElement = (
    <ErrorHandler
      archetypeId={archetypeId}
      rawArchetypeId={rawArchetypeId}
      isValidArchetype={isValidArchetype}
      isValidAccess={isValidAccess}
      isAdminView={isAdminView}
      token={token}
      userDataError={userDataError}
      reportError={reportError}
      reportData={reportData}
      isUsingFallbackData={isUsingFallbackData}
      onRetry={handleRefresh}
      onRequestNewToken={handleRequestNewToken}
    />
  );
  
  if (errorElement) {
    return errorElement;
  }

  // Handle token error with fallback data special case
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
          
          <ReportViewerContent
            tokenStatus={tokenStatus}
            isAdminView={false}
            reportData={reportData}
            userData={userData}
            averageData={averageData}
            combinedDebugInfo={combinedDebugInfo}
            userDataLoading={false}
            reportLoading={false}
            reportError={null}
            userDataError={null}
            isUsingFallbackData={true}
            sessionStartTime={sessionStartTime}
            lastStatusCheck={lastStatusCheck}
            onError={handleError}
            onRequestNewToken={handleRequestNewToken}
          />
        </div>
      </ErrorBoundary>
    );
  }

  // Render the main content
  return (
    <ReportViewerContent
      tokenStatus={tokenStatus}
      isAdminView={isAdminView}
      reportData={reportData}
      userData={userData}
      averageData={averageData}
      combinedDebugInfo={combinedDebugInfo}
      userDataLoading={userDataLoading}
      reportLoading={reportLoading}
      reportError={reportError}
      userDataError={userDataError}
      isUsingFallbackData={isUsingFallbackData}
      sessionStartTime={sessionStartTime}
      lastStatusCheck={lastStatusCheck}
      onError={handleError}
      onRequestNewToken={handleRequestNewToken}
    />
  );
};

export default ReportViewer;
