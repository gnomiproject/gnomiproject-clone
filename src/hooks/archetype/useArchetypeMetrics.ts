
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArchetypeId } from '@/types/archetype';

// Define interface for archetype traits
export interface ArchetypeTraits {
  diseasePatterns: Array<{ condition: string; variance: number }>;
  utilizationPatterns: Array<{ category: string; variance: number }>;
  uniqueInsights: string[];
}

export const useArchetypeMetrics = () => {
  // Function to get metrics for a specific archetype
  const getMetricsForArchetype = (archetypeId: ArchetypeId) => {
    return useQuery({
      queryKey: ['archetype-metrics', archetypeId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('Core_Archetypes_Metrics')
          .select('*')
          .eq('id', archetypeId)
          .single();
          
        if (error) throw error;
        return data;
      },
      enabled: !!archetypeId
    });
  };
  
  // Function to get distinctive metrics for an archetype
  const getDistinctiveMetricsForArchetype = async (archetypeId: ArchetypeId) => {
    const { data, error } = await supabase
      .from('Analysis_Archetype_Distinctive_Metrics')
      .select('*')
      .eq('archetype_id', archetypeId)
      .order('difference', { ascending: false });
      
    if (error) throw error;
    return data;
  };
  
  // Function to get categorized metrics
  const getCategorizedMetricsForArchetype = async (archetypeId: ArchetypeId, category: string) => {
    const { data, error } = await supabase
      .from('Analysis_Archetype_Distinctive_Metrics')
      .select('*')
      .eq('archetype_id', archetypeId)
      .eq('category', category);
      
    if (error) throw error;
    return data;
  };
  
  // Function to get traits for an archetype - returning a concrete object instead of a promise
  const getTraitsForArchetype = (archetypeId: ArchetypeId): ArchetypeTraits => {
    // Mock data for now - in a real implementation, this would fetch from the database
    return {
      diseasePatterns: [
        { condition: "Type 2 Diabetes", variance: 12.5 },
        { condition: "Hypertension", variance: 8.7 },
        { condition: "Mental Health Disorders", variance: -4.3 },
        { condition: "Cancer", variance: -2.1 }
      ],
      utilizationPatterns: [
        { category: "Emergency Room", variance: -15.2 },
        { category: "Specialist Visits", variance: 6.8 },
        { category: "Preventative Care", variance: 9.4 },
        { category: "Pharmacy Utilization", variance: 3.2 }
      ],
      uniqueInsights: [
        "Significantly lower emergency department utilization",
        "Higher engagement with preventative services",
        "Better medication adherence for chronic conditions",
        "Lower than average mental health service utilization"
      ]
    };
  };
  
  return {
    getMetricsForArchetype,
    getDistinctiveMetricsForArchetype,
    getCategorizedMetricsForArchetype,
    getTraitsForArchetype,
    isLoading: false,
    error: null
  };
};
