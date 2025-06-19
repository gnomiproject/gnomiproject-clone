
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { isValidArchetypeId, normalizeArchetypeId, validateArchetypeId } from '@/utils/archetypeValidation';
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
  
  // Memoize these values to prevent constant recalculation
  const archetypeId = useMemo(() => 
    rawArchetypeId ? normalizeArchetypeId(rawArchetypeId) : undefined, 
    [rawArchetypeId]
  );
  
  const isValidArchetype = useMemo(() => 
    !!archetypeId && isValidArchetypeId(archetypeId), 
    [archetypeId]
  );
  
  const validArchetypeId = useMemo(() => 
    validateArchetypeId(archetypeId || ''), 
    [archetypeId]
  );
  
  const isAdminView = useMemo(() => token === 'admin-view', [token]);
  
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
  
  // Only log once on mount
  useEffect(() => {
    if (!hasValidatedRef.current) {
      hasValidatedRef.current = true;
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
    }
    
    return () => {
      logTokenState('component_unmount', {});
    };
  }, []); // Empty dependency array - only run once

  const {
    userData,
    isLoading: userDataLoading,
    isValid: isValidAccess,
    error: userDataError,
    debugInfo: userDataDebugInfo
  } = useReportUserData(token, archetypeId || '');

  // Only track access once when conditions are met
  useEffect(() => {
    if (!isAdminView && 
        isValidAccess && 
        archetypeId && 
        token && 
        !hasTrackedAccessRef.current) {
      
      hasTrackedAccessRef.current = true;
      console.log(`[ReportViewer] Tracking access for ${archetypeId} with token ${token.substring(0, 5)}...`);
      
      trackReportAccess(archetypeId, token)
        .then(() => {
          console.log('[ReportViewer] Successfully tracked report access client-side');
        })
        .catch(err => {
          console.error('[ReportViewer] Error tracking report access client-side:', err);
        });
    }
  }, [archetypeId, token, isValidAccess, isAdminView]); // Stable dependencies

  const reportAccessResult = validArchetypeId ? useReportAccess({
    archetypeId: validArchetypeId, 
    token: token || '',
    isAdminView,
    skipCache: refreshCounter > 0
  }) : {
    reportData: null,
    archetypeData: null,
    averageData: {},
    isLoading: false,
    error: null,
    debugInfo: {},
    refreshData: () => {},
    isUsingFallbackData: false
  };

  const {
    reportData, 
    archetypeData,
    averageData,
    isLoading: reportLoading,
    error: reportError,
    debugInfo: reportDebugInfo,
    refreshData,
    isUsingFallbackData: isFallbackData = false
  } = reportAccessResult;
  
  // Update fallback state only when it actually changes
  useEffect(() => {
    if (isFallbackData !== isUsingFallbackData) {
      setIsUsingFallbackData(isFallbackData);
    }
  }, [isFallbackData]); // Only depend on isFallbackData
  
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

  // Memoize combined debug info to prevent recalculation
  const combinedDebugInfo = useMemo(() => ({
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
  }), [
    userDataDebugInfo,
    reportDebugInfo,
    isAdminView,
    userDataLoading,
    reportLoading,
    isValidAccess,
    userData,
    reportData,
    tokenStatus,
    lastStatusCheck,
    sessionStartTime,
    isUsingFallbackData
  ]);

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
  }, [logTokenState]);
  
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
      {/* Use the TrackingPixel component only once */}
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
