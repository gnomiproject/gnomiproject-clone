
import { useArchetypeBasics } from './archetype/useArchetypeBasics';
import { useArchetypeDetails } from './archetype/useArchetypeDetails';
import { useArchetypeFamilies } from './archetype/useArchetypeFamilies';
import { useArchetypeMetrics } from './archetype/useArchetypeMetrics';
import { useDistinctiveMetrics } from './archetype/useDistinctiveMetrics';
import { ArchetypeDetailedData, ArchetypeId } from '@/types/archetype';
import { useState, useEffect } from 'react';

/**
 * Main hook that combines all archetype-related hooks
 * This maintains the original API for backward compatibility
 */
export const useArchetypes = () => {
  const { 
    archetypes,
    allArchetypes,
    getArchetypeById, 
    getArchetypesByFamily, 
    isLoading: isLoadingBasics 
  } = useArchetypeBasics();
  
  const { 
    families: familiesData,
    allFamilies,
    getFamilyById, 
    isLoading: isLoadingFamilies 
  } = useArchetypeFamilies();
  
  const [allDetailedArchetypes, setAllDetailedArchetypes] = useState<ArchetypeDetailedData[]>([]);
  const [allArchetypeSummaries, setAllArchetypeSummaries] = useState<any[]>([]);
  
  // We use the null archetypeId here but use the hook's getAllDetailedArchetypes function
  const {
    getAllDetailedArchetypes,
    isLoading: isLoadingDetails
  } = useArchetypeDetails();
  
  const {
    getMetricsForArchetype,
    getDistinctiveMetricsForArchetype,
    getCategorizedMetricsForArchetype,
    getTraitsForArchetype,
    isLoading: isLoadingMetrics
  } = useArchetypeMetrics();
  
  // Load all detailed archetypes for compatibility
  useEffect(() => {
    const loadDetailedArchetypes = async () => {
      try {
        const detailedData = await getAllDetailedArchetypes();
        setAllDetailedArchetypes(detailedData);
        
        // Create summaries from the detailed data
        const summaries = detailedData.map(archetype => ({
          id: archetype.id,
          name: archetype.name,
          familyId: archetype.familyId || archetype.family_id,
          familyName: getFamilyById(archetype.familyId as any || archetype.family_id as any)?.name || '',
          description: archetype.short_description || '',
          keyCharacteristics: archetype.key_characteristics || []
        }));
        
        setAllArchetypeSummaries(summaries);
      } catch (error) {
        console.error('Error loading detailed archetypes:', error);
      }
    };
    
    if (!isLoadingBasics && !isLoadingFamilies) {
      loadDetailedArchetypes();
    }
  }, [isLoadingBasics, isLoadingFamilies]);
  
  // Helper function to get archetype summary by ID
  const getArchetypeSummary = (id: ArchetypeId) => {
    return allArchetypeSummaries.find(summary => summary.id === id) || null;
  };
  
  // Helper function to get archetype standard by ID
  const getArchetypeStandard = (id: ArchetypeId) => {
    const detailed = allDetailedArchetypes.find(archetype => archetype.id === id);
    return detailed?.standard || null;
  };
  
  // Helper function to get detailed archetypes by family
  const getDetailedArchetypesByFamily = (familyId: string) => {
    return allDetailedArchetypes.filter(archetype => 
      (archetype.familyId || archetype.family_id) === familyId
    );
  };
  
  // Helper function to get archetype detailed by ID
  const getArchetypeDetailedById = (id: ArchetypeId) => {
    return allDetailedArchetypes.find(archetype => archetype.id === id) || null;
  };
  
  // Helper function to get archetype summaries by family
  const getArchetypeSummariesByFamily = (familyId: string) => {
    return allArchetypeSummaries.filter(summary => summary.familyId === familyId);
  };
  
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
    
    // From processed detailed archetype data
    getAllDetailedArchetypes: () => allDetailedArchetypes,
    allDetailedArchetypes, // Expose directly for components to access
    getDetailedArchetypesByFamily,
    getArchetypeSummary,
    getArchetypeStandard,
    getArchetypeDetailedById, // Make sure this function is properly exposed
    getArchetypeEnhanced: getArchetypeDetailedById, // Keep for backward compatibility
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
