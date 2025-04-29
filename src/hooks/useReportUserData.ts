
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AssessmentResult } from '@/types/assessment';

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
  access_token?: string; // Add access token for debugging
}

export const useReportUserData = (token: string | undefined, archetypeId: string | undefined) => {
  const [userData, setUserData] = useState<ReportUserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      console.log(`[useReportUserData] Starting fetch with token: ${token?.substring(0, 5)}... and archetype: ${archetypeId}`);
      
      if (!token || !archetypeId) {
        console.log('[useReportUserData] Missing token or archetypeId, aborting fetch');
        setIsLoading(false);
        setIsValid(false);
        setDebugInfo({
          reason: 'Missing token or archetypeId',
          token: token ? `${token.substring(0, 5)}...` : null,
          archetypeId
        });
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        console.log(`[useReportUserData] Fetching user data for token: ${token.substring(0, 5)}... and archetype: ${archetypeId}`);
        
        // First, check if the report request exists and is valid
        const { data, error: fetchError } = await supabase
          .from('report_requests')
          .select('*')
          .eq('access_token', token)
          .eq('archetype_id', archetypeId)
          .eq('status', 'active')
          .maybeSingle();
          
        if (fetchError) {
          console.error('[useReportUserData] Error fetching data:', fetchError);
          setDebugInfo({
            stage: 'database_query',
            error: fetchError,
            query: {
              token: token.substring(0, 5) + '...',
              archetypeId
            }
          });
          throw new Error(`Error fetching report user data: ${fetchError.message}`);
        }
        
        console.log('[useReportUserData] Query result:', data ? 'Data found' : 'No data found');
        
        if (!data) {
          console.log('[useReportUserData] No valid report request found');
          setIsValid(false);
          setDebugInfo({
            stage: 'data_validation',
            result: 'no_data',
            query: {
              token: token.substring(0, 5) + '...',
              archetypeId
            }
          });
          throw new Error('Invalid or expired access token');
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
          throw new Error('This report link has expired');
        }
        
        // If we get here, the token is valid, so now update the access count
        const currentAccessCount = data.access_count || 0;
        const newAccessCount = currentAccessCount + 1;
        const currentTime = new Date().toISOString();
        
        // Track this access with a direct update
        const { error: accessUpdateError } = await supabase
          .from('report_requests')
          .update({
            access_count: newAccessCount,
            last_accessed: currentTime
          })
          .eq('access_token', token)
          .eq('archetype_id', archetypeId);
        
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
          token_preview: token.substring(0, 5) + '...'
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
      } finally {
        setIsLoading(false);
        console.log('[useReportUserData] Fetch completed, isValid:', isValid);
      }
    };
    
    fetchUserData();
  }, [token, archetypeId]);
  
  return {
    userData,
    isLoading,
    isValid,
    error,
    debugInfo
  };
};
