
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArchetypeId, ArchetypeDetailed } from '@/types/archetype';

export const useArchetypeDetails = (archetypeId: ArchetypeId) => {
  return useQuery({
    queryKey: ['archetype-details', archetypeId],
    queryFn: async () => {
      // First get base archetype data
      const { data: baseData, error: baseError } = await supabase
        .from('Core_Archetype_Overview')
        .select('*')
        .eq('id', archetypeId)
        .single();

      if (baseError) throw baseError;

      // Get SWOT analysis
      const { data: swotData, error: swotError } = await supabase
        .from('Analysis_Archetype_SWOT')
        .select('*')
        .eq('archetype_id', archetypeId)
        .single();

      if (swotError && swotError.code !== 'PGRST116') throw swotError;

      // Get distinctive metrics
      const { data: metricsData, error: metricsError } = await supabase
        .from('Analysis_Archetype_Distinctive_Metrics')
        .select('*')
        .eq('archetype_id', archetypeId);

      if (metricsError) throw metricsError;

      // Get strategic recommendations
      const { data: recsData, error: recsError } = await supabase
        .from('Analysis_Archetype_Strategic_Recommendations')
        .select('*')
        .eq('archetype_id', archetypeId);

      if (recsError) throw recsError;

      // Combine all data
      const detailedData: ArchetypeDetailed = {
        ...baseData,
        id: archetypeId,
        key_characteristics: Array.isArray(baseData.key_characteristics) 
          ? baseData.key_characteristics 
          : typeof baseData.key_characteristics === 'string'
          ? baseData.key_characteristics.split('\n')
          : [],
        swot: swotData ? {
          strengths: Array.isArray(swotData.strengths) ? swotData.strengths : [],
          weaknesses: Array.isArray(swotData.weaknesses) ? swotData.weaknesses : [],
          opportunities: Array.isArray(swotData.opportunities) ? swotData.opportunities : [],
          threats: Array.isArray(swotData.threats) ? swotData.threats : []
        } : undefined,
        distinctive_metrics: metricsData?.map(m => ({
          metric: m.metric,
          category: m.category,
          archetype_value: m.archetype_value,
          archetype_average: m.archetype_average,
          difference: m.difference,
          significance: m.significance
        })),
        strategic_recommendations: recsData?.map(r => ({
          recommendation_number: r.recommendation_number,
          title: r.title,
          description: r.description,
          metrics_references: r.metrics_references
        }))
      };

      return detailedData;
    },
    enabled: !!archetypeId
  });
};
