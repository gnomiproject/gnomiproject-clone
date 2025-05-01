
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
    console.log("[archetypeService] Querying level3_report_secure for archetypeId:", archetypeId);
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
        hasThreats: !!data.threats
      });
      
      // Add detailed logging for SWOT data structure
      console.log("[archetypeService] SWOT data structure:", {
        strengths: data.strengths,
        weaknesses: data.weaknesses,
        opportunities: data.opportunities,
        threats: data.threats
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
