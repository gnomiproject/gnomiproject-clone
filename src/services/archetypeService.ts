
import { supabase } from '@/integrations/supabase/client';
import { ArchetypeId } from '@/types/archetype';
import { getCachedArchetype, cacheArchetype } from '@/utils/archetype/cacheUtils';
import { mapDatabaseResponseToInterface } from '@/utils/dataTransforms/namingConventions';

/**
 * Fetch archetype data from Supabase with simplified approach
 * Primary focus on level3_report_secure table only
 */
export const fetchArchetypeData = async (archetypeId: ArchetypeId, skipCache: boolean = false) => {
  // Verify a valid archetype ID was provided
  if (!archetypeId) {
    throw new Error('Invalid archetype ID provided');
  }
  
  console.log("[archetypeService] Fetching data for archetypeId:", archetypeId);
  
  // Check cache first if not explicitly skipping
  const cachedData = getCachedArchetype(archetypeId, skipCache);
  if (cachedData) {
    console.log("[archetypeService] Returning cached data for archetypeId:", archetypeId);
    return cachedData;
  }
  
  try {
    // Only use the secure view as our data source - no fallbacks
    const { data, error } = await supabase
      .from('level3_report_secure')
      .select('*')
      .eq('archetype_id', archetypeId)
      .maybeSingle();

    if (error) {
      console.error("[archetypeService] Error fetching archetype data:", error);
      throw error;
    }
    
    if (data) {
      console.log("[archetypeService] Raw data from level3_report_secure:", {
        archetypeId: data.archetype_id,
        name: data.archetype_name,
        hasStrengths: !!data.strengths,
        strengthsType: data.strengths ? typeof data.strengths : 'undefined',
        hasWeaknesses: !!data.weaknesses,
        hasOpportunities: !!data.opportunities,
        hasThreats: !!data.threats,
        swotDataSample: {
          strengths: data.strengths ? JSON.stringify(data.strengths).substring(0, 100) + '...' : 'null',
          weaknesses: data.weaknesses ? JSON.stringify(data.weaknesses).substring(0, 100) + '...' : 'null',
          opportunities: data.opportunities ? JSON.stringify(data.opportunities).substring(0, 100) + '...' : 'null',
          threats: data.threats ? JSON.stringify(data.threats).substring(0, 100) + '...' : 'null',
        }
      });
      
      // Normalize data to ensure both snake_case and camelCase properties are available
      const normalizedData = mapDatabaseResponseToInterface(data);
      
      // Store in cache
      cacheArchetype(archetypeId, normalizedData);
      return normalizedData;
    } else {
      console.log(`[archetypeService] No data found in database for archetype ${archetypeId}`);
      // If no data found, return null - we'll handle this at the UI level
      return null;
    }
  } catch (error) {
    console.error("[archetypeService] Error in fetchArchetypeData:", error);
    throw error;
  }
};
