
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Archetype, ArchetypeFamily } from '@/types/archetype';

export const useArchetypeBasics = () => {
  const { data: archetypeData, isLoading: isLoadingArchetypes, error: archetypeError } = useQuery({
    queryKey: ['archetype-basics'],
    queryFn: async () => {
      const { data: archetypes, error } = await supabase
        .from('Core_Archetype_Overview')
        .select('*');

      if (error) throw error;

      // Transform data to match our types
      return archetypes.map((archetype): Archetype => ({
        id: archetype.id,
        name: archetype.name,
        family_id: archetype.family_id,
        short_description: archetype.short_description,
        long_description: archetype.long_description,
        hex_color: archetype.hex_color,
        key_characteristics: Array.isArray(archetype.key_characteristics) 
          ? archetype.key_characteristics 
          : typeof archetype.key_characteristics === 'string'
          ? archetype.key_characteristics.split('\n')
          : [],
        industries: archetype.industries
      }));
    }
  });

  const { data: familyData, isLoading: isLoadingFamilies, error: familyError } = useQuery({
    queryKey: ['family-basics'],
    queryFn: async () => {
      const { data: families, error } = await supabase
        .from('Core_Archetype_Families')
        .select('*');

      if (error) throw error;

      return families.map((family): ArchetypeFamily => ({
        id: family.id,
        name: family.name,
        short_description: family.short_description || '',
        hex_color: family.hex_color,
        common_traits: Array.isArray(family.common_traits) 
          ? family.common_traits 
          : [],
        industries: family.industries,
        long_description: family.long_description
      }));
    }
  });

  // Helper function to get archetype by ID
  const getArchetypeById = (id: ArchetypeId) => {
    return archetypeData?.find(archetype => archetype.id === id) || null;
  };

  // Helper function to get archetypes by family
  const getArchetypesByFamily = (familyId: string) => {
    return archetypeData?.filter(archetype => archetype.family_id === familyId) || [];
  };

  // Helper function to get family by ID
  const getFamilyById = (id: FamilyId) => {
    return familyData?.find(family => family.id === id) || null;
  };

  const error = archetypeError || familyError;
  const isLoading = isLoadingArchetypes || isLoadingFamilies;

  return {
    archetypes: archetypeData || [],
    families: familyData || [],
    getArchetypeById,
    getArchetypesByFamily,
    getFamilyById,
    isLoading,
    error
  };
};
