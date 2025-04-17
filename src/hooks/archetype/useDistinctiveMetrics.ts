
import { useState, useEffect } from 'react';
import { ArchetypeId } from '@/types/archetype';
import { supabase } from "@/integrations/supabase/client";

export interface DistinctiveMetric {
  Metric: string;
  archetype_ID: string;
  Difference: number;
  "Archetype Average": number;
  "Archetype Value": number;
  Category: string;
  definition?: string;
}

export const useDistinctiveMetrics = (archetypeId?: ArchetypeId) => {
  const [distinctiveMetrics, setDistinctiveMetrics] = useState<DistinctiveMetric[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDistinctiveMetrics = async () => {
      if (!archetypeId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Fix: Using the correct table name from the database schema
        const { data, error } = await supabase
          .from('archetype_distinctive_metrics_table')
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
