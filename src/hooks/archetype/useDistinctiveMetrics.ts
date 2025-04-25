
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
        // Using Analysis_Archetype_Distinctive_Metrics instead
        const { data, error } = await supabase
          .from('Analysis_Archetype_Distinctive_Metrics')
          .select('*')
          .eq('archetype_id', archetypeId)
          .order('difference', { ascending: false })
          .limit(10);

        if (error) {
          throw new Error(`Error fetching distinctive metrics: ${error.message}`);
        }

        // Transform data to match the expected format
        const formattedData: DistinctiveMetric[] = (data || []).map(item => ({
          Metric: item.metric || '',
          archetype_ID: item.archetype_id || '',
          Difference: item.difference || 0,
          "Archetype Average": item.archetype_average || 0,
          "Archetype Value": item.archetype_value || 0,
          Category: item.category || '',
          definition: item.significance || ''
        }));

        setDistinctiveMetrics(formattedData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        console.error('Error in useDistinctiveMetrics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDistinctiveMetrics();
  }, [archetypeId]);

  // New function to fetch SDOH metrics specifically
  const fetchSdohMetrics = async (archetypeId?: ArchetypeId) => {
    if (!archetypeId) return [];
    
    try {
      // Use View_Risk_Factors which contains SDOH data
      const { data, error } = await supabase
        .from('View_Risk_Factors')
        .select('*')
        .eq('id', archetypeId);

      if (error) {
        console.error('Error fetching SDOH metrics:', error);
        return [];
      }

      // Transform to expected format
      return (data || []).map(item => {
        const metrics: DistinctiveMetric[] = [];
        
        // Extract SDOH metrics from the data
        Object.entries(item).forEach(([key, value]) => {
          if (key.startsWith('SDOH_') && typeof value === 'number') {
            metrics.push({
              Metric: key.replace('SDOH_', ''),
              archetype_ID: archetypeId,
              Difference: 0, // We don't have this data
              "Archetype Average": 0, // We don't have this data
              "Archetype Value": value,
              Category: 'SDOH',
              definition: 'Social Determinants of Health metric'
            });
          }
        });
        
        return metrics;
      }).flat();
    } catch (err) {
      console.error('Error in fetchSdohMetrics:', err);
      return [];
    }
  };

  return { distinctiveMetrics, isLoading, error, fetchSdohMetrics };
};
