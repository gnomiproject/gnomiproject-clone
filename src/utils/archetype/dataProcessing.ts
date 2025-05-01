import { ArchetypeDetailedData, ArchetypeId, FamilyId } from '@/types/archetype';
import { mapDatabaseResponseToInterface } from '@/utils/dataTransforms/namingConventions';

// Helper function to normalize property names across different data sources
export const normalizePropertyNames = (data: any): any => {
  if (!data) return null;
  
  // Use the generic mapper function for consistent property normalization
  const normalized = mapDatabaseResponseToInterface(data);
  
  // Handle key_characteristics to ensure it's usable as an array
  if (normalized.key_characteristics) {
    // If it's a string, split it by newlines
    if (typeof normalized.key_characteristics === 'string') {
      normalized.key_characteristics = (normalized.key_characteristics as string)
        .split('\n')
        .filter(Boolean);
    } 
    // If it's neither an array nor a string, make it an empty array
    else if (!Array.isArray(normalized.key_characteristics)) {
      normalized.key_characteristics = [];
    }
  }
  
  // Also ensure keyCharacteristics is set if key_characteristics exists
  if (normalized.key_characteristics && !normalized.keyCharacteristics) {
    normalized.keyCharacteristics = normalized.key_characteristics;
  }
  
  return normalized;
};

/**
 * Process data from the database into the expected archetype format
 */
export const processArchetypeData = (
  data: any, 
  getFamilyById: any, 
  getArchetypeEnhanced: (id: ArchetypeId) => ArchetypeDetailedData | null
) => {
  // Early return for no data
  if (!data) {
    console.warn("No data provided to processArchetypeData");
    return { 
      archetypeData: null,
      familyData: null,
      dataSource: 'No data'
    };
  }

  const archetypeId = data.archetype_id || data.id;
  
  // Handle case when we have level3/level4 report data from the database
  if (data.archetype_name || data.strategic_recommendations) {
    console.log(`Processing database data for archetype ${archetypeId}`);
    
    // Extract family information
    const familyId = (data.family_id || 'unknown') as FamilyId;
    const family = getFamilyById(familyId);
    
    // Normalize the property names to ensure both snake_case and camelCase are available
    const normalizedData = normalizePropertyNames(data);
    
    // Handle key_characteristics specifically to ensure it's an array
    const keyCharacteristics = (() => {
      if (Array.isArray(normalizedData.key_characteristics)) {
        return normalizedData.key_characteristics;
      } else if (typeof normalizedData.key_characteristics === 'string') {
        return (normalizedData.key_characteristics as string).split('\n').filter(Boolean);
      } else {
        return [];
      }
    })();
    
    return {
      archetypeData: {
        ...normalizedData,
        id: archetypeId,
        name: data.archetype_name || data.name,
        familyId: familyId,
        familyName: data.family_name || (family?.name || ''),
        hexColor: data.hex_color || data.hexColor || '#6E59A5',
        key_characteristics: keyCharacteristics
      },
      familyData: family,
      dataSource: 'Database'
    };
  }
  
  // Otherwise return null result
  return { 
    archetypeData: null,
    familyData: null,
    dataSource: 'No valid data'
  };
};

/**
 * Fallback to use local archetype data when database fetch fails
 */
export const processFallbackData = (
  archetypeId: ArchetypeId,
  getArchetypeEnhanced: (id: ArchetypeId) => ArchetypeDetailedData | null,
  getFamilyById: any
) => {
  console.log(`Using fallback local data for archetype ${archetypeId}`);
  
  // Get data from local data source
  const archetypeData = getArchetypeEnhanced(archetypeId);
  
  if (!archetypeData) {
    console.warn(`No fallback data available for archetype ${archetypeId}`);
    return {
      archetypeData: null,
      familyData: null,
      dataSource: 'No data'
    };
  }
  
  // Get family data
  const familyId = archetypeData.familyId || archetypeData.family_id as FamilyId;
  const familyData = getFamilyById(familyId);
  
  // Normalize the property names
  const normalizedData = normalizePropertyNames(archetypeData);
  
  return {
    archetypeData: normalizedData,
    familyData,
    dataSource: 'Local data'
  };
};
