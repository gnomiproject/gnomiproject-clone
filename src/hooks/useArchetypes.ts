
import { useMemo } from 'react';
import { archetypes } from '../data/archetypes';
import { archetypeFamilies } from '../data/archetypeFamilies';
import { archetypeMetrics } from '../data/archetypeMetrics';
import { distinctiveTraits } from '../data/distinctiveTraits';
import { archetypesDetailed } from '../data/archetypesDetailed';
import { Archetype, ArchetypeId, ArchetypeFamily, ArchetypeDetailedData } from '../types/archetype';

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

  /**
   * Get summary data (Level 1) for an archetype
   * @param archetypeId The archetype to get summary data for
   */
  const getArchetypeSummary = (archetypeId: ArchetypeId) => {
    const archetype = archetypesDetailed.find(a => a.id === archetypeId);
    if (!archetype) return null;
    
    return {
      id: archetype.id,
      familyId: archetype.familyId,
      name: archetype.name,
      familyName: archetype.familyName,
      color: archetype.color,
      ...archetype.summary
    };
  };

  /**
   * Get standard data (Level 2) for an archetype
   * @param archetypeId The archetype to get standard data for
   */
  const getArchetypeStandard = (archetypeId: ArchetypeId) => {
    const archetype = archetypesDetailed.find(a => a.id === archetypeId);
    if (!archetype) return null;
    
    return {
      id: archetype.id,
      familyId: archetype.familyId,
      name: archetype.name,
      familyName: archetype.familyName,
      color: archetype.color,
      ...archetype.summary,
      ...archetype.standard
    };
  };

  /**
   * Get enhanced data (Level 3 - full data) for an archetype
   * @param archetypeId The archetype to get complete data for
   */
  const getArchetypeEnhanced = (archetypeId: ArchetypeId) => {
    return archetypesDetailed.find(a => a.id === archetypeId);
  };

  /**
   * Get summary data for all archetypes
   */
  const getAllArchetypeSummaries = useMemo(() => {
    return archetypesDetailed.map(archetype => ({
      id: archetype.id,
      familyId: archetype.familyId,
      name: archetype.name,
      familyName: archetype.familyName,
      color: archetype.color,
      ...archetype.summary
    }));
  }, []);

  /**
   * Get summary data for archetypes in a specific family
   * @param familyId The family ID to filter by
   */
  const getArchetypeSummariesByFamily = (familyId: 'a' | 'b' | 'c') => {
    return archetypesDetailed
      .filter(archetype => archetype.familyId === familyId)
      .map(archetype => ({
        id: archetype.id,
        familyId: archetype.familyId,
        name: archetype.name,
        familyName: archetype.familyName,
        color: archetype.color,
        ...archetype.summary
      }));
  };

  return {
    getAllArchetypes,
    getArchetypeById,
    getArchetypesByFamily,
    getAllFamilies,
    getFamilyById,
    getMetricsForArchetype,
    getTraitsForArchetype,
    // Old detailed data functions
    getDetailedArchetype: getArchetypeEnhanced,
    getAllDetailedArchetypes: useMemo(() => archetypesDetailed, []),
    getDetailedArchetypesByFamily: (familyId: 'a' | 'b' | 'c') => 
      archetypesDetailed.filter(archetype => archetype.familyId === familyId),
    // New hierarchical data access functions
    getArchetypeSummary,
    getArchetypeStandard,
    getArchetypeEnhanced,
    getAllArchetypeSummaries,
    getArchetypeSummariesByFamily
  };
};
