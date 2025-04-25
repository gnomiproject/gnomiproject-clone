
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArchetypeFamily, FamilyId } from '@/types/archetype';

export const useArchetypeFamilies = () => {
  const { data: familyData, isLoading, error } = useQuery({
    queryKey: ['archetype-families'],
    queryFn: async () => {
      const { data: families, error } = await supabase
        .from('Core_Archetype_Families')
        .select('*');

      if (error) throw error;

      return families.map((family): ArchetypeFamily => ({
        id: family.id as FamilyId,
        name: family.name,
        short_description: family.short_description || '',
        hex_color: family.hex_color,
        common_traits: Array.isArray(family.common_traits) 
          ? family.common_traits.map(String)
          : [],
        industries: family.industries,
        long_description: family.long_description,
        // Add compatibility with component prop expectations
        description: family.short_description || family.long_description || '',
        commonTraits: Array.isArray(family.common_traits) 
          ? family.common_traits.map(String)
          : []
      }));
    }
  });

  // Helper function to get family by ID
  const getFamilyById = (id: FamilyId) => {
    return familyData?.find(family => family.id === id) || null;
  };

  return {
    families: familyData || [],
    getFamilyById,
    isLoading,
    error,
    // Add for backward compatibility
    allFamilies: familyData || []
  };
};
