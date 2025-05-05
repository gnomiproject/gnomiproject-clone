import { ArchetypeId } from '@/types/archetype';

/**
 * Normalizes an archetype ID by converting it to lowercase.
 * @param archetypeId The archetype ID to normalize.
 * @returns The normalized archetype ID.
 */
export const normalizeArchetypeId = (archetypeId: string): string => {
  return archetypeId.toLowerCase();
};

/**
 * Checks if a given string is a valid archetype ID.
 * @param archetypeId The string to check.
 * @returns True if the string is a valid archetype ID, false otherwise.
 */
export const isValidArchetypeId = (archetypeId: string): boolean => {
  if (typeof archetypeId !== 'string') {
    return false;
  }
  const normalizedId = normalizeArchetypeId(archetypeId);
  return /^[abc][1-3]$/.test(normalizedId);
};

/**
 * Converts a string to a valid ArchetypeId type or returns null
 * This is useful when working with data from external sources that might
 * not conform to our type requirements
 */
export const validateArchetypeId = (id: string): ArchetypeId | null => {
  // Normalize the ID first
  const normalizedId = normalizeArchetypeId(id);
  
  // Check if it's a valid archetype ID format
  if (isValidArchetypeId(normalizedId)) {
    return normalizedId as ArchetypeId;
  }
  
  // Special case for average data
  if (id === 'All_Average') {
    return 'a1'; // Return a default archetype for average data
  }
  
  return null;
};
