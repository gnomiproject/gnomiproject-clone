
import { useQuery } from '@tanstack/react-query';
import { ArchetypeId, ArchetypeDetailed, FamilyId, ArchetypeDetailedData } from '@/types/archetype';
import { fetchArchetypeData } from '@/services/archetypeService';
import { supabase } from '@/integrations/supabase/client';

export const useArchetypeDetails = (archetypeId?: ArchetypeId) => {
  const query = useQuery({
    queryKey: ['archetype-details', archetypeId],
    queryFn: async () => {
      if (!archetypeId) {
        throw new Error("Archetype ID is required");
      }
      
      try {
        // First try to get data from level3_report_secure (single source of truth for unlocked reports)
        const secureData = await fetchArchetypeData(archetypeId, false);
        
        if (secureData) {
          console.log("[useArchetypeDetails] Using data from level3_report_secure for", archetypeId);
          return secureData;
        }
      } catch (err) {
        console.warn("[useArchetypeDetails] Failed to fetch from level3_report_secure:", err);
      }
      
      // Fallback to regular data sources if not available in level3_report_secure
      console.log("[useArchetypeDetails] No data in level3_report_secure, falling back to standard tables");
      
      // First get base archetype data
      const { data: baseData, error: baseError } = await supabase
        .from('Core_Archetype_Overview')
        .select('*')
        .eq('id', archetypeId)
        .single();

      if (baseError) throw baseError;

      console.log("[useArchetypeDetails] Base archetype data loaded:", baseData);

      // Get family details if available
      let familyData = null;
      try {
        const { data: familyResult, error: familyError } = await supabase
          .from('Core_Archetype_Families')
          .select('*')
          .eq('id', baseData.family_id)
          .maybeSingle();
        
        if (!familyError && familyResult) {
          familyData = familyResult;
          console.log("[useArchetypeDetails] Family data loaded:", familyData);
        } else if (familyError) {
          console.warn("[useArchetypeDetails] Error loading family data:", familyError);
        }
      } catch (err) {
        console.warn("[useArchetypeDetails] Failed to load family data:", err);
      }

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

      // Resolve family name from available sources
      // Check if baseData has a family_name property using type-safe approach
      const baseFamilyName = 'family_name' in baseData ? baseData.family_name : undefined;
      
      // Then use family name from various sources with fallbacks
      const familyName = 
                   baseFamilyName || 
                   (familyData && familyData.name) || 
                   `${baseData.family_id} Family`;

      console.log("[useArchetypeDetails] Resolved family name:", familyName);

      // Combine all data
      const detailedData: ArchetypeDetailedData = {
        ...baseData,
        id: archetypeId,
        familyId: baseData.family_id as FamilyId,
        family_id: baseData.family_id as FamilyId,
        familyName: familyName,
        family_name: familyName, // Ensure both camelCase and snake_case versions exist
        key_characteristics: Array.isArray(baseData.key_characteristics) 
          ? baseData.key_characteristics.map(String)
          : typeof baseData.key_characteristics === 'string'
          ? baseData.key_characteristics.split('\n')
          : [],
        swot: transformedSwot,
        distinctive_metrics: metricsData?.map(m => ({
          metric: m.metric,
          category: m.category,
          value: m.archetype_value,
          average: m.archetype_average,
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

      console.log("[useArchetypeDetails] Final detailed data:", {
        id: detailedData.id,
        name: detailedData.name,
        familyId: detailedData.familyId, 
        familyName: detailedData.familyName,
        hasSwot: !!detailedData.swot,
        hasStrengths: !!detailedData.strengths
      });

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
