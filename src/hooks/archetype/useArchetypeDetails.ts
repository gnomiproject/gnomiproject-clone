import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { ArchetypeId, ArchetypeDetailedData, ArchetypeSummary, ArchetypeColor } from '@/types/archetype';

export const useArchetypeDetails = () => {
  const [allDetailedArchetypes, setAllDetailedArchetypes] = useState<ArchetypeDetailedData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all detailed archetype data on mount
  useEffect(() => {
    const fetchDetailedArchetypes = async () => {
      try {
        setLoading(true);
        
        // Get base archetype data from Core_Archetype_Overview
        const { data: archetypes, error: archetypesError } = await supabase
          .from('Core_Archetype_Overview')
          .select('*');
        
        if (archetypesError) throw archetypesError;

        // Get SWOT analysis data from Analysis_Archetype_SWOT
        const { data: swotData, error: swotError } = await supabase
          .from('Analysis_Archetype_SWOT')
          .select('*');
        
        if (swotError) throw swotError;

        // Transform the data to match our interface
        const detailedArchetypes = archetypes.map(archetype => {
          const swot = swotData?.find(s => s.archetype_id === archetype.id);
          
          return {
            id: archetype.id as ArchetypeId,
            familyId: archetype.family_id as 'a' | 'b' | 'c',
            name: archetype.name,
            familyName: '', // Will be populated by family data join
            color: 'primary' as ArchetypeColor,
            hexColor: archetype.hex_color,
            summary: {
              description: archetype.short_description,
              keyCharacteristics: []
            },
            standard: {
              fullDescription: archetype.long_description,
              keyCharacteristics: [],
              overview: '',
              keyStatistics: {
                emergencyUtilization: { value: 'N/A', trend: 'neutral' },
                specialistUtilization: { value: 'N/A', trend: 'neutral' },
                healthcareSpend: { value: 'N/A', trend: 'neutral' }
              },
              keyInsights: []
            },
            enhanced: {
              riskProfile: {
                score: '',
                comparison: '',
                conditions: []
              },
              strategicPriorities: [],
              swot: {
                strengths: swot?.strengths || [],
                weaknesses: swot?.weaknesses || [],
                opportunities: swot?.opportunities || [],
                threats: swot?.threats || []
              },
              costSavings: []
            }
          } as ArchetypeDetailedData;
        });
        
        setAllDetailedArchetypes(detailedArchetypes);
      } catch (error) {
        console.error('Error fetching detailed archetype data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetailedArchetypes();
  }, []);

  // Get detailed archetype by ID - FIXED to not use hooks inside the function
  const getArchetypeDetailedById = (archetypeId: ArchetypeId) => {
    // Return the archetype data directly from allDetailedArchetypes
    return allDetailedArchetypes.find(archetype => archetype.id === archetypeId) || null;
  };

  // Get detailed archetype summaries by family
  const getDetailedArchetypesByFamily = (familyId: 'a' | 'b' | 'c') => {
    return allDetailedArchetypes.filter(archetype => archetype.familyId === familyId);
  };

  // Get archetype summary
  const getArchetypeSummary = (archetypeId: ArchetypeId) => {
    return null;
  };

  // Get archetype standard info
  const getArchetypeStandard = (archetypeId: ArchetypeId) => {
    return null;
  };

  // Get archetype summaries by family
  const getArchetypeSummariesByFamily = (familyId: 'a' | 'b' | 'c') => {
    return [];
  };

  return {
    allDetailedArchetypes,
    isLoading: loading,
    getArchetypeSummary,
    getArchetypeStandard,
    getDetailedArchetypesByFamily,
    getArchetypeDetailedById,
    getArchetypeSummariesByFamily,
    allArchetypeSummaries: []
  };
};
