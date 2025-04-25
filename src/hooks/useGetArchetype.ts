
import { useState, useEffect } from 'react';
import { useArchetypes } from './useArchetypes';
import { ArchetypeId, ArchetypeDetailedData } from '@/types/archetype';
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
        const { data, error } = await supabase
          .from('Core_Archetype_Overview')
          .select('*')
          .eq('id', archetypeId)
          .maybeSingle();

        if (error) {
          throw new Error(`Error fetching archetype data: ${error.message}`);
        }

        if (data) {
          // Process key_characteristics
          let keyCharacteristics: string[] = [];
          if (data.key_characteristics) {
            if (Array.isArray(data.key_characteristics)) {
              keyCharacteristics = data.key_characteristics.map(String);
            } else if (typeof data.key_characteristics === 'string') {
              // Split by newline if it's a string
              keyCharacteristics = data.key_characteristics.split('\n').filter(item => item.trim() !== '');
            }
          }

          const transformedData: ArchetypeDetailedData = {
            id: data.id as ArchetypeId,
            familyId: data.family_id as any,
            name: data.name,
            familyName: '', // Will be populated using getFamilyById
            color: getArchetypeColor(archetypeId),
            hexColor: data.hex_color || getArchetypeHexColor(archetypeId),
            short_description: data.short_description || '',
            long_description: data.long_description || '',
            key_characteristics: keyCharacteristics,
            family_id: data.family_id as any,
            
            // Add compatibility with components using these properties
            summary: {
              description: data.short_description || '',
              keyCharacteristics: keyCharacteristics
            },
            standard: {
              fullDescription: data.long_description || '',
              keyCharacteristics: keyCharacteristics,
              overview: data.short_description || '',
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
          };
          
          setArchetypeData(transformedData);
        } else {
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

  const familyData = archetypeData?.familyId ? getFamilyById(archetypeData.familyId) : undefined;

  return {
    archetypeData,
    familyData,
    isLoading,
    error
  };
};
