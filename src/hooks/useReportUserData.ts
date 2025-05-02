
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AssessmentResult } from '@/types/assessment';
import { normalizeArchetypeId } from '@/utils/archetypeValidation';

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

export const useReportUserData = (token: string | undefined, archetypeId: string | undefined, refreshTrigger = 0) => {
  const [userData, setUserData] = useState<ReportUserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const fetchUserData = useCallback(async () => {
    console.log(`[useReportUserData] Starting fetch with token: ${token?.substring(0, 5)}... and archetype: ${archetypeId}`, { refreshTrigger });
    
    if (!token || !archetypeId) {
      console.log('[useReportUserData] Missing token or archetypeId, aborting fetch');
      setIsLoading(false);
      setIsValid(false);
      setDebugInfo({
        reason: 'Missing token or archetypeId',
        token: token ? `${token.substring(0, 5)}...` : null,
        archetypeId,
        timestamp: new Date().toISOString()
      });
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Normalize the archetype ID to handle case sensitivity
      const normalizedArchetypeId = normalizeArchetypeId(archetypeId);
      
      console.log(`[useReportUserData] Fetching user data for token: ${token.substring(0, 5)}... and normalized archetype: ${normalizedArchetypeId}`, {
        refresh: refreshTrigger,
        timestamp: new Date().toISOString()
      });
      
      setDebugInfo({
        stage: 'initial',
        originalArchetypeId: archetypeId,
        normalizedArchetypeId,
        tokenPreview: token.substring(0, 5) + '...',
        refreshTrigger
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
            archetypeId: normalizedArchetypeId,
            timestamp: new Date().toISOString()
          }
        });
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
        } else if (insensitiveData) {
          console.log('[useReportUserData] Found data using case-insensitive search:', insensitiveData.archetype_id);
          // Use this data instead
          setDebugInfo(prev => ({
            ...prev,
            stage: 'case_insensitive_match',
            matchedArchetypeId: insensitiveData.archetype_id,
            timestamp: new Date().toISOString()
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
            throw new Error('This report link has expired');
          }
          
          // Update access count for the matched data
          const currentAccessCount = insensitiveData.access_count || 0;
          const newAccessCount = currentAccessCount + 1;
          const currentTime = new Date().toISOString();
          
          await supabase
            .from('report_requests')
            .update({
              access_count: newAccessCount,
              last_accessed: currentTime
            })
            .eq('id', insensitiveData.id);
              
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
            archetypeId: normalizedArchetypeId,
            timestamp: new Date().toISOString()
          }
        });
        throw new Error('Invalid or expired access token');
      }
      
      // Check if the token has expired
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        console.log('[useReportUserData] Token has expired:', data.expires_at, 'Current time:', new Date().toISOString());
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
        .eq('archetype_id', normalizedArchetypeId);
      
      if (accessUpdateError) {
        console.warn('[useReportUserData] Could not update access count:', accessUpdateError);
        setDebugInfo(prev => ({
          ...prev,
          access_count_update: {
            success: false,
            error: accessUpdateError,
            timestamp: new Date().toISOString()
          }
        }));
      } else {
        console.log('[useReportUserData] Access count updated to:', newAccessCount);
        setDebugInfo(prev => ({
          ...prev,
          access_count_update: {
            success: true,
            new_count: newAccessCount,
            timestamp: new Date().toISOString()
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
        token_preview: token.substring(0, 5) + '...',
        expiresAt: typedUserData.expires_at,
        timestamp: new Date().toISOString()
      });
      
      setUserData(typedUserData);
      setIsValid(true);
      setDebugInfo(prev => ({
        ...prev,
        final_result: 'success',
        userData: {
          id: typedUserData.id,
          name: typedUserData.name,
          organization: typedUserData.organization,
          expiresAt: typedUserData.expires_at,
          timestamp: new Date().toISOString()
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
        error: err instanceof Error ? err.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }));
    } finally {
      setIsLoading(false);
      console.log('[useReportUserData] Fetch completed, isValid:', isValid);
    }
  }, [token, archetypeId, refreshTrigger]);
  
  // Fetch data on mount and when dependencies change
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);
  
  // Function to manually refresh data
  const refreshData = () => {
    console.log('[useReportUserData] Manual refresh triggered');
    fetchUserData();
  };
  
  return {
    userData,
    isLoading,
    isValid,
    error,
    debugInfo,
    refreshData
  };
};
