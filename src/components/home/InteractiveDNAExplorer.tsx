
import React, { useState } from 'react';
import { useArchetypes } from '@/hooks/useArchetypes';
import DNAHelix from './DNAHelix';
import SectionTitle from '@/components/shared/SectionTitle';
import { ArchetypeId } from '@/types/archetype';

// Import the new component files
import ArchetypeDetailView from './ArchetypeDetailView';
import FamilyDetailView from './FamilyDetailView';
import ArchetypeDetailDialog from './ArchetypeDetailDialog';
import EmptyExplorerState from './EmptyExplorerState';

const InteractiveDNAExplorer = () => {
  const { getAllArchetypeSummaries, getAllFamilies, getArchetypeSummary, getArchetypeStandard } = useArchetypes();
  const archetypeSummaries = getAllArchetypeSummaries;
  const families = getAllFamilies;

  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const [selectedArchetype, setSelectedArchetype] = useState<ArchetypeId | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState<boolean>(false);

  // Handle step click on the DNA helix
  const handleStepClick = (archetypeId: ArchetypeId) => {
    setSelectedArchetype(archetypeId === selectedArchetype ? null : archetypeId);
    
    // Also select the corresponding family
    const familyId = archetypeId.charAt(0) as 'a' | 'b' | 'c';
    setSelectedFamily(familyId);
  };

  // Handle family button click
  const handleFamilyClick = (familyId: 'a' | 'b' | 'c') => {
    // Toggle selection if clicking the same family again
    setSelectedFamily(familyId === selectedFamily ? null : familyId);
    
    // Clear selected archetype if we're changing families
    if (selectedArchetype && selectedArchetype.charAt(0) !== familyId) {
      setSelectedArchetype(null);
    }
  };

  // Get the selected archetype's summary information (level 1)
  const selectedArchetypeSummary = selectedArchetype ? 
    getArchetypeSummary(selectedArchetype) : 
    null;
  
  // Get the selected archetype's detailed information (level 2)
  const selectedArchetypeDetail = selectedArchetype ? 
    getArchetypeStandard(selectedArchetype) : 
    null;

  // Get the selected family information
  const selectedFamilyInfo = selectedFamily ?
    families.find(family => family.id === selectedFamily) :
    null;

  return (
    <section className="py-16 px-6 md:px-12 bg-white">
      <div className="max-w-6xl mx-auto">
        <SectionTitle 
          title="Explore the DNA of Employer Healthcare" 
          subtitle="Our proprietary research has identified distinct patterns in how organizations manage healthcare. Click on the steps in the DNA structure to learn about each archetype."
          center
          className="mb-10"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Left side: DNA Helix Visualization - Fixed height container */}
          <div className="md:col-span-1 order-2 md:order-1 sticky top-24">
            <DNAHelix 
              className="h-[500px] mx-auto" 
              onStepClick={handleStepClick}
              selectedArchetypeId={selectedArchetype}
              onFamilyClick={handleFamilyClick}
              selectedFamilyId={selectedFamily as 'a' | 'b' | 'c' | null}
            />
          </div>

          {/* Right side: Content display area */}
          <div className="md:col-span-2 order-1 md:order-2 space-y-6">
            {/* Display selected content or default message */}
            {!selectedArchetype && !selectedFamily ? (
              <EmptyExplorerState />
            ) : selectedArchetypeSummary ? (
              <ArchetypeDetailView 
                archetypeSummary={selectedArchetypeSummary} 
                onShowDetailDialog={() => setShowDetailDialog(true)} 
              />
            ) : selectedFamilyInfo ? (
              <FamilyDetailView 
                familyInfo={selectedFamilyInfo} 
                archetypes={archetypeSummaries} 
                onSelectArchetype={(id) => setSelectedArchetype(id as ArchetypeId)} 
              />
            ) : null}
          </div>
        </div>
      </div>

      {/* Level 2 Detail Dialog */}
      <ArchetypeDetailDialog 
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
        archetypeDetail={selectedArchetypeDetail}
      />
    </section>
  );
};

export default InteractiveDNAExplorer;
