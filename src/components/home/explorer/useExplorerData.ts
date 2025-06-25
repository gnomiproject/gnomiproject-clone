
import { useState, useEffect } from 'react';
import { healthcareArchetypes } from '@/data/healthcareArchetypes';
import { useArchetypeData } from '@/contexts/ArchetypeDataContext';
import { FAMILY_COLORS } from '@/data/colors';

export const useExplorerData = () => {
  const [renderCount, setRenderCount] = useState(0);
  
  // Access archetype data from shared context
  const { 
    archetypes,
    getFamilyById
  } = useArchetypeData();

  // Track mount/render count for debugging purposes
  useEffect(() => {
    const sequence = renderCount + 1;
    setRenderCount(sequence);
    console.info(`InteractiveDNAExplorer: Mount/Render #${sequence} - Using shared context`);
    
    return () => {
      console.info("InteractiveDNAExplorer: Unmounting");
    };
  }, []);

  // Format archetypes data for display - use data from context when available
  const formattedArchetypes = {
    familyA: (archetypes.length > 0 ? archetypes.filter(a => a.family_id === 'a') : healthcareArchetypes.filter(a => a.familyId === 'A')).map(a => ({
      id: a.id,
      name: a.name,
      description: a.short_description || (a as any).shortDescription || '',
      color: a.hex_color || (a as any).hexColor
    })),
    familyB: (archetypes.length > 0 ? archetypes.filter(a => a.family_id === 'b') : healthcareArchetypes.filter(a => a.familyId === 'B')).map(a => ({
      id: a.id,
      name: a.name,
      description: a.short_description || (a as any).shortDescription || '',
      color: a.hex_color || (a as any).hexColor
    })),
    familyC: (archetypes.length > 0 ? archetypes.filter(a => a.family_id === 'c') : healthcareArchetypes.filter(a => a.familyId === 'C')).map(a => ({
      id: a.id,
      name: a.name,
      description: a.short_description || (a as any).shortDescription || '',
      color: a.hex_color || (a as any).hexColor
    }))
  };

  // Static family descriptions for consistency
  const familyDescriptions = {
    a: "Strategists focus on optimizing healthcare delivery through innovative approaches and proactive management strategies. They excel at anticipating needs and designing solutions.",
    b: "Pragmatists balance practical considerations with healthcare outcomes, focusing on efficiency and cost-effectiveness without sacrificing quality of care.",
    c: "Logisticians apply systematic approaches to healthcare management, prioritizing structure, consistency, and measurable outcomes across their organizations."
  };

  // Create family info for display in the sidebar
  const getFamilyInfo = (familyId: 'a' | 'b' | 'c') => {
    // Get proper family name from colors data
    const familyName = FAMILY_COLORS[familyId].name;
    
    // Get data from shared context
    const family = getFamilyById(familyId as any);
    
    return {
      id: familyId,
      name: familyName || `Family ${familyId.toUpperCase()}`,
      description: familyDescriptions[familyId] || family?.description || `Description for Family ${familyId.toUpperCase()}`,
      commonTraits: family?.commonTraits || []
    };
  };

  // Format the selected archetype summary for display
  const formatArchetypeSummary = (archetypeId: string) => {
    // Try to get from shared context first
    const archetype = archetypes.find(a => a.id === archetypeId);
    
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
      familyId: (archetype.family_id || '').toLowerCase() as 'a' | 'b' | 'c',
      name: archetype.name,
      familyName: getFamilyById(archetype.family_id)?.name || 'Unknown Family',
      description: archetype.short_description || 'No description available',
      keyCharacteristics: archetype.key_characteristics || []
    };
  };

  return {
    formattedArchetypes,
    getFamilyInfo,
    formatArchetypeSummary,
    getAllArchetypeSummaries: () => archetypes,
    getArchetypeSummary: (id: string) => archetypes.find(a => a.id === id),
  };
};
