import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { isValidArchetypeId, normalizeArchetypeId } from '@/utils/archetypeValidation';
import { toast } from 'sonner';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import { useReportUserData } from '@/hooks/useReportUserData';
import { useReportAccess } from '@/hooks/useReportAccess';
import ReportLoadingState from '@/components/report/ReportLoadingState';
import { checkCacheHealth, getCacheStats, clearAllCache } from '@/utils/reports/reportCache';
import { useTokenStatus } from '@/hooks/useTokenStatus';
import ReportViewerContent from '@/components/report/viewer/ReportViewerContent';
import ErrorHandler from '@/components/report/viewer/ErrorHandler';

/**
 * Enhanced ReportViewer with improved error handling and fallback strategies
 * 
 * Key improvements:
 * 1. Persistent token state tracking
 * 2. Fallback to cached data on token errors
 * 3. Graceful degradation UI instead of 404 redirects
 * 4. Progressive validation approach
 * 5. Improved logging and debugging for token states
 */
const ReportViewer = () => {
  const { archetypeId: rawArchetypeId, token } = useParams();
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [errorDetails, setErrorDetails] = useState<any>(null);
  const [isUsingFallbackData, setIsUsingFallbackData] = useState<boolean>(false);
  const [sessionStartTime] = useState<number>(Date.now());
  const pageActive = useRef<boolean>(true);
  const hasValidatedRef = useRef<boolean>(false);
  const navigate = useNavigate();
  
  // Track page visibility for performance optimization
  useEffect(() => {
    const handleVisibilityChange = () => {
      pageActive.current = document.visibilityState === 'visible';
      console.log(`[ReportViewer] Page visibility changed: ${pageActive.current ? 'active' : 'background'}`);
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);
  
  // Normalize the archetype ID to handle case sensitivity
  const archetypeId = rawArchetypeId ? normalizeArchetypeId(rawArchetypeId) : undefined;
  const isValidArchetype = !!archetypeId && isValidArchetypeId(archetypeId);
  const isAdminView = token === 'admin-view';
  
  // Track token state in localStorage for debugging
  const logTokenState = useCallback((action: string, state: any) => {
    try {
      const timestamp = new Date().toISOString();
      const entry = { 
        timestamp, 
        action,
        archetypeId,
        tokenPreview: token ? `${token.substring(0, 5)}...` : 'none',
        state 
      };
      
      // Get existing log
      const existingLog = JSON.parse(localStorage.getItem('tokenDebugLog') || '[]');
      
      // Add new entry
      existingLog.push(entry);
      
      // Keep only last 100 entries
      const trimmedLog = existingLog.slice(-100);
      
      // Save back to localStorage
      localStorage.setItem('tokenDebugLog', JSON.stringify(trimmedLog));
    } catch (e) {
      console.error('Error logging token state:', e);
    }
  }, [archetypeId, token]);
  
  // Log component rendering
  useEffect(() => {
    console.log('[ReportViewer] Session started:', new Date(sessionStartTime).toISOString());
    console.log('[ReportViewer] URL parameters:', {
      rawArchetypeId,
      normalizedArchetypeId: archetypeId,
      token: token ? `${token.substring(0, 5)}...` : 'missing',
      isAdminView
    });
    
    // Log cache health at start
    const cacheHealth = checkCacheHealth();
    console.log('[ReportViewer] Initial cache health:', cacheHealth);
    
    // Log token state
    logTokenState('component_mount', { isValidArchetype, isAdminView });
    
    return () => {
      logTokenState('component_unmount', {});
    };
  }, [sessionStartTime, rawArchetypeId, archetypeId, token, isAdminView, isValidArchetype, logTokenState]);

  // Use the simplified user data hook for token validation
  const {
    userData,
    isLoading: userDataLoading,
    isValid: isValidAccess,
    error: userDataError,
    debugInfo: userDataDebugInfo
  } = useReportUserData(token, archetypeId || '');

  // Log user data result
  useEffect(() => {
    if (!userDataLoading) {
      logTokenState('user_data_loaded', {
        isValid: isValidAccess,
        hasError: !!userDataError,
        hasUserData: !!userData
      });
    }
  }, [userDataLoading, isValidAccess, userDataError, userData, logTokenState]);

  // Use report data hook to fetch report data
  const {
    reportData, 
    archetypeData,
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
  
  // Log report data result
  useEffect(() => {
    if (!reportLoading) {
      logTokenState('report_data_loaded', {
        hasReportData: !!reportData,
        hasError: !!reportError,
        isFallbackData
      });
    }
  }, [reportLoading, reportData, reportError, isFallbackData, logTokenState]);
  
  // Update fallback data state
  useEffect(() => {
    setIsUsingFallbackData(isFallbackData || false);
  }, [isFallbackData]);
  
  // Use the token status hook - AFTER user data and report data are loaded
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
  
  // Log token status changes
  useEffect(() => {
    logTokenState('token_status_updated', {
      tokenStatus,
      lastCheck: new Date(lastStatusCheck).toISOString(),
      errorDetails: tokenErrorDetails
    });
  }, [tokenStatus, lastStatusCheck, tokenErrorDetails, logTokenState]);
  
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
    
    logTokenState('manual_refresh', {
      counter: refreshCounter + 1
    });
  }, [refreshData, checkTokenStatus, refreshCounter, logTokenState]);

  // Handler for requesting new access token
  const handleRequestNewToken = useCallback(() => {
    // Redirect to a form or API to request a new token
    const emailSubject = `Token renewal request for ${archetypeId}`;
    const emailBody = `Hi, my token for archetype ${archetypeId} has expired. Please provide a new access token.`;
    window.open(`mailto:support@example.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`);
    
    logTokenState('request_new_token', { archetypeId });
  }, [archetypeId, logTokenState]);

  // Combined debug info
  const combinedDebugInfo = {
    ...userDataDebugInfo,
    ...reportDebugInfo,
    reportViewerState: {
      dataSource: isAdminView ? 'level4_report_secure (admin)' : 'level4_report_secure',
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
    
    logTokenState('error_boundary', {
      errorMessage: error.message
    });
    
    // Try to recover by refreshing the data
    setTimeout(() => {
      if (refreshData) {
        console.log('[ReportViewer] Attempting recovery by refreshing data');
        refreshData();
      }
    }, 2000);
  }, [refreshData, logTokenState]);
  
  // Function to clear debug logs
  const clearDebugLogs = useCallback(() => {
    try {
      localStorage.removeItem('tokenDebugLog');
      toast.success('Debug logs cleared');
    } catch (e) {
      console.error('Error clearing debug logs:', e);
    }
  }, []);

  // Show loading state
  if (userDataLoading || reportLoading) {
    return <ReportLoadingState />;
  }

  // Create the error handler element for conditional rendering
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
  
  // Show errors only in specific conditions:
  // 1. Invalid archetype ID
  // 2. No admin view AND no valid access AND no report data AND not using fallback data
  // 3. No report data AND report error AND not using fallback data
  const shouldShowError = 
    !isValidArchetype || 
    (!isAdminView && !isValidAccess && !reportData && !isUsingFallbackData) || 
    (!reportData && reportError && !isUsingFallbackData);
  
  if (shouldShowError) {
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
            hideNavbar={true}
          />
        </div>
      </ErrorBoundary>
    );
  }

  // Render the main content
  return (
    <ErrorBoundary onError={handleError} name="Report Viewer">
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
        hideNavbar={true}
      />
      
      {/* Debug toolbar - only visible in development */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-2 flex items-center justify-between text-xs z-50">
          <div>Token: {tokenStatus} | Cache: {isUsingFallbackData ? 'Using Fallback' : 'Fresh'}</div>
          <div className="space-x-2">
            <button
              onClick={handleRefresh}
              className="px-2 py-1 bg-blue-700 rounded hover:bg-blue-800"
            >
              Refresh Data
            </button>
            <button
              onClick={() => {
                clearAllCache();
                handleRefresh();
              }}
              className="px-2 py-1 bg-red-700 rounded hover:bg-red-800"
            >
              Clear Cache
            </button>
            <button
              onClick={clearDebugLogs}
              className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-800"
            >
              Clear Debug Logs
            </button>
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
};

export default ReportViewer;
