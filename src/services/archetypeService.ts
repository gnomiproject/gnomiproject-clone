
import { supabase } from '@/integrations/supabase/client';
import { ArchetypeId } from '@/types/archetype';
import { getCachedArchetype, cacheArchetype } from '@/utils/archetype/cacheUtils';
import * as archetypesDetailedData from '@/data/archetypesDetailed';
import { mapDatabaseResponseToInterface } from '@/utils/dataTransforms/namingConventions';

/**
 * Fetch archetype data from Supabase with simplified approach
 * Primary focus on level3_report_secure table
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
    // Use the secure view as our primary and only data source
    const { data, error } = await supabase
      .from('level3_report_secure')
      .select('*')
      .eq('archetype_id', archetypeId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching archetype data:", error);
      throw error;
    }
    
    if (data) {
      // Normalize data to ensure both snake_case and camelCase properties are available
      const normalizedData = mapDatabaseResponseToInterface(data);
      
      // Store in cache
      cacheArchetype(archetypeId, normalizedData);
      return normalizedData;
    } else {
      console.log(`No data found in database for archetype ${archetypeId}`);
      
      // If no data found, return null - we'll handle this at the UI level
      return null;
    }
  } catch (error) {
    console.error("Error in fetchArchetypeData:", error);
    throw error;
  }
};

/**
 * Get static archetype data from local dataset (for development only)
 * In production, we only use the Supabase database
 */
const getStaticArchetypeData = (archetypeId: ArchetypeId) => {
  try {
    // Find matching archetype by ID in our static data
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
