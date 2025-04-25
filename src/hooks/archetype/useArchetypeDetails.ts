
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArchetypeId, ArchetypeDetailed, FamilyId, ArchetypeDetailedData } from '@/types/archetype';

export const useArchetypeDetails = (archetypeId?: ArchetypeId) => {
  const query = useQuery({
    queryKey: ['archetype-details', archetypeId],
    queryFn: async () => {
      if (!archetypeId) {
        throw new Error("Archetype ID is required");
      }
      
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

      // Transform swot data to ensure string arrays
      const transformedSwot = swotData ? {
        strengths: Array.isArray(swotData.strengths) ? swotData.strengths.map(String) : [],
        weaknesses: Array.isArray(swotData.weaknesses) ? swotData.weaknesses.map(String) : [],
        opportunities: Array.isArray(swotData.opportunities) ? swotData.opportunities.map(String) : [],
        threats: Array.isArray(swotData.threats) ? swotData.threats.map(String) : []
      } : undefined;

      // Combine all data
      const detailedData: ArchetypeDetailed = {
        ...baseData,
        id: archetypeId,
        family_id: baseData.family_id as FamilyId,
        key_characteristics: Array.isArray(baseData.key_characteristics) 
          ? baseData.key_characteristics.map(String)
          : typeof baseData.key_characteristics === 'string'
          ? baseData.key_characteristics.split('\n')
          : [],
        swot: transformedSwot,
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
          metrics_references: Array.isArray(r.metrics_references) ? r.metrics_references : []
        }))
      };

      return detailedData;
    },
    enabled: !!archetypeId
  });

  // Additional functionality to support existing component usage
  const getAllDetailedArchetypes = async (): Promise<ArchetypeDetailedData[]> => {
    // This is a simplified implementation for backward compatibility
    const { data: archetypes, error } = await supabase
      .from('Core_Archetype_Overview')
      .select('*');
    
    if (error) throw error;
    
    return archetypes.map(arch => ({
      id: arch.id as ArchetypeId,
      name: arch.name,
      familyId: arch.family_id as FamilyId,
      family_id: arch.family_id as FamilyId,
      short_description: arch.short_description,
      long_description: arch.long_description,
      hexColor: arch.hex_color,
      key_characteristics: Array.isArray(arch.key_characteristics) 
        ? arch.key_characteristics.map(String)
        : typeof arch.key_characteristics === 'string'
        ? arch.key_characteristics.split('\n')
        : [],
      summary: {
        description: arch.short_description || '',
        keyCharacteristics: Array.isArray(arch.key_characteristics) 
          ? arch.key_characteristics.map(String)
          : typeof arch.key_characteristics === 'string'
          ? arch.key_characteristics.split('\n')
          : []
      },
      standard: {
        fullDescription: arch.long_description || '',
        keyCharacteristics: Array.isArray(arch.key_characteristics) 
          ? arch.key_characteristics.map(String)
          : typeof arch.key_characteristics === 'string'
          ? arch.key_characteristics.split('\n')
          : [],
        overview: arch.short_description || '',
        keyStatistics: {},
        keyInsights: []
      },
      enhanced: {
        swot: {
          strengths: [],
          weaknesses: [],
          opportunities: [],
          threats: []
        },
        strategicPriorities: [],
        costSavings: []
      }
    }));
  };

  return {
    ...query,
    // Add compatibility with old interface expected by useArchetypes
    allDetailedArchetypes: [], // Will be populated by useArchetypes
    allArchetypeSummaries: [], // Will be populated by useArchetypes
    getArchetypeSummary: () => null,
    getArchetypeStandard: () => null,
    getDetailedArchetypesByFamily: () => [],
    getArchetypeDetailedById: () => null,
    getArchetypeSummariesByFamily: () => [],
    getAllDetailedArchetypes
  };
};
