
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserData {
  id: string;
  name?: string;
  email?: string;
  organization?: string;
  created_at?: string;
  archetype_id?: string;
  status?: string;
  exact_employee_count?: number;
}

export const useUserData = (token?: string, skipCache = false) => {
  const [data, setData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Fetch user data using the token
      const { data, error } = await supabase
        .from('report_requests')
        .select('*')
        .eq('access_token', token)
        .single();

      if (error) {
        console.error('[useUserData] Error fetching user data:', error);
        setError(new Error(error.message));
        setData(null);
      } else if (data) {
        setData(data as UserData);
        setError(null);
      }
    } catch (err) {
      console.error('[useUserData] Error in userData hook:', err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching user data'));
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
};

export default useUserData;
