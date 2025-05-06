
import { useState, useCallback, useEffect, useRef } from 'react';

interface UseTokenStatusProps {
  token: string | undefined;
  isAdminView: boolean;
  isValidAccess: boolean;
  userDataError: Error | null;
  userData: any;
  sessionStartTime: number;
  reportData: any | null;
}

interface UseTokenStatusResult {
  tokenStatus: 'valid' | 'checking' | 'warning' | 'error' | 'grace-period';
  lastStatusCheck: number;
  errorDetails: any;
  checkTokenStatus: () => void;
}

export const useTokenStatus = ({
  token,
  isAdminView,
  isValidAccess,
  userDataError,
  userData,
  sessionStartTime,
  reportData
}: UseTokenStatusProps): UseTokenStatusResult => {
  const [tokenStatus, setTokenStatus] = useState<'valid' | 'checking' | 'warning' | 'error' | 'grace-period'>('checking');
  const [lastStatusCheck, setLastStatusCheck] = useState<number>(Date.now());
  const [errorDetails, setErrorDetails] = useState<any>(null);
  
  // Tracking validation to prevent excessive calls
  const validationCountRef = useRef<number>(0);
  const hasRunInitialCheckRef = useRef<boolean>(false);
  const isUnmountedRef = useRef<boolean>(false);
  
  // Store previous props for comparison
  const prevPropsRef = useRef<{
    token?: string;
    isValidAccess?: boolean;
    userDataError?: Error | null;
    reportData?: any | null;
  }>({});

  const checkTokenStatus = useCallback(() => {
    // Skip if unmounted, admin view, or no token
    if (isUnmountedRef.current || !token || isAdminView) return;
    
    // Increment validation count for tracking
    validationCountRef.current += 1;
    
    // Implement maximum validation count to prevent infinite loops
    if (validationCountRef.current > 100) {
      console.warn('[ReportViewer] Maximum token validation count exceeded, assuming token is valid');
      setTokenStatus('valid');
      return;
    }
    
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
    
    // Check if token is about to expire
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
  }, [token, isAdminView, isValidAccess, userDataError, userData, sessionStartTime, reportData]);

  // Detect changes in dependencies that should trigger a revalidation
  const shouldRevalidate = useCallback(() => {
    const prevProps = prevPropsRef.current;
    
    // Check if critical props changed
    const tokenChanged = prevProps.token !== token;
    const validAccessChanged = prevProps.isValidAccess !== isValidAccess;
    const errorChanged = prevProps.userDataError !== userDataError;
    const reportDataChanged = prevProps.reportData !== reportData;
    
    // Update ref with current props
    prevPropsRef.current = {
      token,
      isValidAccess,
      userDataError,
      reportData
    };
    
    return tokenChanged || validAccessChanged || errorChanged || reportDataChanged;
  }, [token, isValidAccess, userDataError, reportData]);

  // Initial token check - run only once on mount
  useEffect(() => {
    if (!token || isAdminView || hasRunInitialCheckRef.current) return;
    
    // Mark that we've run the initial check
    hasRunInitialCheckRef.current = true;
    console.log('[useTokenStatus] Running initial token validation');
    
    // Update refs with initial values to prevent unnecessary revalidations
    prevPropsRef.current = {
      token,
      isValidAccess,
      userDataError,
      reportData
    };
    
    // Run initial check with slight delay to allow other hooks to finish
    const timer = setTimeout(() => {
      if (!isUnmountedRef.current) {
        checkTokenStatus();
      }
    }, 100);
    
    return () => {
      clearTimeout(timer);
      isUnmountedRef.current = true;
    };
  }, [token, isAdminView, isValidAccess, userDataError, reportData, checkTokenStatus]);
  
  // Handle prop changes that should trigger revalidation, but only after the initial check
  useEffect(() => {
    if (hasRunInitialCheckRef.current && shouldRevalidate()) {
      console.log('[useTokenStatus] Critical props changed, revalidating token');
      checkTokenStatus();
    }
  }, [token, isValidAccess, userDataError, reportData, shouldRevalidate, checkTokenStatus]);

  // Set up periodic token checks - once every 30 minutes instead of 5 minutes
  useEffect(() => {
    if (!token || isAdminView) return;
    
    console.log('[useTokenStatus] Setting up periodic token validation (every 30 minutes)');
    
    const timer = setInterval(() => {
      if (!isUnmountedRef.current) {
        checkTokenStatus();
      }
    }, 30 * 60 * 1000); // Every 30 minutes
    
    return () => {
      clearInterval(timer);
    };
  }, [token, isAdminView, checkTokenStatus]);

  return {
    tokenStatus,
    lastStatusCheck,
    errorDetails,
    checkTokenStatus
  };
};
