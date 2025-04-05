
import { useMemo } from 'react';
import { archetypes } from '../data/archetypes';
import { archetypeFamilies } from '../data/archetypeFamilies';
import { archetypeMetrics } from '../data/archetypeMetrics';
import { distinctiveTraits } from '../data/distinctiveTraits';
import { Archetype, ArchetypeId, ArchetypeFamily } from '../types/archetype';

/**
 * Hook to access and filter archetype data
 */
export const useArchetypes = () => {
  /**
   * Get all archetypes
   */
  const getAllArchetypes = useMemo(() => {
    return archetypes;
  }, []);

  /**
   * Get an archetype by ID
   * @param id The archetype ID to find
   */
  const getArchetypeById = (id: ArchetypeId) => {
    return archetypes.find(archetype => archetype.id === id);
  };

  /**
   * Get all archetypes in a specific family
   * @param familyId The family ID to filter by
   */
  const getArchetypesByFamily = (familyId: 'a' | 'b' | 'c') => {
    return archetypes.filter(archetype => archetype.familyId === familyId);
  };

  /**
   * Get all archetype families
   */
  const getAllFamilies = useMemo(() => {
    return archetypeFamilies;
  }, []);

  /**
   * Get a family by ID
   * @param id The family ID to find
   */
  const getFamilyById = (id: 'a' | 'b' | 'c'): ArchetypeFamily | undefined => {
    return archetypeFamilies.find(family => family.id === id);
  };

  /**
   * Get metrics for an archetype
   * @param archetypeId The archetype to get metrics for
   */
  const getMetricsForArchetype = (archetypeId: ArchetypeId) => {
    return archetypeMetrics.find(metrics => metrics.archetypeId === archetypeId);
  };

  /**
   * Get distinctive traits for an archetype
   * @param archetypeId The archetype to get traits for
   */
  const getTraitsForArchetype = (archetypeId: ArchetypeId) => {
    return distinctiveTraits.find(traits => traits.archetypeId === archetypeId);
  };

  return {
    getAllArchetypes,
    getArchetypeById,
    getArchetypesByFamily,
    getAllFamilies,
    getFamilyById,
    getMetricsForArchetype,
    getTraitsForArchetype
  };
};

