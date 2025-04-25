
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useArchetypeBasics = () => {
  const { data: archetypeData, isLoading, error } = useQuery({
    queryKey: ['archetype-basics'],
    queryFn: async () => {
      // Get basic archetype information
      const { data: archetypeBasics, error: archetypeError } = await supabase
        .from('Core_Archetype_Overview')
        .select('*');

      if (archetypeError) throw archetypeError;
      
      // Get archetype summaries from full reports
      const { data: archetypeSummaries, error: summariesError } = await supabase
        .from('Analysis_Archetype_Full_Reports')
        .select('archetype_id, key_findings');
        
      if (summariesError) throw summariesError;

      // Combine the data
      const combinedData = archetypeBasics.map(archetype => {
        const summary = archetypeSummaries.find(
          summary => summary.archetype_id === archetype.id
        );
        
        return {
          id: archetype.id,
          name: archetype.name,
          familyId: archetype.family_id,
          description: archetype.short_description,
          color: archetype.hex_color,
          keyCharacteristics: summary?.key_findings || []
        };
      });

      return combinedData;
    }
  });

  return {
    archetypes: archetypeData || [],
    isLoading,
    error
  };
};
