
import { supabase } from '@/integrations/supabase/client';
import { ArchetypeId } from '@/types/archetype';
import { getCachedArchetype, cacheArchetype } from '@/utils/archetype/cacheUtils';
import { mapDatabaseResponseToInterface } from '@/utils/dataTransforms/namingConventions';

/**
 * Fetch archetype data from Supabase - exclusively from level3_report_secure table
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
    // SINGLE SOURCE OF TRUTH: Query exclusively from level3_report_secure table
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
    
    if (!data) {
      console.log(`[archetypeService] No data found in level3_report_secure for archetype ${archetypeId}`);
      return null;
    }
    
    // Enhanced logging for archetype name - only use properties that exist on the data object
    console.log("[archetypeService] Archetype data fetched:", { 
      id: data.archetype_id,
      archetype_name: data.archetype_name,
      familyName: data.family_name,
      hasArchetypeName: !!data.archetype_name
    });
    
    // CRITICAL DEBUG: Log distinctive_metrics specifically
    console.log("[archetypeService] === DISTINCTIVE METRICS DEBUG ===");
    console.log("[archetypeService] distinctive_metrics exists:", !!data.distinctive_metrics);
    console.log("[archetypeService] distinctive_metrics type:", typeof data.distinctive_metrics);
    console.log("[archetypeService] distinctive_metrics value:", data.distinctive_metrics);
    console.log("[archetypeService] distinctive_metrics length:", Array.isArray(data.distinctive_metrics) ? data.distinctive_metrics.length : 'not array');
    console.log("[archetypeService] ======================================");
    
    // Enhanced logging specifically for SWOT data availability
    console.log("[archetypeService] SWOT data exists check:", {
      hasStrengthsField: 'strengths' in data,
      hasWeaknessesField: 'weaknesses' in data,
      hasOpportunitiesField: 'opportunities' in data,
      hasThreatsField: 'threats' in data,
      strengthsType: typeof data.strengths
    });
    
    // Normalize data to ensure both snake_case and camelCase properties are available
    const normalizedData = mapDatabaseResponseToInterface(data);
    
    // Ensure the name property is always set correctly - using properties that exist in the data
    normalizedData.name = normalizedData.archetype_name || archetypeId.toUpperCase();
    
    // PRESERVE DISTINCTIVE METRICS: Make sure it's not lost during normalization
    if (data.distinctive_metrics) {
      normalizedData.distinctive_metrics = data.distinctive_metrics;
      console.log("[archetypeService] Preserved distinctive_metrics in normalized data:", normalizedData.distinctive_metrics);
    }
    
    // Store in cache
    cacheArchetype(archetypeId, normalizedData);
    return normalizedData;
  } catch (error) {
    console.error("[archetypeService] Error in fetchArchetypeData:", error);
    throw error;
  }
};
