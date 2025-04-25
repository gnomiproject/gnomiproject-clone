
import { Archetype } from '@/types/archetype';
import { supabase } from '@/integrations/supabase/client';
import { archetypes } from '@/data/archetypes';

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
    short_description: archetype.description || '',
    hex_color: archetype.hexColor || '',
    key_characteristics: archetype.characteristics || [],
  };
}

// Simplify the data migration function to only use Core_Archetype_Overview
export async function migrateDataToSupabase(): Promise<boolean> {
  try {
    // Insert archetypes into the database
    const { error } = await supabase
      .from('Core_Archetype_Overview')
      .upsert(
        archetypes.map(archetype => normalizeArchetype(archetype)),
        { onConflict: 'id' }
      );

    if (error) {
      console.error('Error migrating archetypes data:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Migration error:', error);
    return false;
  }
}

export async function checkDataInSupabase(): Promise<{ exists: boolean; count?: number }> {
  try {
    const { data, error, count } = await supabase
      .from('Core_Archetype_Overview')
      .select('*', { count: 'exact' });

    if (error) {
      throw error;
    }

    return {
      exists: !!data && data.length > 0,
      count: count || 0
    };
  } catch (error) {
    console.error('Error checking data:', error);
    return { exists: false };
  }
}
