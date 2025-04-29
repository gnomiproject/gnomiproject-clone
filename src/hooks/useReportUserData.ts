
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
}

export const useReportUserData = (token: string | undefined, archetypeId: string | undefined) => {
  const [userData, setUserData] = useState<ReportUserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token || !archetypeId) {
        setIsLoading(false);
        setIsValid(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        console.log(`Fetching user data for token: ${token} and archetype: ${archetypeId}`);
        
        // First, check if the report request exists and is valid
        const { data, error: fetchError } = await supabase
          .from('report_requests')
          .select('*')
          .eq('access_token', token)
          .eq('archetype_id', archetypeId)
          .eq('status', 'active')
          .maybeSingle();
          
        if (fetchError) {
          throw new Error(`Error fetching report user data: ${fetchError.message}`);
        }
        
        if (!data) {
          setIsValid(false);
          throw new Error('Invalid or expired access token');
        }
        
        // Check if the token has expired
        if (data.expires_at && new Date(data.expires_at) < new Date()) {
          setIsValid(false);
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
          console.warn('Could not update access count:', accessUpdateError);
        }
        
        console.log('Found valid report user data:', data);
        
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
          access_url: data.access_url // Include the access_url if available
        };
        
        setUserData(typedUserData);
        setIsValid(true);
      } catch (err) {
        console.error('Error in useReportUserData:', err);
        setError(err instanceof Error ? err : new Error('Unknown error fetching user data'));
        setUserData(null);
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [token, archetypeId]);
  
  return {
    userData,
    isLoading,
    isValid,
    error
  };
};
