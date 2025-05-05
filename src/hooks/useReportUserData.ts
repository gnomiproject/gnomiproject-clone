import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AssessmentResult } from '@/types/assessment';
import { normalizeArchetypeId } from '@/utils/archetypeValidation';
import { recordTokenCheck } from '@/utils/reports/tokenMonitor';

export interface ReportUserData {
  id: string;
  name: string;
  organization: string;
  email: string;
  created_at: string;
  archetype_id: string;
  assessment_result: AssessmentResult | null;
  exact_employee_count: number | null;
  access_count: number;
  last_accessed: string | null;
  expires_at: string | null;
  access_url?: string;
  access_token?: string;
  status?: 'active' | 'inactive' | 'expired' | 'grace-period' | 'expiring-soon';
}

export const useReportUserData = (token: string | undefined, archetypeId: string | undefined) => {
  const [userData, setUserData] = useState<ReportUserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [validationHistory, setValidationHistory] = useState<{success: boolean, time: number, error?: string}[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      console.log(`[useReportUserData] Starting fetch with token: ${token?.substring(0, 5)}... and archetype: ${archetypeId}`);
      
      // Track validation history
      const recordValidationResult = (success: boolean, errorMessage?: string) => {
        const now = Date.now();
        setValidationHistory(prev => {
          const newHistory = [...prev, { success, time: now, error: errorMessage }];
          // Keep only the last 10 entries to avoid memory issues
          return newHistory.slice(-10);
        });
        
        // If token and archetypeId exist, record the check in token monitor
        if (token && archetypeId) {
          recordTokenCheck(archetypeId, token, success, userData?.expires_at, errorMessage);
        }
      };
      
      if (!token || !archetypeId) {
        console.log('[useReportUserData] Missing token or archetypeId, aborting fetch');
        setIsLoading(false);
        setIsValid(false);
        setDebugInfo({
          reason: 'Missing token or archetypeId',
          token: token ? `${token.substring(0, 5)}...` : null,
          archetypeId,
          validationTime: new Date().toISOString()
        });
        recordValidationResult(false, 'Missing token or archetypeId');
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Normalize the archetype ID to handle case sensitivity
        const normalizedArchetypeId = normalizeArchetypeId(archetypeId);
        
        console.log(`[useReportUserData] Fetching user data for token: ${token.substring(0, 5)}... and normalized archetype: ${normalizedArchetypeId}`);
        setDebugInfo({
          stage: 'initial',
          originalArchetypeId: archetypeId,
          normalizedArchetypeId,
          tokenPreview: token.substring(0, 5) + '...',
          validationTime: new Date().toISOString()
        });
        
        // First, check if the report request exists and is valid
        const { data, error: fetchError } = await supabase
          .from('report_requests')
          .select('*')
          .eq('access_token', token)
          .eq('archetype_id', normalizedArchetypeId)
          .eq('status', 'active')
          .maybeSingle();
          
        if (fetchError) {
          console.error('[useReportUserData] Error fetching data:', fetchError);
          setDebugInfo({
            stage: 'database_query',
            error: fetchError,
            query: {
              token: token.substring(0, 5) + '...',
              archetypeId: normalizedArchetypeId
            },
            validationTime: new Date().toISOString()
          });
          setError(new Error(`Error fetching report user data: ${fetchError.message}`));
          recordValidationResult(false, `Database error: ${fetchError.message}`);
          throw new Error(`Error fetching report user data: ${fetchError.message}`);
        }
        
        console.log('[useReportUserData] Query result:', data ? 'Data found' : 'No data found');
        
        // If no data with normalized ID, try case-insensitive search
        if (!data) {
          console.log('[useReportUserData] Trying case-insensitive search for archetype ID');
          
          const { data: insensitiveData, error: insensitiveError } = await supabase
            .from('report_requests')
            .select('*')
            .eq('access_token', token)
            .ilike('archetype_id', archetypeId)
            .eq('status', 'active')
            .maybeSingle();
            
          if (insensitiveError) {
            console.error('[useReportUserData] Error with case-insensitive search:', insensitiveError);
            recordValidationResult(false, `Case-insensitive search error: ${insensitiveError.message}`);
          } else if (insensitiveData) {
            console.log('[useReportUserData] Found data using case-insensitive search:', insensitiveData.archetype_id);
            // Use this data instead
            setDebugInfo(prev => ({
              ...prev,
              stage: 'case_insensitive_match',
              matchedArchetypeId: insensitiveData.archetype_id
            }));
            
            // Check if the token has expired
            if (insensitiveData.expires_at && new Date(insensitiveData.expires_at) < new Date()) {
              console.log('[useReportUserData] Token has expired:', insensitiveData.expires_at);
              setIsValid(false);
              setDebugInfo(prev => ({
                ...prev,
                stage: 'token_validation',
                result: 'expired',
                expires_at: insensitiveData.expires_at,
                current_time: new Date().toISOString()
              }));
              const expiredMsg = `This report link has expired on ${new Date(insensitiveData.expires_at).toLocaleString()}`;
              setError(new Error(expiredMsg));
              recordValidationResult(false, expiredMsg);
              throw new Error(expiredMsg);
            }
            
            // Update access count for the matched data
            const currentAccessCount = insensitiveData.access_count || 0;
            const newAccessCount = currentAccessCount + 1;
            const currentTime = new Date().toISOString();
            
            try {
              await supabase
                .from('report_requests')
                .update({
                  access_count: newAccessCount,
                  last_accessed: currentTime
                })
                .eq('id', insensitiveData.id);
                
              console.log('[useReportUserData] Access count updated to:', newAccessCount);
            } catch (updateError) {
              console.warn('[useReportUserData] Could not update access count:', updateError);
              // This is non-blocking, don't throw
            }
              
            const typedUserData: ReportUserData = {
              id: insensitiveData.id,
              name: insensitiveData.name,
              organization: insensitiveData.organization,
              email: insensitiveData.email,
              created_at: insensitiveData.created_at,
              archetype_id: insensitiveData.archetype_id,
              assessment_result: insensitiveData.assessment_result ? (insensitiveData.assessment_result as unknown as AssessmentResult) : null,
              exact_employee_count: insensitiveData.exact_employee_count,
              access_count: newAccessCount,
              last_accessed: currentTime,
              expires_at: insensitiveData.expires_at,
              access_url: insensitiveData.access_url,
              access_token: token,
            };
            
            setUserData(typedUserData);
            setIsValid(true);
            setIsLoading(false);
            recordValidationResult(true);
            return;
          }
        }
        
        if (!data) {
          console.log('[useReportUserData] No valid report request found');
          setIsValid(false);
          setDebugInfo({
            stage: 'data_validation',
            result: 'no_data',
            query: {
              token: token.substring(0, 5) + '...',
              archetypeId: normalizedArchetypeId
            },
            validationTime: new Date().toISOString()
          });
          const errorMsg = 'Invalid or expired access token';
          setError(new Error(errorMsg));
          recordValidationResult(false, errorMsg);
          throw new Error(errorMsg);
        }
        
        // Check if the token has expired
        if (data.expires_at && new Date(data.expires_at) < new Date()) {
          console.log('[useReportUserData] Token has expired:', data.expires_at);
          setIsValid(false);
          setDebugInfo({
            stage: 'token_validation',
            result: 'expired',
            expires_at: data.expires_at,
            current_time: new Date().toISOString()
          });
          const expiredMsg = `This report link has expired on ${new Date(data.expires_at).toLocaleString()}`;
          setError(new Error(expiredMsg));
          recordValidationResult(false, expiredMsg);
          throw new Error(expiredMsg);
        }
        
        // If we get here, the token is valid, so now update the access count
        const currentAccessCount = data.access_count || 0;
        const newAccessCount = currentAccessCount + 1;
        const currentTime = new Date().toISOString();
        
        // Track this access with a direct update
        try {
          const { error: accessUpdateError } = await supabase
            .from('report_requests')
            .update({
              access_count: newAccessCount,
              last_accessed: currentTime
            })
            .eq('access_token', token)
            .eq('archetype_id', normalizedArchetypeId);
          
          if (accessUpdateError) {
            console.warn('[useReportUserData] Could not update access count:', accessUpdateError);
            setDebugInfo(prev => ({
              ...prev,
              access_count_update: {
                success: false,
                error: accessUpdateError
              }
            }));
          } else {
            console.log('[useReportUserData] Access count updated to:', newAccessCount);
            setDebugInfo(prev => ({
              ...prev,
              access_count_update: {
                success: true,
                new_count: newAccessCount
              }
            }));
          }
        } catch (updateError) {
          console.warn('[useReportUserData] Error updating access count:', updateError);
          // This is non-blocking, don't throw
        }
        
        console.log('[useReportUserData] Found valid report user data');
        
        // Convert the data to the expected type, handling the assessment_result conversion
        const typedUserData: ReportUserData = {
          id: data.id,
          name: data.name,
          organization: data.organization,
          email: data.email,
          created_at: data.created_at,
          archetype_id: data.archetype_id,
          assessment_result: data.assessment_result ? (data.assessment_result as unknown as AssessmentResult) : null,
          exact_employee_count: data.exact_employee_count,
          access_count: newAccessCount, // Use the updated count
          last_accessed: currentTime, // Use the updated timestamp
          expires_at: data.expires_at,
          access_url: data.access_url, // Include the access_url if available
          access_token: token, // Add token for debugging purposes
        };
        
        console.log('[useReportUserData] Formatted user data:', {
          id: typedUserData.id,
          name: typedUserData.name,
          organization: typedUserData.organization,
          archetypeId: typedUserData.archetype_id,
          hasAssessmentData: !!typedUserData.assessment_result,
          token_preview: token.substring(0, 5) + '...',
          validationTime: new Date().toISOString()
        });
        
        setUserData(typedUserData);
        setIsValid(true);
        setDebugInfo(prev => ({
          ...prev,
          final_result: 'success',
          userData: {
            id: typedUserData.id,
            name: typedUserData.name,
            organization: typedUserData.organization
          }
        }));
        recordValidationResult(true);
      } catch (err) {
        console.error('[useReportUserData] Error:', err);
        setError(err instanceof Error ? err : new Error('Unknown error fetching user data'));
        setUserData(null);
        setIsValid(false);
        setDebugInfo(prev => ({
          ...prev,
          final_result: 'error',
          error: err instanceof Error ? err.message : 'Unknown error'
        }));
        recordValidationResult(false, err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
        console.log('[useReportUserData] Fetch completed, isValid:', isValid);
      }
    };
    
    fetchUserData();
  }, [token, archetypeId, userData?.expires_at]);
  
  return {
    userData,
    isLoading,
    isValid,
    error,
    debugInfo,
    validationHistory
  };
};
