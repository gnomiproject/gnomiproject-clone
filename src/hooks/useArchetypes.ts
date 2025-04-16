
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { 
  Archetype, 
  ArchetypeId, 
  ArchetypeFamily, 
  ArchetypeDetailedData,
  ArchetypeSummary,
  ArchetypeColor
} from '../types/archetype';

export const useArchetypes = () => {
  const [allArchetypes, setAllArchetypes] = useState<Archetype[]>([]);
  const [allFamilies, setAllFamilies] = useState<ArchetypeFamily[]>([]);
  const [allDetailedArchetypes, setAllDetailedArchetypes] = useState<ArchetypeDetailedData[]>([]);
  const [allArchetypeSummaries, setAllArchetypeSummaries] = useState<ArchetypeSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data on mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        // Fetch all required data in parallel
        const [archetypesResponse, familiesResponse, detailedArchetypesResponse] = await Promise.all([
          supabase.from('archetypes').select('*'),
          supabase.from('archetype_families').select('*'),
          supabase.from('archetypes_detailed').select('*')
        ]);
        
        if (archetypesResponse.error) throw archetypesResponse.error;
        if (familiesResponse.error) throw familiesResponse.error;
        if (detailedArchetypesResponse.error) throw detailedArchetypesResponse.error;
        
        // Transform data to match our interfaces
        const archetypes = archetypesResponse.data.map(item => ({
          id: item.id as ArchetypeId,
          name: item.name,
          familyId: item.family_id as 'a' | 'b' | 'c',
          shortDescription: item.short_description,
          longDescription: item.long_description, 
          characteristics: item.characteristics as string[],
          strategicPriorities: item.strategic_priorities as {
            primaryFocus: string;
            secondaryPriorities: string[];
            keyOpportunities: string[];
          },
          riskScore: item.risk_score,
          riskVariance: item.risk_variance,
          primaryRiskDriver: item.primary_risk_driver,
          color: item.color as ArchetypeColor
        }));
        
        const families = familiesResponse.data.map(item => ({
          id: item.id as 'a' | 'b' | 'c',
          name: item.name,
          description: item.description,
          commonTraits: item.common_traits as string[]
        }));
        
        const detailedArchetypes = detailedArchetypesResponse.data.map(item => {
          // Type cast the nested objects for better safety
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
              description: summaryData.description,
              keyCharacteristics: summaryData.keyCharacteristics as string[]
            },
            standard: {
              fullDescription: standardData.fullDescription,
              keyCharacteristics: standardData.keyCharacteristics as string[],
              overview: standardData.overview,
              keyStatistics: {
                ...(standardData.keyStatistics || {}),
                emergencyUtilization: standardData.keyStatistics?.emergencyUtilization || {
                  value: "N/A",
                  trend: "neutral" as "up" | "down" | "neutral"
                },
                specialistUtilization: standardData.keyStatistics?.specialistUtilization || {
                  value: "N/A",
                  trend: "neutral" as "up" | "down" | "neutral"
                },
                healthcareSpend: standardData.keyStatistics?.healthcareSpend || {
                  value: "N/A",
                  trend: "neutral" as "up" | "down" | "neutral"
                }
              },
              keyInsights: standardData.keyInsights as string[]
            },
            enhanced: {
              riskProfile: {
                score: enhancedData.riskProfile?.score,
                comparison: enhancedData.riskProfile?.comparison,
                conditions: enhancedData.riskProfile?.conditions || []
              },
              strategicPriorities: enhancedData.strategicPriorities || [],
              swot: {
                strengths: enhancedData.swot?.strengths || [],
                weaknesses: enhancedData.swot?.weaknesses || [],
                opportunities: enhancedData.swot?.opportunities || [],
                threats: enhancedData.swot?.threats || []
              },
              costSavings: enhancedData.costSavings || []
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
        
        // Update state
        setAllArchetypes(archetypes);
        setAllFamilies(families);
        setAllDetailedArchetypes(detailedArchetypes);
        setAllArchetypeSummaries(summaries);
      } catch (error) {
        console.error('Error fetching archetype data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllData();
  }, []);

  // Get detailed archetype by ID
  const getArchetypeEnhanced = (archetypeId: ArchetypeId) => {
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
            description: summaryData.description,
            keyCharacteristics: summaryData.keyCharacteristics as string[]
          },
          standard: {
            fullDescription: standardData.fullDescription,
            keyCharacteristics: standardData.keyCharacteristics as string[],
            overview: standardData.overview,
            keyStatistics: {
              ...(standardData.keyStatistics || {}),
              emergencyUtilization: standardData.keyStatistics?.emergencyUtilization || {
                value: "N/A",
                trend: "neutral" as "up" | "down" | "neutral"
              },
              specialistUtilization: standardData.keyStatistics?.specialistUtilization || {
                value: "N/A",
                trend: "neutral" as "up" | "down" | "neutral"
              },
              healthcareSpend: standardData.keyStatistics?.healthcareSpend || {
                value: "N/A",
                trend: "neutral" as "up" | "down" | "neutral"
              }
            },
            keyInsights: standardData.keyInsights as string[]
          },
          enhanced: {
            riskProfile: {
              score: enhancedData.riskProfile?.score,
              comparison: enhancedData.riskProfile?.comparison,
              conditions: enhancedData.riskProfile?.conditions || []
            },
            strategicPriorities: enhancedData.strategicPriorities || [],
            swot: {
              strengths: enhancedData.swot?.strengths || [],
              weaknesses: enhancedData.swot?.weaknesses || [],
              opportunities: enhancedData.swot?.opportunities || [],
              threats: enhancedData.swot?.threats || []
            },
            costSavings: enhancedData.costSavings || []
          }
        };
        
        setArchetypeData(transformedData);
      };

      fetchDetailedArchetype();
    }, [archetypeId]);

    return archetypeData;
  };

  // Get archetype by ID
  const getArchetypeById = (id: ArchetypeId) => {
    const [archetype, setArchetype] = useState<Archetype | undefined>(undefined);

    useEffect(() => {
      const fetchArchetype = async () => {
        const { data, error } = await supabase
          .from('archetypes')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching archetype:', error);
          return;
        }
        
        // Transform data to match our interface
        const transformedData: Archetype = {
          id: data.id as ArchetypeId,
          name: data.name,
          familyId: data.family_id as 'a' | 'b' | 'c',
          shortDescription: data.short_description,
          longDescription: data.long_description,
          characteristics: data.characteristics as string[],
          strategicPriorities: data.strategic_priorities as {
            primaryFocus: string;
            secondaryPriorities: string[];
            keyOpportunities: string[];
          },
          riskScore: data.risk_score,
          riskVariance: data.risk_variance,
          primaryRiskDriver: data.primary_risk_driver,
          color: data.color as ArchetypeColor
        };
        
        setArchetype(transformedData);
      };

      fetchArchetype();
    }, [id]);

    return archetype;
  };

  // Get archetypes by family
  const getArchetypesByFamily = (familyId: 'a' | 'b' | 'c') => {
    const [archetypes, setArchetypes] = useState<Archetype[]>([]);

    useEffect(() => {
      const fetchArchetypes = async () => {
        const { data, error } = await supabase
          .from('archetypes')
          .select('*')
          .eq('family_id', familyId);

        if (error) {
          console.error('Error fetching archetypes:', error);
          return;
        }
        
        if (!data?.length) return;
        
        // Transform data to match our interface
        const transformedData = data.map(item => ({
          id: item.id as ArchetypeId,
          name: item.name,
          familyId: item.family_id as 'a' | 'b' | 'c',
          shortDescription: item.short_description,
          longDescription: item.long_description,
          characteristics: item.characteristics as string[],
          strategicPriorities: item.strategic_priorities as {
            primaryFocus: string;
            secondaryPriorities: string[];
            keyOpportunities: string[];
          },
          riskScore: item.risk_score,
          riskVariance: item.risk_variance,
          primaryRiskDriver: item.primary_risk_driver,
          color: item.color as ArchetypeColor
        }));
        
        setArchetypes(transformedData);
      };

      fetchArchetypes();
    }, [familyId]);

    return archetypes;
  };

  // Get family by ID
  const getFamilyById = (id: 'a' | 'b' | 'c') => {
    const [family, setFamily] = useState<ArchetypeFamily | undefined>(undefined);

    useEffect(() => {
      const fetchFamily = async () => {
        const { data, error } = await supabase
          .from('archetype_families')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching family:', error);
          return;
        }
        
        // Transform data to match our interface
        const transformedData: ArchetypeFamily = {
          id: data.id as 'a' | 'b' | 'c',
          name: data.name,
          description: data.description,
          commonTraits: data.common_traits as string[]
        };
        
        setFamily(transformedData);
      };

      fetchFamily();
    }, [id]);

    return family;
  };

  // Get detailed archetype summaries by family
  const getDetailedArchetypesByFamily = (familyId: 'a' | 'b' | 'c') => {
    const [archetypes, setArchetypes] = useState<ArchetypeDetailedData[]>([]);

    useEffect(() => {
      const fetchArchetypes = async () => {
        const { data, error } = await supabase
          .from('archetypes_detailed')
          .select('*')
          .eq('family_id', familyId);

        if (error) {
          console.error('Error fetching detailed archetypes by family:', error);
          return;
        }

        if (!data?.length) return;

        // Transform data to match our interface
        const transformedData: ArchetypeDetailedData[] = data.map(item => {
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
          
          return {
            id: item.id as ArchetypeId,
            familyId: item.family_id as 'a' | 'b' | 'c',
            name: item.name,
            familyName: item.family_name,
            color: item.color as ArchetypeColor,
            summary: {
              description: summaryData.description,
              keyCharacteristics: summaryData.keyCharacteristics as string[]
            },
            standard: {
              fullDescription: standardData.fullDescription,
              keyCharacteristics: standardData.keyCharacteristics as string[],
              overview: standardData.overview,
              keyStatistics: {
                ...(standardData.keyStatistics || {}),
                emergencyUtilization: standardData.keyStatistics?.emergencyUtilization || {
                  value: "N/A",
                  trend: "neutral" as "up" | "down" | "neutral"
                },
                specialistUtilization: standardData.keyStatistics?.specialistUtilization || {
                  value: "N/A",
                  trend: "neutral" as "up" | "down" | "neutral"
                },
                healthcareSpend: standardData.keyStatistics?.healthcareSpend || {
                  value: "N/A",
                  trend: "neutral" as "up" | "down" | "neutral"
                }
              },
              keyInsights: standardData.keyInsights as string[]
            },
            enhanced: {
              riskProfile: {
                score: enhancedData.riskProfile?.score,
                comparison: enhancedData.riskProfile?.comparison,
                conditions: enhancedData.riskProfile?.conditions || []
              },
              strategicPriorities: enhancedData.strategicPriorities || [],
              swot: {
                strengths: enhancedData.swot?.strengths || [],
                weaknesses: enhancedData.swot?.weaknesses || [],
                opportunities: enhancedData.swot?.opportunities || [],
                threats: enhancedData.swot?.threats || []
              },
              costSavings: enhancedData.costSavings || []
            }
          };
        });

        setArchetypes(transformedData);
      };

      fetchArchetypes();
    }, [familyId]);

    return archetypes;
  };

  // Get archetype summary
  const getArchetypeSummary = (archetypeId: ArchetypeId) => {
    return allArchetypeSummaries.find(summary => summary.id === archetypeId) || null;
  };

  // Get archetype standard
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

  // Get metrics for archetype
  const getMetricsForArchetype = (archetypeId: ArchetypeId) => {
    const [metrics, setMetrics] = useState(null);
    
    useEffect(() => {
      const fetchMetrics = async () => {
        const { data, error } = await supabase
          .from('archetype_metrics')
          .select('*')
          .eq('archetype_id', archetypeId)
          .single();

        if (error) {
          console.error('Error fetching metrics:', error);
          return;
        }
        
        setMetrics(data);
      };

      fetchMetrics();
    }, [archetypeId]);

    return metrics;
  };

  // Get traits for archetype
  const getTraitsForArchetype = (archetypeId: ArchetypeId) => {
    const [traits, setTraits] = useState(null);
    
    useEffect(() => {
      const fetchTraits = async () => {
        const { data, error } = await supabase
          .from('distinctive_traits')
          .select('*')
          .eq('archetype_id', archetypeId)
          .single();

        if (error) {
          console.error('Error fetching traits:', error);
          return;
        }
        
        setTraits(data);
      };

      fetchTraits();
    }, [archetypeId]);

    return traits;
  };

  return {
    getAllArchetypes: allArchetypes,
    getArchetypeById,
    getArchetypesByFamily,
    getAllFamilies: allFamilies,
    getFamilyById,
    getMetricsForArchetype,
    getTraitsForArchetype,
    getDetailedArchetype: getArchetypeEnhanced,
    getAllDetailedArchetypes: allDetailedArchetypes,
    getDetailedArchetypesByFamily,
    getArchetypeSummary,
    getArchetypeStandard,
    getArchetypeEnhanced,
    getAllArchetypeSummaries: allArchetypeSummaries,
    isLoading: loading,
    getArchetypeSummariesByFamily: (familyId: 'a' | 'b' | 'c') => {
      return allArchetypeSummaries.filter(summary => summary.familyId === familyId);
    }
  };
};
