import { useState, useCallback, useEffect } from 'react';

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

  // Initial token check
  useEffect(() => {
    if (!token || isAdminView) return;
    
    checkTokenStatus();
  }, [token, isAdminView, checkTokenStatus, reportData, userData]);

  return {
    tokenStatus,
    lastStatusCheck,
    errorDetails,
    checkTokenStatus
  };
};
