
import React, { useState } from 'react';
import { useArchetypes } from '@/hooks/useArchetypes';
import DNAHelix from './DNAHelix';
import SectionTitle from '@/components/shared/SectionTitle';
import { ArchetypeId } from '@/types/archetype';
import { useIsMobile } from '@/hooks/use-mobile';
import { ArrowDown } from 'lucide-react';

// Import the component files
import ArchetypeDetailView from './ArchetypeDetailView';
import FamilyDetailView from './FamilyDetailView';
import ArchetypeDetailDialog from './ArchetypeDetailDialog';
import EmptyExplorerState from './EmptyExplorerState';

const InteractiveDNAExplorer = () => {
  const { 
    allArchetypeSummaries, 
    allFamilies, 
    getArchetypeSummary, 
    getArchetypeStandard 
  } = useArchetypes();
  
  const archetypeSummaries = allArchetypeSummaries || [];
  const families = allFamilies || [];
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

  // Get the selected archetype's summary information (level 1)
  const selectedArchetypeSummaryData = selectedArchetype ? 
    getArchetypeSummary(selectedArchetype) : 
    null;
  
  // Get the selected archetype's detailed information (level 2)
  const selectedArchetypeDetailData = selectedArchetype ? 
    getArchetypeStandard(selectedArchetype) : 
    null;

  // Get the selected family information
  const selectedFamilyInfo = selectedFamily ?
    families.find(family => family.id === selectedFamily) :
    null;
    
  // Create a properly formatted archetype summary object that matches expected props
  const selectedArchetypeSummary = selectedArchetype && selectedArchetypeSummaryData ? {
    id: selectedArchetype,
    familyId: selectedArchetype.charAt(0) as 'a' | 'b' | 'c',
    name: archetypeSummaries.find(a => a.id === selectedArchetype)?.name || 'Unknown Archetype',
    familyName: selectedFamilyInfo?.name || 'Unknown Family',
    description: selectedArchetypeSummaryData.description || '',
    keyCharacteristics: selectedArchetypeSummaryData.keyCharacteristics || []
  } : null;
  
  // Create a properly formatted archetype detail object that matches expected props
  const selectedArchetypeDetail = selectedArchetype && selectedArchetypeDetailData ? {
    id: selectedArchetype,
    familyId: selectedArchetype.charAt(0) as 'a' | 'b' | 'c',
    name: archetypeSummaries.find(a => a.id === selectedArchetype)?.name || 'Unknown Archetype',
    familyName: selectedFamilyInfo?.name || 'Unknown Family',
    fullDescription: selectedArchetypeDetailData.fullDescription || '',
    keyCharacteristics: selectedArchetypeDetailData.keyCharacteristics || [],
    keyInsights: selectedArchetypeDetailData.keyInsights || [],
    keyStatistics: selectedArchetypeDetailData.keyStatistics || {}
  } : null;
  
  // Convert archetype summaries to the expected format for FamilyDetailView
  const formattedArchetypeSummaries = archetypeSummaries.map(summary => ({
    id: summary.id,
    familyId: summary.id.charAt(0) as 'a' | 'b' | 'c',
    name: summary.name,
    familyName: families.find(f => f.id === summary.id.charAt(0))?.name || '',
    description: summary.description,
    keyCharacteristics: Array.isArray(summary.keyCharacteristics) ? summary.keyCharacteristics : [],
    color: summary.color,
    hexColor: summary.hexColor
  }));

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
                familyInfo={selectedFamilyInfo} 
                archetypes={formattedArchetypeSummaries} 
                onSelectArchetype={(id) => setSelectedArchetype(id as ArchetypeId)} 
              />
            ) : null}
          </div>
        </div>
      </div>

      {/* Level 2 Detail Dialog */}
      {selectedArchetypeDetail && (
        <ArchetypeDetailDialog 
          open={showDetailDialog}
          onOpenChange={setShowDetailDialog}
          archetypeDetail={selectedArchetypeDetail}
        />
      )}
    </section>
  );
};

export default InteractiveDNAExplorer;
