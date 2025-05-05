
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { fetchTokenAccess } from './reports/useFetchReportData';

export interface ReportUserData {
  id: string;
  name?: string;
  organization?: string;
  email?: string;
  created_at?: string;
  assessment_result?: any;
  exact_employee_count?: number;
  status?: 'active' | 'inactive' | 'expiring-soon' | 'grace-period';
}

interface UseReportUserDataResult {
  userData: ReportUserData | null;
  isLoading: boolean;
  isValid: boolean;
  error: Error | null;
  debugInfo: any;
}

// Hook to check the validity of a report access token and fetch associated user data
export const useReportUserData = (token: string | undefined, archetypeId: string): UseReportUserDataResult => {
  const [userData, setUserData] = useState<ReportUserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});
  
  // For admin-view special token, provide default user data
  useEffect(() => {
    if (token === 'admin-view') {
      setUserData({
        id: 'admin',
        name: 'Admin View',
        organization: 'Admin Console',
        email: 'admin@example.com',
        status: 'active'
      });
      setIsValid(true);
      setIsLoading(false);
      setDebugInfo({
        isAdminView: true,
        timestamp: new Date().toISOString()
      });
      return;
    }
    
    // Real token validation with useFetchReportData
    const validateToken = async () => {
      try {
        if (!token || !archetypeId) {
          setIsValid(false);
          setUserData(null);
          setError(new Error('Missing token or archetype ID'));
          setIsLoading(false);
          return;
        }
        
        const validationStartTime = Date.now();
        console.log(`[useReportUserData] Validating token for ${archetypeId}...`);
        const { data, error, debugInfo } = await fetchTokenAccess(archetypeId, token);
        const validationTime = Date.now() - validationStartTime;
        
        if (error) {
          setError(new Error(error.message || 'Invalid token'));
          setIsValid(false);
          setUserData(null);
          setDebugInfo({
            ...debugInfo,
            validationTime,
            timestamp: new Date().toISOString()
          });
          console.warn(`[useReportUserData] Token validation failed in ${validationTime}ms:`, error);
        } else if (data) {
          setUserData(data);
          setIsValid(true);
          setError(null);
          setDebugInfo({
            ...debugInfo,
            validationTime,
            tokenStatus: data.status,
            timestamp: new Date().toISOString()
          });
          console.log(`[useReportUserData] Token validated successfully in ${validationTime}ms`);
        } else {
          setUserData(null);
          setIsValid(false);
          setError(new Error('Invalid access token'));
          setDebugInfo({
            ...debugInfo,
            validationTime,
            timestamp: new Date().toISOString()
          });
          console.warn(`[useReportUserData] No data returned from token validation in ${validationTime}ms`);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('[useReportUserData] Error during token validation:', err);
        setError(err instanceof Error ? err : new Error('Unknown error validating token'));
        setUserData(null);
        setIsValid(false);
        setIsLoading(false);
        setDebugInfo({
          error: err instanceof Error ? err.message : 'Unknown error',
          timestamp: new Date().toISOString()
        });
      }
    };
    
    validateToken();
  }, [token, archetypeId]);
  
  return { userData, isLoading, isValid, error, debugInfo };
};

export default useReportUserData;
