
import { useState, useEffect } from 'react';
import { ArchetypeId } from '@/types/archetype';
import { supabase } from "@/integrations/supabase/client";

export const useDistinctiveMetrics = (archetypeId?: ArchetypeId) => {
  const [distinctiveMetrics, setDistinctiveMetrics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDistinctiveMetrics = async () => {
      if (!archetypeId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Use the view that already exists in Supabase
        const { data, error } = await supabase
          .from('archetype_distinctive_metrics')
          .select('*')
          .eq('archetype_ID', archetypeId)
          .order('Difference', { ascending: false })
          .limit(10);

        if (error) {
          throw new Error(`Error fetching distinctive metrics: ${error.message}`);
        }

        setDistinctiveMetrics(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        console.error('Error in useDistinctiveMetrics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDistinctiveMetrics();
  }, [archetypeId]);

  return { distinctiveMetrics, isLoading, error };
};
