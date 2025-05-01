
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
 * Simplified to focus only on level3_report_secure data
 */
export const processArchetypeData = (
  data: any, 
  getFamilyById: any
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
  
  // Process data from level3_report_secure
  console.log(`Processing database data for archetype ${archetypeId}`);
  
  // Extract family information
  const familyId = (data.family_id || 'unknown') as FamilyId;
  const family = getFamilyById(familyId);
  
  // Normalize the property names to ensure both snake_case and camelCase are available
  const normalizedData = normalizePropertyNames(data);
  
  return {
    archetypeData: {
      ...normalizedData,
      id: archetypeId,
      name: data.archetype_name || data.name,
      familyId: familyId,
      familyName: data.family_name || (family?.name || ''),
      hexColor: data.hex_color || data.hexColor || '#6E59A5'
    },
    familyData: family,
    dataSource: 'Database'
  };
};
