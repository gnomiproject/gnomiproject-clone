
import { useState, useEffect } from 'react';
import { useArchetypes } from './useArchetypes';
import { ArchetypeId, ArchetypeDetailedData } from '@/types/archetype';
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook to get a single archetype with full details by ID
 */
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
        // Fetch detailed archetype data from Supabase
        const { data, error } = await supabase
          .from('archetypes_detailed')
          .select('*')
          .eq('id', archetypeId)
          .maybeSingle();

        if (error) {
          throw new Error(`Error fetching archetype data: ${error.message}`);
        }

        if (data) {
          // Transform the database data to match our TypeScript type structure
          const transformedData: ArchetypeDetailedData = {
            id: data.id as ArchetypeId,
            familyId: data.family_id as 'a' | 'b' | 'c',
            name: data.name,
            familyName: data.family_name,
            color: data.color,
            summary: typeof data.summary === 'string' ? JSON.parse(data.summary) : data.summary,
            standard: typeof data.standard === 'string' ? JSON.parse(data.standard) : data.standard,
            enhanced: typeof data.enhanced === 'string' ? JSON.parse(data.enhanced) : data.enhanced,
          };
          
          setArchetypeData(transformedData);
        } else {
          // Fallback to existing method if not found in database
          const { getArchetypeEnhanced } = useArchetypes();
          const localArchetypeData = getArchetypeEnhanced(archetypeId);
          setArchetypeData(localArchetypeData);
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
