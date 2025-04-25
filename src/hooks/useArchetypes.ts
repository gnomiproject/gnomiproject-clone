
import { useArchetypeBasics } from './archetype/useArchetypeBasics';
import { useArchetypeDetails } from './archetype/useArchetypeDetails';
import { useArchetypeFamilies } from './archetype/useArchetypeFamilies';
import { useArchetypeMetrics } from './archetype/useArchetypeMetrics';
import { useDistinctiveMetrics } from './archetype/useDistinctiveMetrics';

/**
 * Main hook that combines all archetype-related hooks
 * This maintains the original API for backward compatibility
 */
export const useArchetypes = () => {
  const { 
    allArchetypes, 
    archetypes,
    getArchetypeById, 
    getArchetypesByFamily, 
    isLoading: isLoadingBasics 
  } = useArchetypeBasics();
  
  const { 
    allFamilies, 
    getFamilyById, 
    isLoading: isLoadingFamilies 
  } = useArchetypeFamilies();
  
  const {
    allDetailedArchetypes,
    allArchetypeSummaries,
    getArchetypeSummary,
    getArchetypeStandard,
    getDetailedArchetypesByFamily,
    getArchetypeDetailedById,
    getArchetypeSummariesByFamily,
    isLoading: isLoadingDetails
  } = useArchetypeDetails();
  
  const {
    getMetricsForArchetype,
    getDistinctiveMetricsForArchetype,
    getCategorizedMetricsForArchetype,
    getTraitsForArchetype,
    isLoading: isLoadingMetrics
  } = useArchetypeMetrics();
  
  return {
    // From useArchetypeBasics
    getAllArchetypes: () => allArchetypes,
    getArchetypeById,
    getArchetypesByFamily,
    allArchetypes,
    
    // From useArchetypeFamilies
    getAllFamilies: () => allFamilies,
    allFamilies, // Expose directly for components to access
    getFamilyById,
    
    // From useArchetypeDetails
    getAllDetailedArchetypes: () => allDetailedArchetypes,
    allDetailedArchetypes, // Expose directly for components to access
    getDetailedArchetypesByFamily,
    getArchetypeSummary,
    getArchetypeStandard,
    getArchetypeEnhanced: getArchetypeDetailedById,
    getAllArchetypeSummaries: () => allArchetypeSummaries,
    allArchetypeSummaries,
    getArchetypeSummariesByFamily,
    
    // From useArchetypeMetrics
    getMetricsForArchetype,
    getDistinctiveMetricsForArchetype,
    getCategorizedMetricsForArchetype,
    getTraitsForArchetype,
    
    // Loading state
    isLoading: isLoadingBasics || isLoadingFamilies || isLoadingDetails || isLoadingMetrics
  };
};
