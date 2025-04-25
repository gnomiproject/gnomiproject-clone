
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArchetypeId } from '@/types/archetype';

// Define the DistinctiveMetric type that will be exported
export interface DistinctiveMetric {
  Metric: string;
  Category: string;
  "Archetype Value": number;
  "Archetype Average": number;
  Difference: number;
  Significance: string;
  archetype_ID?: string;
  definition?: string;
}

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
  
  // Add the fetchSdohMetrics function
  const fetchSdohMetrics = async (archetypeId: ArchetypeId): Promise<DistinctiveMetric[]> => {
    try {
      // In a real implementation, fetch actual SDOH metrics from the database
      // For now, we'll return mock data as in the DeepReportDetailedMetrics component
      return [
        {
          Metric: "Healthcare Access",
          Category: "SDOH",
          "Archetype Value": 76.5,
          "Archetype Average": 68.2,
          Difference: 8.3,
          Significance: "Indicates better than average healthcare accessibility"
        },
        {
          Metric: "Food Access",
          Category: "SDOH",
          "Archetype Value": 82.1,
          "Archetype Average": 75.8,
          Difference: 6.3,
          Significance: "Indicates better than average food accessibility"
        },
        {
          Metric: "Economic Security",
          Category: "SDOH",
          "Archetype Value": 71.2,
          "Archetype Average": 65.9,
          Difference: 5.3,
          Significance: "Indicates better than average economic security"
        }
      ];
    } catch (error) {
      console.error("Error fetching SDOH metrics:", error);
      return [];
    }
  };
  
  return {
    distinctiveMetrics: distinctiveMetrics || [],
    isLoading,
    error,
    fetchSdohMetrics
  };
};
