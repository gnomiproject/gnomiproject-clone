
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArchetypeId } from '@/types/archetype';

export const useArchetypeBasics = () => {
  const { data: archetypeData, isLoading, error, refetch } = useQuery({
    queryKey: ['archetype-basics'],
    queryFn: async () => {
      // Get basic archetype information from Core_Archetype_Overview
      const { data: archetypeBasics, error: archetypeError } = await supabase
        .from('Core_Archetype_Overview')
        .select('*');

      // Get family names from Core_Archetype_Families
      const { data: familyData, error: familyError } = await supabase
        .from('Core_Archetype_Families')
        .select('*');

      if (archetypeError || familyError) throw (archetypeError || familyError);
      
      // Get archetype summaries from Analysis_Archetype_Full_Reports
      const { data: archetypeSummaries, error: summariesError } = await supabase
        .from('Analysis_Archetype_Full_Reports')
        .select('archetype_id, key_findings');
        
      if (summariesError) throw summariesError;

      // Combine the data
      const combinedData = archetypeBasics.map(archetype => {
        const summary = archetypeSummaries?.find(
          summary => summary.archetype_id === archetype.id
        );
        
        // Find the corresponding family name
        const family = familyData?.find(f => f.id === archetype.family_id);
        
        return {
          id: archetype.id,
          name: archetype.name,
          familyId: archetype.family_id,
          familyName: family?.name || '', // Add family name
          description: archetype.short_description,
          color: archetype.hex_color,
          keyCharacteristics: summary?.key_findings || []
        };
      });

      return combinedData;
    }
  });

  // Helper function to get archetype by ID
  const getArchetypeById = (id: string) => {
    return archetypeData?.find(archetype => archetype.id === id) || null;
  };

  // Helper function to get archetypes by family
  const getArchetypesByFamily = (familyId: string) => {
    return archetypeData?.filter(archetype => archetype.familyId === familyId) || [];
  };

  return {
    archetypes: archetypeData || [],
    allArchetypes: archetypeData || [],
    getArchetypeById,
    getArchetypesByFamily,
    isLoading,
    error,
    refetch // Export the refetch function
  };
};
