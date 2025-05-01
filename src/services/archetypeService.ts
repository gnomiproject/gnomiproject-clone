
import { supabase } from '@/integrations/supabase/client';
import { ArchetypeId } from '@/types/archetype';
import { getCachedArchetype, cacheArchetype } from '@/utils/archetype/cacheUtils';
import * as archetypesDetailedData from '@/data/archetypesDetailed';

/**
 * Fetch archetype data from Supabase with improved fallback handling
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
          
          // Last resort - check our static data
          const staticData = getStaticArchetypeData(archetypeId);
          if (staticData) {
            console.log(`Using static data for ${archetypeId}`);
            cacheArchetype(archetypeId, staticData);
            return staticData;
          }
          
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
      
      // If we still don't have data, try static data as last resort
      const staticData = getStaticArchetypeData(archetypeId);
      if (staticData) {
        console.log(`Using static data for ${archetypeId}`);
        cacheArchetype(archetypeId, staticData);
        return staticData;
      }
      
      throw fetchError;
    }
    
    if (data) {
      // Store in cache
      cacheArchetype(archetypeId, data);
    } else {
      console.log(`No data found in database for archetype ${archetypeId}`);
      
      // If no data returned, try static data
      const staticData = getStaticArchetypeData(archetypeId);
      if (staticData) {
        console.log(`Using static data for ${archetypeId}`);
        cacheArchetype(archetypeId, staticData);
        return staticData;
      }
    }

    return data;
  } catch (error) {
    console.error("Error in fetchArchetypeData:", error);
    
    // Final fallback to static data in case of complete failure
    const staticData = getStaticArchetypeData(archetypeId);
    if (staticData) {
      console.log(`Using static data after error for ${archetypeId}`);
      return staticData;
    }
    
    throw error;
  }
};

/**
 * Get static archetype data from local dataset
 */
const getStaticArchetypeData = (archetypeId: ArchetypeId) => {
  try {
    // Try to find matching archetype by ID in our static data
    const archetypeData = archetypesDetailedData.archetypesDetailed.find?.(
      archetype => archetype.id === archetypeId
    );
    
    if (archetypeData) {
      return archetypeData;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting static archetype data:", error);
    return null;
  }
};
