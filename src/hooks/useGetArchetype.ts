
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
          const transformedData: ArchetypeDetailedData = {
            id: data.id as ArchetypeId,
            familyId: data.family_id as 'a' | 'b' | 'c',
            name: data.name,
            familyName: '', // Will be populated using getFamilyById
            color: getArchetypeColor(archetypeId),
            hexColor: data.hex_color || getArchetypeHexColor(archetypeId),
            short_description: data.short_description || '',
            long_description: data.long_description || '',
            key_characteristics: Array.isArray(data.key_characteristics) 
              ? data.key_characteristics 
              : data.key_characteristics?.split('\n') || []
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
