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
    // we will allow viewing with just client-side validation
    const hasLoadedReportData = !!reportData;
    
    // Client-side token expiration check - no network requests
    if (userData?.expires_at) {
      const expirationDate = new Date(userData.expires_at);
      const now = new Date();
      
      // Calculate hours until expiration (negative if expired)
      const hoursUntilExpiration = (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      
      console.log(`[useTokenStatus] Client-side expiration check: ${hoursUntilExpiration.toFixed(2)} hours until expiration`);
      
      // If token is expired
      if (hoursUntilExpiration <= 0) {
        // Check for grace period (within 24 hours of expiration)
        if (hoursUntilExpiration > -24) {
          console.log('[useTokenStatus] Token expired but within grace period');
          setTokenStatus('grace-period');
          return;
        } else {
          // If we already loaded data, still show it
          if (hasLoadedReportData) {
            console.log('[useTokenStatus] Using offline-friendly validation - showing report despite expired token');
            setTokenStatus('grace-period');
            return;
          }
          
          // Otherwise show error
          console.warn('[useTokenStatus] Token expired beyond grace period');
          setTokenStatus('error');
          setErrorDetails({
            type: 'expiration',
            message: `Token expired on ${expirationDate.toLocaleString()}`,
            timestamp: Date.now()
          });
          return;
        }
      }
      
      // If token will expire soon (within 24 hours)
      if (hoursUntilExpiration <= 24) {
        console.warn(`[useTokenStatus] Token will expire soon: ${hoursUntilExpiration.toFixed(2)} hours remaining`);
        setTokenStatus('warning');
        return;
      }
    }
    
    // Check server-provided status if available
    if (userData?.status === 'grace-period') {
      console.warn('[useTokenStatus] Token is in grace period according to server');
      setTokenStatus('grace-period');
      return;
    } else if (userData?.status === 'expiring-soon') {
      console.warn('[useTokenStatus] Token will expire soon according to server');
      setTokenStatus('warning');
      return;
    }
    
    // Handle server validation errors
    if (userDataError) {
      console.warn('[useTokenStatus] Token validation issue:', userDataError.message);
      
      // If we already loaded the report data, show warning but don't block access
      if (hasLoadedReportData) {
        console.log('[useTokenStatus] Using offline-friendly validation - showing report despite token issues');
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
      console.warn('[useTokenStatus] Token is not valid');
      
      // If we already loaded the report, still show it with a warning
      if (hasLoadedReportData) {
        console.log('[useTokenStatus] Using offline-friendly validation - showing report despite invalid token');
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

  // REMOVED: Periodic token checks - we're now using client-side validation only

  return {
    tokenStatus,
    lastStatusCheck,
    errorDetails,
    checkTokenStatus
  };
};
