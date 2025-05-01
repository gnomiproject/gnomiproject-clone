
import React, { useState } from 'react';
import { healthcareArchetypes } from '@/data/healthcareArchetypes';
import { useIsMobile } from '@/hooks/use-mobile';
import EmptyExplorerState from './EmptyExplorerState';
import { useExplorerData } from './explorer/useExplorerData';
import ExplorerHeader from './explorer/ExplorerHeader';
import DNAVisualization from './explorer/DNAVisualization';
import ExplorerSidebar from './explorer/ExplorerSidebar';
import MobileExplorerFallback from './explorer/MobileExplorerFallback';

const InteractiveDNAExplorer = () => {
  const [selectedArchetypeId, setSelectedArchetypeId] = useState<string | null>(null);
  const [selectedFamilyId, setSelectedFamilyId] = useState<'a' | 'b' | 'c' | null>(null);
  const isMobile = useIsMobile();
  
  // Use the explorer data hook
  const { 
    formatArchetypeSummary,
    getFamilyInfo,
    getAllArchetypeSummaries
  } = useExplorerData();

  // Handle archetype selection
  const handleArchetypeClick = (archetypeId: string) => {
    try {
      setSelectedArchetypeId(prev => prev === archetypeId ? null : archetypeId);
      // Clear family selection when an archetype is selected
      if (selectedFamilyId) {
        setSelectedFamilyId(null);
      }
      console.log(`Selected archetype ${archetypeId}`);
    } catch (error) {
      console.error("Error handling archetype click:", error);
    }
  };

  // Handle family selection
  const handleFamilyClick = (familyId: 'a' | 'b' | 'c') => {
    try {
      setSelectedFamilyId(prev => prev === familyId ? null : familyId);
      // Clear archetype selection when a family is selected
      if (selectedArchetypeId) {
        setSelectedArchetypeId(null);
      }
      console.log(`Selected family ${familyId}`);
    } catch (error) {
      console.error("Error handling family click:", error);
    }
  };

  // Safeguard to prevent rendering if data is not available
  if (!healthcareArchetypes || healthcareArchetypes.length === 0) {
    return <EmptyExplorerState />;
  }

  // If on mobile, render a simplified version
  if (isMobile) {
    return <MobileExplorerFallback />;
  }

  return (
    <section id="dna-explorer" className="relative py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <ExplorerHeader />
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side: DNA Visualization */}
          <DNAVisualization 
            selectedArchetypeId={selectedArchetypeId}
            onArchetypeClick={handleArchetypeClick}
            selectedFamilyId={selectedFamilyId}
            onFamilyClick={handleFamilyClick}
          />
          
          {/* Right side: Details sidebar */}
          <div className="flex-grow min-w-[500px]">
            <ExplorerSidebar
              selectedArchetypeId={selectedArchetypeId}
              selectedFamilyId={selectedFamilyId}
              formatArchetypeSummary={formatArchetypeSummary}
              getFamilyInfo={getFamilyInfo}
              getAllArchetypeSummaries={getAllArchetypeSummaries}
              handleArchetypeClick={handleArchetypeClick}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDNAExplorer;
