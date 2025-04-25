
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArchetypeId, ArchetypeDeepDive } from '@/types/archetype';

export const useArchetypeDeepDive = (archetypeId: ArchetypeId) => {
  return useQuery({
    queryKey: ['archetype-deep-dive', archetypeId],
    queryFn: async () => {
      // Get deep dive report data
      const { data, error } = await supabase
        .from('Analysis_Archetype_Deep_Dive_Reports')
        .select('*')
        .eq('archetype_id', archetypeId)
        .single();

      if (error) throw error;

      return data as ArchetypeDeepDive;
    },
    enabled: !!archetypeId
  });
};
