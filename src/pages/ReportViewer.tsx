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
import { trackReportAccess } from '@/utils/reports/accessTracking';
import { getSupabaseUrl } from '@/integrations/supabase/client';
import TrackingPixel from '@/components/report/TrackingPixel';

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
  const hasValidatedRef = useRef<boolean>(false);
  const hasTrackedAccessRef = useRef<boolean>(false);
  const trackingPixelLoadedRef = useRef<boolean>(false);
  const navigate = useNavigate();
  
  const archetypeId = rawArchetypeId ? normalizeArchetypeId(rawArchetypeId) : undefined;
  const isValidArchetype = !!archetypeId && isValidArchetypeId(archetypeId);
  const isAdminView = token === 'admin-view';
  
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
      
      const existingLog = JSON.parse(localStorage.getItem('tokenDebugLog') || '[]');
      existingLog.push(entry);
      const trimmedLog = existingLog.slice(-100);
      localStorage.setItem('tokenDebugLog', JSON.stringify(trimmedLog));
    } catch (e) {
      console.error('Error logging token state:', e);
    }
  }, [archetypeId, token]);
  
  useEffect(() => {
    console.log('[ReportViewer] Session started:', new Date(sessionStartTime).toISOString());
    console.log('[ReportViewer] URL parameters:', {
      rawArchetypeId,
      normalizedArchetypeId: archetypeId,
      token: token ? `${token.substring(0, 5)}...` : 'missing',
      isAdminView
    });
    
    const cacheHealth = checkCacheHealth();
    console.log('[ReportViewer] Initial cache health:', cacheHealth);
    
    logTokenState('component_mount', { isValidArchetype, isAdminView });
    
    return () => {
      logTokenState('component_unmount', {});
    };
  }, [sessionStartTime, rawArchetypeId, archetypeId, token, isAdminView, isValidArchetype, logTokenState]);

  const {
    userData,
    isLoading: userDataLoading,
    isValid: isValidAccess,
    error: userDataError,
    debugInfo: userDataDebugInfo
  } = useReportUserData(token, archetypeId || '');

  useEffect(() => {
    if (!isAdminView && isValidAccess && archetypeId && token && !hasTrackedAccessRef.current) {
      console.log(`[ReportViewer] Tracking access for ${archetypeId} with token ${token.substring(0, 5)}...`);
      
      trackReportAccess(archetypeId, token)
        .then(() => {
          console.log('[ReportViewer] Successfully tracked report access client-side');
          hasTrackedAccessRef.current = true;
        })
        .catch(err => {
          console.error('[ReportViewer] Error tracking report access client-side:', err);
        });
    }
  }, [archetypeId, token, isValidAccess, isAdminView]);

  useEffect(() => {
    if (!userDataLoading) {
      logTokenState('user_data_loaded', {
        isValid: isValidAccess,
        hasError: !!userDataError,
        hasUserData: !!userData
      });
    }
  }, [userDataLoading, isValidAccess, userDataError, userData, logTokenState]);

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
  
  useEffect(() => {
    if (!reportLoading) {
      logTokenState('report_data_loaded', {
        hasReportData: !!reportData,
        hasError: !!reportError,
        isFallbackData
      });
    }
  }, [reportLoading, reportData, reportError, isFallbackData, logTokenState]);
  
  useEffect(() => {
    setIsUsingFallbackData(isFallbackData || false);
  }, [isFallbackData]);
  
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
  
  useEffect(() => {
    logTokenState('token_status_updated', {
      tokenStatus,
      lastCheck: new Date(lastStatusCheck).toISOString(),
      errorDetails: tokenErrorDetails
    });
  }, [tokenStatus, lastStatusCheck, tokenErrorDetails, logTokenState]);
  
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

  const handleRequestNewToken = useCallback(() => {
    const emailSubject = `Token renewal request for ${archetypeId}`;
    const emailBody = `Hi, my token for archetype ${archetypeId} has expired. Please provide a new access token.`;
    window.open(`mailto:support@example.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`);
    
    logTokenState('request_new_token', { archetypeId });
  }, [archetypeId, logTokenState]);

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
      validationFrequency: '30 minutes',
      trackingMethods: {
        clientSide: hasTrackedAccessRef.current,
        trackingPixel: trackingPixelLoadedRef.current
      }
    }
  };

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
    
    setTimeout(() => {
      if (refreshData) {
        console.log('[ReportViewer] Attempting recovery by refreshing data');
        refreshData();
      }
    }, 2000);
  }, [refreshData, logTokenState]);
  
  const clearDebugLogs = useCallback(() => {
    try {
      localStorage.removeItem('tokenDebugLog');
      toast.success('Debug logs cleared');
    } catch (e) {
      console.error('Error clearing debug logs:', e);
    }
  }, []);

  const handleTrackingPixelLoad = useCallback(() => {
    console.log('[ReportViewer] Tracking pixel loaded successfully');
    trackingPixelLoadedRef.current = true;
  }, []);
  
  const handleTrackingPixelError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('[ReportViewer] Tracking pixel failed to load:', e);
    // Gracefully handle the error without affecting user experience
  }, []);

  if (userDataLoading || reportLoading) {
    return <ReportLoadingState />;
  }

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
  
  const shouldShowError = 
    !isValidArchetype || 
    (!isAdminView && !isValidAccess && !reportData && !isUsingFallbackData) || 
    (!reportData && reportError && !isUsingFallbackData);
  
  if (shouldShowError) {
    return errorElement;
  }

  if (tokenStatus === 'error' && isUsingFallbackData && reportData) {
    return (
      <ErrorBoundary onError={handleError} name="Report Viewer">
        <div className="min-h-screen bg-gray-50">
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
            hideDebugTools={true}
          />
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary onError={handleError} name="Report Viewer">
      {/* Use the new TrackingPixel component */}
      {!isAdminView && token && archetypeId && (
        <TrackingPixel
          archetypeId={archetypeId}
          token={token}
          onLoad={handleTrackingPixelLoad}
          onError={handleTrackingPixelError}
        />
      )}
      
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
        hideDebugTools={true}
      />
      
      {import.meta.env.DEV && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-2 flex items-center justify-between text-xs z-50">
          <div>Token: {tokenStatus} | Cache: {isUsingFallbackData ? 'Using Fallback' : 'Fresh'} | Pixel: {trackingPixelLoadedRef.current ? 'Loaded' : 'Not Loaded'}</div>
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
