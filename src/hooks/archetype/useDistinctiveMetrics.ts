
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArchetypeId } from '@/types/archetype';

export const useDistinctiveMetrics = (archetypeId?: ArchetypeId) => {
  const { data: distinctiveMetrics, isLoading, error } = useQuery({
    queryKey: ['distinctive-metrics', archetypeId],
    queryFn: async () => {
      if (!archetypeId) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('Analysis_Archetype_Distinctive_Metrics')
        .select('*')
        .eq('archetype_id', archetypeId)
        .order('difference', { ascending: false });
        
      if (error) throw error;
        
      return data.map((metric) => ({
        Metric: metric.metric,
        Category: metric.category,
        "Archetype Value": metric.archetype_value,
        "Archetype Average": metric.archetype_average,
        Difference: metric.difference,
        Significance: metric.significance
      }));
    },
    enabled: !!archetypeId
  });
  
  return {
    distinctiveMetrics: distinctiveMetrics || [],
    isLoading,
    error
  };
};
