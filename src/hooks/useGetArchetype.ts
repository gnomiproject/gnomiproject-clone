
import { useArchetypes } from './useArchetypes';
import { ArchetypeId } from '@/types/archetype';

/**
 * Simple hook to get a single archetype with full details by ID
 */
export const useGetArchetype = (archetypeId: ArchetypeId) => {
  const { getArchetypeEnhanced, getFamilyById, isLoading } = useArchetypes();
  
  const archetypeData = getArchetypeEnhanced(archetypeId);
  const familyData = archetypeData ? getFamilyById(archetypeData.familyId) : undefined;

  return {
    archetypeData,
    familyData,
    isLoading
  };
};
