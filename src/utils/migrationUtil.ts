
import { Archetype } from '@/types/archetype';

// Update migration utility functions to match our corrected type definitions
export function convertToArchetype(rawData: any): Archetype {
  if (!rawData) {
    throw new Error('Cannot convert null or undefined to Archetype');
  }

  // Create archetype with required fields
  const archetype: Archetype = {
    id: rawData.id,
    familyId: rawData.family_id || rawData.familyId,
    name: rawData.name,
  };

  // Add optional fields if they exist
  if (rawData.description) {
    archetype.description = rawData.description;
  } else if (rawData.short_description) {
    archetype.description = rawData.short_description;
  }

  if (rawData.characteristics) {
    archetype.characteristics = rawData.characteristics;
  } else if (rawData.key_characteristics) {
    archetype.characteristics = Array.isArray(rawData.key_characteristics) 
      ? rawData.key_characteristics 
      : typeof rawData.key_characteristics === 'string' 
        ? rawData.key_characteristics.split('\n').filter((item: string) => item.trim() !== '') 
        : [];
  }

  if (rawData.color) {
    archetype.color = rawData.color;
  }

  if (rawData.hex_color) {
    archetype.hexColor = rawData.hex_color;
  }

  return archetype;
}

export function normalizeArchetype(archetype: Archetype): Record<string, any> {
  return {
    id: archetype.id,
    family_id: archetype.familyId,
    name: archetype.name,
    short_description: archetype.description,
    long_description: archetype.description,
    hex_color: archetype.hexColor,
    key_characteristics: archetype.characteristics || [],
    // Add more fields as needed
  };
}
