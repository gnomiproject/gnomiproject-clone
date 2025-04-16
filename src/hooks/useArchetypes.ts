
import { useArchetypeBasics } from './archetype/useArchetypeBasics';
import { useArchetypeDetails } from './archetype/useArchetypeDetails';
import { useArchetypeFamilies } from './archetype/useArchetypeFamilies';
import { useArchetypeMetrics } from './archetype/useArchetypeMetrics';

/**
 * Main hook that combines all archetype-related hooks
 * This maintains the original API for backward compatibility
 */
export const useArchetypes = () => {
  const { 
    allArchetypes, 
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
    getTraitsForArchetype
  } = useArchetypeMetrics();
  
  return {
    // From useArchetypeBasics
    getAllArchetypes: allArchetypes,
    getArchetypeById,
    getArchetypesByFamily,
    
    // From useArchetypeFamilies
    getAllFamilies: allFamilies,
    getFamilyById,
    
    // From useArchetypeDetails
    getAllDetailedArchetypes: allDetailedArchetypes,
    getDetailedArchetypesByFamily,
    getArchetypeSummary,
    getArchetypeStandard,
    getArchetypeEnhanced: getArchetypeDetailedById,
    getAllArchetypeSummaries: allArchetypeSummaries,
    getArchetypeSummariesByFamily,
    
    // From useArchetypeMetrics
    getMetricsForArchetype,
    getTraitsForArchetype,
    
    // Loading state
    isLoading: isLoadingBasics || isLoadingFamilies || isLoadingDetails
  };
};
