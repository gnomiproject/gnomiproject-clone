
import { ArchetypeId } from '@/types/archetype';

/**
 * Validates an archetype ID to ensure it's in the valid set of archetypes
 * @param id The archetype ID to validate
 * @returns Boolean indicating if the ID is valid
 */
export const isValidArchetypeId = (id: string): boolean => {
  const validIds: ArchetypeId[] = ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3'];
  return validIds.includes(id as ArchetypeId);
};

/**
 * Gets the display name for an archetype family
 * @param familyId The family ID ('a', 'b', or 'c')
 * @returns The display name for the family
 */
export const getFamilyDisplayName = (familyId: string): string => {
  switch (familyId) {
    case 'a': return 'Strategists';
    case 'b': return 'Pragmatists';
    case 'c': return 'Logisticians';
    default: return 'Unknown Family';
  }
};

/**
 * Gets a human-readable label for an archetype ID
 * @param archetypeId The archetype ID
 * @returns A formatted display label
 */
export const getArchetypeDisplayLabel = (archetypeId: ArchetypeId): string => {
  return archetypeId.toUpperCase();
};
