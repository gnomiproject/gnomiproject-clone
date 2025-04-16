
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { 
  ArchetypeId, 
  ArchetypeDetailedData, 
  ArchetypeSummary,
  ArchetypeColor
} from '@/types/archetype';

export const useArchetypeDetails = () => {
  const [allDetailedArchetypes, setAllDetailedArchetypes] = useState<ArchetypeDetailedData[]>([]);
  const [allArchetypeSummaries, setAllArchetypeSummaries] = useState<ArchetypeSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all detailed archetype data on mount
  useEffect(() => {
    const fetchDetailedArchetypes = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase.from('archetypes_detailed').select('*');
        
        if (error) throw error;
        
        // Transform data to match our interface
        const detailedArchetypes = data.map(item => {
          // Safely parse and type JSON data
          const standardData = typeof item.standard === 'string' 
            ? JSON.parse(item.standard) 
            : item.standard as Record<string, any>;
            
          const summaryData = typeof item.summary === 'string'
            ? JSON.parse(item.summary)
            : item.summary as Record<string, any>;
            
          const enhancedData = typeof item.enhanced === 'string'
            ? JSON.parse(item.enhanced)
            : item.enhanced as Record<string, any>;
          
          // Build the properly typed object
          return {
            id: item.id as ArchetypeId,
            familyId: item.family_id as 'a' | 'b' | 'c',
            name: item.name,
            familyName: item.family_name,
            color: item.color as ArchetypeColor,
            summary: {
              description: summaryData?.description || '',
              keyCharacteristics: summaryData?.keyCharacteristics as string[] || []
            },
            standard: {
              fullDescription: standardData?.fullDescription || '',
              keyCharacteristics: standardData?.keyCharacteristics as string[] || [],
              overview: standardData?.overview || '',
              keyStatistics: {
                ...(standardData?.keyStatistics || {}),
                emergencyUtilization: standardData?.keyStatistics?.emergencyUtilization || {
                  value: "N/A",
                  trend: "neutral" as "up" | "down" | "neutral"
                },
                specialistUtilization: standardData?.keyStatistics?.specialistUtilization || {
                  value: "N/A",
                  trend: "neutral" as "up" | "down" | "neutral"
                },
                healthcareSpend: standardData?.keyStatistics?.healthcareSpend || {
                  value: "N/A",
                  trend: "neutral" as "up" | "down" | "neutral"
                }
              },
              keyInsights: standardData?.keyInsights as string[] || []
            },
            enhanced: {
              riskProfile: {
                score: enhancedData?.riskProfile?.score || '',
                comparison: enhancedData?.riskProfile?.comparison || '',
                conditions: enhancedData?.riskProfile?.conditions || []
              },
              strategicPriorities: enhancedData?.strategicPriorities || [],
              swot: {
                strengths: enhancedData?.swot?.strengths || [],
                weaknesses: enhancedData?.swot?.weaknesses || [],
                opportunities: enhancedData?.swot?.opportunities || [],
                threats: enhancedData?.swot?.threats || []
              },
              costSavings: enhancedData?.costSavings || []
            }
          } as ArchetypeDetailedData;
        });
        
        // Create archetype summaries
        const summaries: ArchetypeSummary[] = detailedArchetypes.map(archetype => ({
          id: archetype.id,
          familyId: archetype.familyId,
          name: archetype.name,
          familyName: archetype.familyName,
          description: archetype.summary.description,
          keyCharacteristics: archetype.summary.keyCharacteristics,
          color: archetype.color
        }));
        
        setAllDetailedArchetypes(detailedArchetypes);
        setAllArchetypeSummaries(summaries);
      } catch (error) {
        console.error('Error fetching detailed archetype data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetailedArchetypes();
  }, []);

  // Get detailed archetype by ID
  const getArchetypeDetailedById = (archetypeId: ArchetypeId) => {
    const [archetypeData, setArchetypeData] = useState<ArchetypeDetailedData | null>(null);
    
    useEffect(() => {
      const fetchDetailedArchetype = async () => {
        const { data, error } = await supabase
          .from('archetypes_detailed')
          .select('*')
          .eq('id', archetypeId)
          .single();
        
        if (error) {
          console.error('Error fetching detailed archetype:', error);
          return;
        }
        
        if (!data) return;

        // Safely parse and type JSON data
        const standardData = typeof data.standard === 'string' 
          ? JSON.parse(data.standard) 
          : data.standard as Record<string, any>;
        
        const summaryData = typeof data.summary === 'string'
          ? JSON.parse(data.summary)
          : data.summary as Record<string, any>;
          
        const enhancedData = typeof data.enhanced === 'string'
          ? JSON.parse(data.enhanced)
          : data.enhanced as Record<string, any>;
        
        // Transform data to match our interface
        const transformedData: ArchetypeDetailedData = {
          id: data.id as ArchetypeId,
          familyId: data.family_id as 'a' | 'b' | 'c',
          name: data.name,
          familyName: data.family_name,
          color: data.color as ArchetypeColor,
          summary: {
            description: summaryData?.description || '',
            keyCharacteristics: summaryData?.keyCharacteristics as string[] || []
          },
          standard: {
            fullDescription: standardData?.fullDescription || '',
            keyCharacteristics: standardData?.keyCharacteristics as string[] || [],
            overview: standardData?.overview || '',
            keyStatistics: {
              ...(standardData?.keyStatistics || {}),
              emergencyUtilization: standardData?.keyStatistics?.emergencyUtilization || {
                value: "N/A",
                trend: "neutral" as "up" | "down" | "neutral"
              },
              specialistUtilization: standardData?.keyStatistics?.specialistUtilization || {
                value: "N/A",
                trend: "neutral" as "up" | "down" | "neutral"
              },
              healthcareSpend: standardData?.keyStatistics?.healthcareSpend || {
                value: "N/A",
                trend: "neutral" as "up" | "down" | "neutral"
              }
            },
            keyInsights: standardData?.keyInsights as string[] || []
          },
          enhanced: {
            riskProfile: {
              score: enhancedData?.riskProfile?.score || '',
              comparison: enhancedData?.riskProfile?.comparison || '',
              conditions: enhancedData?.riskProfile?.conditions || []
            },
            strategicPriorities: enhancedData?.strategicPriorities || [],
            swot: {
              strengths: enhancedData?.swot?.strengths || [],
              weaknesses: enhancedData?.swot?.weaknesses || [],
              opportunities: enhancedData?.swot?.opportunities || [],
              threats: enhancedData?.swot?.threats || []
            },
            costSavings: enhancedData?.costSavings || []
          }
        };
        
        setArchetypeData(transformedData);
      };

      fetchDetailedArchetype();
    }, [archetypeId]);

    return archetypeData;
  };

  // Get detailed archetype summaries by family
  const getDetailedArchetypesByFamily = (familyId: 'a' | 'b' | 'c') => {
    return allDetailedArchetypes.filter(archetype => archetype.familyId === familyId);
  };

  // Get archetype summary
  const getArchetypeSummary = (archetypeId: ArchetypeId) => {
    return allArchetypeSummaries.find(summary => summary.id === archetypeId) || null;
  };

  // Get archetype standard info
  const getArchetypeStandard = (archetypeId: ArchetypeId) => {
    const archetype = allDetailedArchetypes.find(detailed => detailed.id === archetypeId);
    if (!archetype) return null;
    
    return {
      id: archetype.id,
      familyId: archetype.familyId,
      name: archetype.name,
      familyName: archetype.familyName,
      fullDescription: archetype.standard.fullDescription,
      keyCharacteristics: archetype.standard.keyCharacteristics,
      keyInsights: archetype.standard.keyInsights,
      keyStatistics: archetype.standard.keyStatistics
    };
  };

  // Get archetype summaries by family
  const getArchetypeSummariesByFamily = (familyId: 'a' | 'b' | 'c') => {
    return allArchetypeSummaries.filter(summary => summary.familyId === familyId);
  };

  return {
    allDetailedArchetypes,
    allArchetypeSummaries,
    getArchetypeSummary,
    getArchetypeStandard,
    getDetailedArchetypesByFamily,
    getArchetypeDetailedById: getArchetypeDetailedById,
    getArchetypeSummariesByFamily,
    isLoading: loading
  };
};
