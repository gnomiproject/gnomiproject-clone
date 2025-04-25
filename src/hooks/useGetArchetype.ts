
import { useState, useEffect } from 'react';
import { useArchetypes } from './useArchetypes';
import { ArchetypeId, ArchetypeDetailedData, ArchetypeColor } from '@/types/archetype';
import { supabase } from "@/integrations/supabase/client";
import { getArchetypeColor, getArchetypeHexColor } from '@/components/home/utils/dna/colors';

export const useGetArchetype = (archetypeId: ArchetypeId) => {
  const { getFamilyById } = useArchetypes();
  const [archetypeData, setArchetypeData] = useState<ArchetypeDetailedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchArchetypeData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch detailed archetype data from Core_Archetype_Overview
        const { data, error } = await supabase
          .from('Core_Archetype_Overview')
          .select('*')
          .eq('id', archetypeId)
          .maybeSingle();

        if (error) {
          throw new Error(`Error fetching archetype data: ${error.message}`);
        }

        // Get SWOT analysis data
        const { data: swotData, error: swotError } = await supabase
          .from('Analysis_Archetype_SWOT')
          .select('*')
          .eq('archetype_id', archetypeId)
          .maybeSingle();
          
        if (swotError) {
          console.warn(`Warning: Could not fetch SWOT data for archetype ${archetypeId}: ${swotError.message}`);
        }

        if (data) {
          // Transform the database data to match our TypeScript type structure
          // Ensuring all JSON arrays are properly converted to string arrays
          const transformedData: ArchetypeDetailedData = {
            id: data.id as ArchetypeId,
            familyId: data.family_id as 'a' | 'b' | 'c',
            name: data.name,
            familyName: '', // Will be populated later using getFamilyById
            // Map the color to a valid ArchetypeColor using the existing utility function
            color: getArchetypeColor(archetypeId) as ArchetypeColor,
            hexColor: data.hex_color || getArchetypeHexColor(archetypeId),
            fullDescription: data.long_description || '',
            keyFindings: [],
            // Add the summary property for compatibility with the updated type
            summary: {
              description: data.short_description || '',
              keyCharacteristics: []
            },
            standard: {
              fullDescription: data.long_description || '',
              keyCharacteristics: [],
              overview: data.short_description || '',
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
                // Convert JSON values to string arrays with proper type checking
                strengths: swotData?.strengths 
                  ? Array.isArray(swotData.strengths) 
                    ? swotData.strengths.map(item => String(item)) 
                    : []
                  : [],
                weaknesses: swotData?.weaknesses 
                  ? Array.isArray(swotData.weaknesses) 
                    ? swotData.weaknesses.map(item => String(item)) 
                    : []
                  : [],
                opportunities: swotData?.opportunities 
                  ? Array.isArray(swotData.opportunities) 
                    ? swotData.opportunities.map(item => String(item)) 
                    : []
                  : [],
                threats: swotData?.threats 
                  ? Array.isArray(swotData.threats) 
                    ? swotData.threats.map(item => String(item)) 
                    : []
                  : []
              },
              costSavings: []
            }
          };
          
          setArchetypeData(transformedData);
        } else {
          // If archetype not found, set null
          setArchetypeData(null);
          setError(new Error(`Archetype ${archetypeId} not found`));
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        console.error('Error in useGetArchetype:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (archetypeId) {
      fetchArchetypeData();
    } else {
      setIsLoading(false);
      setArchetypeData(null);
    }
  }, [archetypeId]);

  // Get family data if we have an archetype
  const familyData = archetypeData?.familyId ? getFamilyById(archetypeData.familyId) : undefined;

  return {
    archetypeData,
    familyData,
    isLoading,
    error
  };
};
