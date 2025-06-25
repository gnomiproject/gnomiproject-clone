
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Archetype, ArchetypeFamily, ArchetypeId, FamilyId } from '@/types/archetype';

export const useArchetypeBasics = () => {
  // Always call the same hooks in the same order
  const archetypesQuery = useQuery({
    queryKey: ['archetype-basics'],
    queryFn: async () => {
      console.log('[RLS Test] Fetching archetype basics...');
      
      const { data: archetypes, error } = await supabase
        .from('Core_Archetype_Overview')
        .select('*');

      if (error) {
        console.error('[RLS Test] Error fetching Core_Archetype_Overview:', error);
        throw error;
      }

      console.log('[RLS Test] Successfully fetched archetypes, count:', archetypes?.length || 0);

      // Transform data to match our types
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
    staleTime: 5 * 60 * 1000, // 5 minutes - don't refetch if data is fresh
    gcTime: 10 * 60 * 1000,   // 10 minutes - keep in memory
    refetchOnWindowFocus: false, // Don't refetch when user switches tabs
    refetchOnReconnect: false,   // Don't refetch on reconnect
    refetchOnMount: false,       // Don't refetch on component mount if data exists
  });

  const familiesQuery = useQuery({
    queryKey: ['family-basics'],
    queryFn: async () => {
      console.log('[RLS Test] Fetching family basics...');
      
      const { data: families, error } = await supabase
        .from('Core_Archetype_Families')
        .select('*');

      if (error) {
        console.error('[RLS Test] Error fetching Core_Archetype_Families:', error);
        throw error;
      }

      console.log('[RLS Test] Successfully fetched families, count:', families?.length || 0);

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
        // Add compatibility with component prop expectations
        description: family.short_description || family.long_description || '',
        commonTraits: Array.isArray(family.common_traits) 
          ? family.common_traits.map(item => String(item))
          : []
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - don't refetch if data is fresh
    gcTime: 10 * 60 * 1000,   // 10 minutes - keep in memory
    refetchOnWindowFocus: false, // Don't refetch when user switches tabs
    refetchOnReconnect: false,   // Don't refetch on reconnect
    refetchOnMount: false,       // Don't refetch on component mount if data exists
  });

  const archetypeData = archetypesQuery.data || [];
  const familyData = familiesQuery.data || [];
  const error = archetypesQuery.error || familiesQuery.error;
  const isLoading = archetypesQuery.isLoading || familiesQuery.isLoading;

  // Helper function to get archetype by ID
  const getArchetypeById = (id: ArchetypeId) => {
    return archetypeData.find(archetype => archetype.id === id) || null;
  };

  // Helper function to get archetypes by family
  const getArchetypesByFamily = (familyId: string) => {
    return archetypeData.filter(archetype => archetype.family_id === familyId) || [];
  };

  // Helper function to get family by ID
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
    // Add for backward compatibility with useArchetypes hook
    allArchetypes: archetypeData
  };
};
