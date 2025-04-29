
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
  
  try {
    // Use the secure view instead of direct table access
    const { data, error: fetchError } = await supabase
      .from('level3_report_secure')
      .select('*')
      .eq('archetype_id', archetypeId)
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching archetype data:", fetchError);
      
      // If secure view fails, try falling back to Core_Archetype_Overview
      const { data: coreData, error: coreError } = await supabase
        .from('Core_Archetype_Overview')
        .select('*')
        .eq('id', archetypeId)
        .maybeSingle();
        
      if (coreError) {
        console.error("Error fetching core archetype data:", coreError);
        
        // Try one more fallback with case-insensitive search
        const { data: insensitiveData, error: insensitiveError } = await supabase
          .from('Core_Archetype_Overview')
          .select('*')
          .ilike('id', archetypeId)
          .maybeSingle();
          
        if (insensitiveError || !insensitiveData) {
          console.error("Error with case-insensitive archetype search:", insensitiveError);
          throw coreError;
        }
        
        console.log(`Found archetype data with case-insensitive search for ${archetypeId}`);
        cacheArchetype(archetypeId, insensitiveData);
        return insensitiveData;
      }
      
      if (coreData) {
        console.log(`Found basic archetype data for ${archetypeId}`);
        cacheArchetype(archetypeId, coreData);
        return coreData;
      }
      
      throw fetchError;
    }
    
    if (data) {
      // Store in cache
      cacheArchetype(archetypeId, data);
    } else {
      console.log(`No data found in database for archetype ${archetypeId}`);
    }

    return data;
  } catch (error) {
    console.error("Error in fetchArchetypeData:", error);
    throw error;
  }
};
