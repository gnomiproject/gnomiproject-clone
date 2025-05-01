
import { useState, useEffect } from 'react';
import { healthcareArchetypes } from '@/data/healthcareArchetypes';
import { useArchetypes } from '@/hooks/useArchetypes';

export const useExplorerData = () => {
  const [renderCount, setRenderCount] = useState(0);
  
  // Access archetype data
  const { 
    getAllArchetypeSummaries,
    getArchetypeSummary,
    getFamilyById
  } = useArchetypes();

  // Track mount/render count for debugging purposes
  useEffect(() => {
    const sequence = renderCount + 1;
    setRenderCount(sequence);
    console.info(`InteractiveDNAExplorer: Mount/Render #${sequence}`);
    
    return () => {
      console.info("InteractiveDNAExplorer: Unmounting");
    };
  }, []);

  // Format archetypes data for display
  const formattedArchetypes = {
    familyA: healthcareArchetypes.filter(a => a.familyId === 'A').map(a => ({
      id: a.id,
      name: a.name,
      description: a.shortDescription || '',
      color: a.hexColor
    })),
    familyB: healthcareArchetypes.filter(a => a.familyId === 'B').map(a => ({
      id: a.id,
      name: a.name,
      description: a.shortDescription || '',
      color: a.hexColor
    })),
    familyC: healthcareArchetypes.filter(a => a.familyId === 'C').map(a => ({
      id: a.id,
      name: a.name,
      description: a.shortDescription || '',
      color: a.hexColor
    }))
  };

  // Create family info for display in the sidebar
  const getFamilyInfo = (familyId: 'a' | 'b' | 'c') => {
    const family = getFamilyById(familyId.toUpperCase() as any);
    return {
      id: familyId,
      name: family?.name || `Family ${familyId.toUpperCase()}`,
      description: family?.description || `Description for Family ${familyId.toUpperCase()}`,
      commonTraits: family?.commonTraits || []
    };
  };

  // Format the selected archetype summary for display
  const formatArchetypeSummary = (archetypeId: string) => {
    const archetype = getArchetypeSummary(archetypeId as any);
    
    if (!archetype) {
      // Fallback to static data if dynamic data is not available
      const staticArchetype = healthcareArchetypes.find(a => a.id === archetypeId);
      return {
        id: archetypeId,
        familyId: staticArchetype?.familyId.toLowerCase() as 'a' | 'b' | 'c' || 'a',
        name: staticArchetype?.name || `Archetype ${archetypeId}`,
        familyName: `Family ${staticArchetype?.familyId || 'Unknown'}`,
        description: staticArchetype?.shortDescription || 'No description available',
        keyCharacteristics: ['No characteristics available']
      };
    }
    
    return {
      id: archetype.id,
      familyId: (archetype.familyId || '').toLowerCase() as 'a' | 'b' | 'c',
      name: archetype.name,
      familyName: archetype.familyName || 'Unknown Family',
      description: archetype.description || 'No description available',
      keyCharacteristics: archetype.keyCharacteristics || []
    };
  };

  return {
    formattedArchetypes,
    getFamilyInfo,
    formatArchetypeSummary,
    getAllArchetypeSummaries,
    getArchetypeSummary,
  };
};
