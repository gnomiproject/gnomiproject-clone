
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
  
  // Use refs to prevent infinite loops
  const hasRunInitialCheckRef = useRef<boolean>(false);
  const validationCountRef = useRef<number>(0);
  const isUnmountedRef = useRef<boolean>(false);
  const lastPropsRef = useRef<string>('');
  
  const checkTokenStatus = useCallback(() => {
    // Skip if unmounted, admin view, or no token
    if (isUnmountedRef.current || !token || isAdminView) {
      if (isAdminView) {
        setTokenStatus('valid');
      }
      return;
    }
    
    // Increment validation count for tracking
    validationCountRef.current += 1;
    
    // Implement maximum validation count to prevent infinite loops
    if (validationCountRef.current > 10) {
      console.warn('[useTokenStatus] Maximum token validation count exceeded, assuming token is valid');
      setTokenStatus('valid');
      return;
    }
    
    setLastStatusCheck(Date.now());
    
    // Client-side token expiration check
    if (userData?.expires_at) {
      const expirationDate = new Date(userData.expires_at);
      const now = new Date();
      const hoursUntilExpiration = (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      
      if (hoursUntilExpiration <= 0) {
        if (hoursUntilExpiration > -24 || reportData) {
          setTokenStatus('grace-period');
        } else {
          setTokenStatus('error');
          setErrorDetails({
            type: 'expiration',
            message: `Token expired on ${expirationDate.toLocaleString()}`,
            timestamp: Date.now()
          });
        }
        return;
      }
      
      // Token will expire soon
      if (hoursUntilExpiration <= 24) {
        setTokenStatus('warning');
        return;
      }
    }
    
    // Handle server validation errors
    if (userDataError && !reportData) {
      setTokenStatus('error');
      setErrorDetails({
        type: 'token',
        message: userDataError.message,
        timestamp: Date.now()
      });
      return;
    }
    
    if (!isValidAccess && !reportData) {
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
  }, [token, isAdminView, isValidAccess, userDataError, userData?.expires_at, reportData]);

  // Only run initial check once
  useEffect(() => {
    if (hasRunInitialCheckRef.current) return;
    
    hasRunInitialCheckRef.current = true;
    
    // Create a stable props string to detect real changes
    const currentProps = JSON.stringify({
      token: token?.substring(0, 10),
      isAdminView,
      isValidAccess,
      hasUserDataError: !!userDataError,
      hasReportData: !!reportData,
      expiresAt: userData?.expires_at
    });
    
    // Only run if props actually changed
    if (currentProps !== lastPropsRef.current) {
      lastPropsRef.current = currentProps;
      
      const timer = setTimeout(() => {
        if (!isUnmountedRef.current) {
          checkTokenStatus();
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [token, isAdminView, isValidAccess, userDataError, reportData, userData?.expires_at, checkTokenStatus]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isUnmountedRef.current = true;
    };
  }, []);

  return {
    tokenStatus,
    lastStatusCheck,
    errorDetails,
    checkTokenStatus
  };
};
