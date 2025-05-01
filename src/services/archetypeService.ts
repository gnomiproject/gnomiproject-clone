
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
    // CRITICAL FIX: Query exclusively from level3_report_secure table
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
      // Log the available fields in the response to confirm table structure
      console.log("[archetypeService] Available fields in level3_report_secure:", Object.keys(data));
      
      // Enhanced logging specifically for SWOT data availability
      console.log("[archetypeService] Raw SWOT data exists check:", {
        hasStrengthsField: 'strengths' in data,
        hasWeaknessesField: 'weaknesses' in data,
        hasOpportunitiesField: 'opportunities' in data,
        hasThreatsField: 'threats' in data
      });
      
      // Log the SWOT data types and content for debugging
      console.log("[archetypeService] SWOT data types:", {
        strengthsType: typeof data.strengths,
        strengthsIsNull: data.strengths === null,
        strengthsContent: data.strengths,
        weaknessesType: typeof data.weaknesses, 
        weaknessesContent: data.weaknesses,
        opportunitiesType: typeof data.opportunities,
        opportunitiesContent: data.opportunities,
        threatsType: typeof data.threats,
        threatsContent: data.threats
      });
      
      // Check if there's a separate swot_analysis object in the data
      // Use optional chaining and type checking to avoid TypeScript errors
      const swotAnalysisField = (data as any).swot_analysis;
      if (swotAnalysisField) {
        console.log("[archetypeService] Found swot_analysis field:", {
          type: typeof swotAnalysisField,
          content: swotAnalysisField
        });
      }
      
      // Normalize data to ensure both snake_case and camelCase properties are available
      const normalizedData = mapDatabaseResponseToInterface(data);
      
      // Store in cache
      cacheArchetype(archetypeId, normalizedData);
      return normalizedData;
    } else {
      console.log(`[archetypeService] No data found in level3_report_secure for archetype ${archetypeId}`);
      return null;
    }
  } catch (error) {
    console.error("[archetypeService] Error in fetchArchetypeData:", error);
    throw error;
  }
};
