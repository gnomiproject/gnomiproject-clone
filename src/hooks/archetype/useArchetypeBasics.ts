
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Archetype, ArchetypeFamily, ArchetypeId, FamilyId } from '@/types/archetype';

export const useArchetypeBasics = () => {
  // Use consistent query keys across the app
  const archetypesQuery = useQuery({
    queryKey: ['archetypes'], // Simplified key
    queryFn: async () => {
      console.log('[useArchetypeBasics] Fetching archetypes...');
      
      const { data: archetypes, error } = await supabase
        .from('Core_Archetype_Overview')
        .select('*');

      if (error) {
        console.error('[useArchetypeBasics] Error fetching archetypes:', error);
        throw error;
      }

      console.log('[useArchetypeBasics] Successfully fetched archetypes:', archetypes?.length || 0);

      return archetypes.map((archetype): Archetype => ({
        id: archetype.id as ArchetypeId,
        name: archetype.name,
        family_id: archetype.family_id as FamilyId,
        short_description: archetype.short_description,
        long_description: archetype.long_description,
        hex_color: archetype.hex_color,
        key_characteristics: archetype.key_characteristics ? 
          (Array.isArray(archetype.key_characteristics) 
            ? archetype.key_characteristics.map(item => String(item))
            : typeof archetype.key_characteristics === 'string'
              ? archetype.key_characteristics.split('\n')
              : []) 
          : [],
        industries: archetype.industries
      }));
    },
    staleTime: 30 * 60 * 1000, // 30 minutes - much longer stale time
    gcTime: 60 * 60 * 1000,    // 1 hour - longer cache time
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 0,
    // Force request deduplication
    networkMode: 'online',
  });

  const familiesQuery = useQuery({
    queryKey: ['families'], // Simplified key
    queryFn: async () => {
      console.log('[useArchetypeBasics] Fetching families...');
      
      const { data: families, error } = await supabase
        .from('Core_Archetype_Families')
        .select('*');

      if (error) {
        console.error('[useArchetypeBasics] Error fetching families:', error);
        throw error;
      }

      console.log('[useArchetypeBasics] Successfully fetched families:', families?.length || 0);

      return families.map((family): ArchetypeFamily => ({
        id: family.id as FamilyId,
        name: family.name,
        short_description: family.short_description || '',
        hex_color: family.hex_color,
        common_traits: Array.isArray(family.common_traits) 
          ? family.common_traits.map(item => String(item))
          : [],
        industries: family.industries,
        long_description: family.long_description,
        description: family.short_description || family.long_description || '',
        commonTraits: Array.isArray(family.common_traits) 
          ? family.common_traits.map(item => String(item))
          : []
      }));
    },
    staleTime: 30 * 60 * 1000, // 30 minutes - much longer stale time
    gcTime: 60 * 60 * 1000,    // 1 hour - longer cache time
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 0,
    networkMode: 'online',
  });

  const archetypeData = archetypesQuery.data || [];
  const familyData = familiesQuery.data || [];
  const error = archetypesQuery.error || familiesQuery.error;
  const isLoading = archetypesQuery.isLoading || familiesQuery.isLoading;

  // Helper functions
  const getArchetypeById = (id: ArchetypeId) => {
    return archetypeData.find(archetype => archetype.id === id) || null;
  };

  const getArchetypesByFamily = (familyId: string) => {
    return archetypeData.filter(archetype => archetype.family_id === familyId) || [];
  };

  const getFamilyById = (id: FamilyId) => {
    return familyData.find(family => family.id === id) || null;
  };

  return {
    archetypes: archetypeData,
    families: familyData,
    getArchetypeById,
    getArchetypesByFamily,
    getFamilyById,
    isLoading,
    error,
    allArchetypes: archetypeData
  };
};
