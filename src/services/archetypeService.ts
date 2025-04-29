
import { supabase } from '@/integrations/supabase/client';
import { ArchetypeId } from '@/types/archetype';
import { getCachedArchetype, cacheArchetype } from '@/utils/archetype/cacheUtils';

/**
 * Fetch archetype data from Supabase
 */
export const fetchArchetypeData = async (archetypeId: ArchetypeId, skipCache: boolean = false) => {
  // Verify a valid archetype ID was provided
  if (!archetypeId) {
    throw new Error('Invalid archetype ID provided');
  }
  
  console.log("Fetching data for archetypeId:", archetypeId);
  
  // Check cache first if not explicitly skipping
  const cachedData = getCachedArchetype(archetypeId, skipCache);
  if (cachedData) {
    return cachedData;
  }
  
  const { data, error: fetchError } = await supabase
    .from('level3_report_data')
    .select('*')
    .eq('archetype_id', archetypeId)
    .maybeSingle();

  if (fetchError) {
    throw fetchError;
  }
  
  // Store in cache
  if (data) {
    cacheArchetype(archetypeId, data);
  }

  return data;
};
