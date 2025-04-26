import React, { useState } from 'react';
import DNAHelix from './DNAHelix';
import SectionTitle from '@/components/shared/SectionTitle';
import { ArchetypeId } from '@/types/archetype';
import { useIsMobile } from '@/hooks/use-mobile';
import { ArrowDown } from 'lucide-react';
import { useArchetypeBasics } from '@/hooks/archetype/useArchetypeBasics';

// Import the component files
import ArchetypeDetailView from './ArchetypeDetailView';
import FamilyDetailView from './FamilyDetailView';
import ArchetypeDetailDialog from './ArchetypeDetailDialog';
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

  // Get the selected archetype's full data
  const selectedArchetypeDetail = selectedArchetype ? 
    archetypes?.find(a => a.id === selectedArchetype) : 
    null;

  // Get the selected family information
  const selectedFamilyInfo = selectedFamily ?
    getFamilyById(selectedFamily as any) :
    null;
    
  // Create a properly formatted archetype summary object that matches expected props
  const selectedArchetypeSummary = selectedArchetype && selectedArchetypeDetail ? {
    id: selectedArchetype,
    familyId: selectedArchetype.charAt(0) as 'a' | 'b' | 'c',
    name: selectedArchetypeDetail.name,
    familyName: selectedFamilyInfo?.name || 'Unknown Family',
    description: selectedArchetypeDetail.short_description || '',
    keyCharacteristics: selectedArchetypeDetail.key_characteristics || []
  } : null;
  
  // Convert archetype summaries to the expected format for FamilyDetailView
  const formattedArchetypeSummaries = archetypes?.map(archetype => ({
    id: archetype.id,
    familyId: archetype.family_id,
    name: archetype.name,
    familyName: getFamilyById(archetype.family_id)?.name || '',
    description: archetype.short_description || '',
    keyCharacteristics: archetype.key_characteristics || [],
    color: archetype.hex_color,
  })) || [];

  // Scroll to archetypes section
  const scrollToArchetypes = (e: React.MouseEvent) => {
    e.preventDefault();
    const archetypeSection = document.getElementById('archetype-section');
    archetypeSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Mobile alternative content
  if (isMobile) {
    return (
      <section className="py-12 px-6 bg-white scroll-mt-16" id="dna-explorer">
        <div className="max-w-6xl mx-auto">
          <SectionTitle 
            title="Explore the DNA of Employer Healthcare" 
            subtitle="We've identified 9 distinct employer archetypes, grouped into 3 families based on how organizations manage healthcare."
            center
            className="mb-6"
          />
          
          <div className="bg-blue-50/50 rounded-lg border border-blue-100 p-6 shadow-sm text-center">
            <h3 className="text-xl font-bold text-blue-700 mb-3">For Best Experience</h3>
            <p className="text-gray-600 mb-4">
              Our interactive DNA explorer works best on desktop devices. 
              Please scroll down to browse all archetypes in card format.
            </p>
            <button 
              onClick={scrollToArchetypes}
              className="inline-flex items-center text-blue-600 font-medium"
            >
              View All Archetypes <ArrowDown className="ml-1 h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Format family info to match expected props in FamilyDetailView
  const formatFamilyInfo = (family) => {
    if (!family) return null;
    return {
      id: family.id,
      name: family.name,
      description: family.short_description || '',
      commonTraits: family.common_traits || []
    };
  };

  // Format archetype detail to match expected props in ArchetypeDetailDialog
  const formatArchetypeDetail = (archetype) => {
    if (!archetype) return null;
    return {
      id: archetype.id,
      familyId: archetype.family_id,
      name: archetype.name,
      familyName: selectedFamilyInfo?.name || 'Unknown Family',
      hexColor: archetype.hex_color,
      keyFindings: archetype.key_characteristics || [],
      fullDescription: archetype.long_description || ''
    };
  };

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
                onShowDetailDialog={() => setShowDetailDialog(true)} 
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

      {/* Level 2 Detail Dialog */}
      {/* {selectedArchetypeDetail && (
        <ArchetypeDetailDialog 
          open={showDetailDialog}
          onOpenChange={setShowDetailDialog}
          archetypeDetail={formatArchetypeDetail(selectedArchetypeDetail)}
        />
      )} */}
    </section>
  );
};

export default InteractiveDNAExplorer;
