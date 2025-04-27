
import React, { useState, useMemo, useCallback } from 'react';
import DNAHelix from './DNAHelix';
import SectionTitle from '@/components/shared/SectionTitle';
import { ArchetypeId } from '@/types/archetype';
import { useIsMobile } from '@/hooks/use-mobile';
import { useArchetypeBasics } from '@/hooks/archetype/useArchetypeBasics';

// Import the component files
import ArchetypeDetailView from './ArchetypeDetailView';
import FamilyDetailView from './FamilyDetailView';
import EmptyExplorerState from './EmptyExplorerState';

const InteractiveDNAExplorer = () => {
  const { 
    archetypes, 
    families, 
    getFamilyById,
    isLoading 
  } = useArchetypeBasics();
  
  const isMobile = useIsMobile();
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const [selectedArchetype, setSelectedArchetype] = useState<ArchetypeId | null>(null);

  // If on mobile, don't render anything
  if (isMobile) {
    return null;
  }

  // Handle step click on the DNA helix - memoized to prevent recreating on every render
  const handleStepClick = useCallback((archetypeId: ArchetypeId) => {
    console.log(`DNA Helix: clicked on archetype ${archetypeId}`);
    setSelectedArchetype(prevArchetype => archetypeId === prevArchetype ? null : archetypeId);
    
    // Also select the corresponding family
    const familyId = archetypeId.charAt(0) as 'a' | 'b' | 'c';
    setSelectedFamily(familyId);
  }, []);

  // Handle family button click - memoized to prevent recreating on every render
  const handleFamilyClick = useCallback((familyId: 'a' | 'b' | 'c') => {
    console.log(`DNA Helix: clicked on family ${familyId}`);
    setSelectedFamily(prevFamily => familyId === prevFamily ? null : familyId);
    
    // If the selected archetype is not in this family, deselect it
    setSelectedArchetype(prevArchetype => {
      if (prevArchetype && prevArchetype.charAt(0) !== familyId) {
        return null;
      }
      return prevArchetype;
    });
  }, []);

  // Get the selected archetype's full data
  const selectedArchetypeDetail = useMemo(() => {
    if (!selectedArchetype || !archetypes) return null;
    return archetypes.find(a => a.id === selectedArchetype);
  }, [selectedArchetype, archetypes]);

  // Get the selected family information
  const selectedFamilyInfo = useMemo(() => {
    if (!selectedFamily) return null;
    return getFamilyById(selectedFamily as any);
  }, [selectedFamily, getFamilyById]);
    
  // Create a properly formatted archetype summary object that matches expected props
  const selectedArchetypeSummary = useMemo(() => {
    if (!selectedArchetype || !selectedArchetypeDetail) return null;
    
    return {
      id: selectedArchetype,
      familyId: selectedArchetype.charAt(0) as 'a' | 'b' | 'c',
      name: selectedArchetypeDetail.name,
      familyName: selectedFamilyInfo?.name || 'Unknown Family',
      description: selectedArchetypeDetail.short_description || '',
      keyCharacteristics: selectedArchetypeDetail.key_characteristics || []
    };
  }, [selectedArchetype, selectedArchetypeDetail, selectedFamilyInfo]);
  
  // Convert archetype summaries to the expected format for FamilyDetailView
  // Memoized to avoid recalculating on every render
  const formattedArchetypeSummaries = useMemo(() => {
    if (!archetypes) return [];
    
    return archetypes.map(archetype => ({
      id: archetype.id,
      familyId: archetype.family_id,
      name: archetype.name,
      familyName: getFamilyById(archetype.family_id)?.name || '',
      description: archetype.short_description || '',
      keyCharacteristics: archetype.key_characteristics || [],
      color: archetype.hex_color,
    }));
  }, [archetypes, getFamilyById]);

  if (isLoading) {
    return (
      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <SectionTitle 
            title="Loading DNA Explorer..."
            subtitle="Please wait while we load the data."
            center
          />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 md:px-12 bg-white scroll-mt-16" id="dna-explorer">
      <div className="max-w-6xl mx-auto">
        <SectionTitle 
          title="Explore the DNA of Employer Healthcare" 
          subtitle="We've identified 9 distinct employer archetypes, grouped into 3 families based on how organizations manage healthcare."
          center
          className="mb-10"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Left side: DNA Helix Visualization - Fixed height container */}
          <div className="md:col-span-1 order-2 md:order-1 sticky top-24">
            <h3 className="text-xl font-bold text-center mb-4 text-gray-800">3 Families, 9 Archetypes</h3>
            <div className="relative bg-gradient-to-b from-transparent to-blue-50/30 rounded-lg p-4 shadow-sm">
              <DNAHelix 
                className="h-[500px] mx-auto" 
                onStepClick={handleStepClick}
                selectedArchetypeId={selectedArchetype}
                onFamilyClick={handleFamilyClick}
                selectedFamilyId={selectedFamily as 'a' | 'b' | 'c' | null}
              />
            </div>
          </div>

          {/* Right side: Content display area */}
          <div className="md:col-span-2 order-1 md:order-2 space-y-6">
            {/* Display selected content or default message */}
            {!selectedArchetype && !selectedFamily ? (
              <EmptyExplorerState />
            ) : selectedArchetypeSummary ? (
              <ArchetypeDetailView 
                archetypeSummary={selectedArchetypeSummary}
              />
            ) : selectedFamilyInfo ? (
              <FamilyDetailView 
                familyInfo={formatFamilyInfo(selectedFamilyInfo)} 
                archetypes={formattedArchetypeSummaries} 
                onSelectArchetype={(id) => setSelectedArchetype(id as ArchetypeId)} 
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

// Helper function to format family info
const formatFamilyInfo = (family: any) => {
  if (!family) return null;
  return {
    id: family.id,
    name: family.name,
    description: family.short_description || '',
    commonTraits: family.common_traits || []
  };
};

export default InteractiveDNAExplorer;
