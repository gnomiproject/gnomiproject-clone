
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import DNAHelix from './DNAHelix';
import { healthcareArchetypes } from '@/data/healthcareArchetypes';
import { setupDNAInteractions } from './utils/dna/interactions';
import { StrandType } from './types/dnaHelix';
import EmptyExplorerState from './EmptyExplorerState';

const InteractiveDNAExplorer = () => {
  const [renderCount, setRenderCount] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedStrand, setSelectedStrand] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  
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
  const formattedArchetypes = React.useMemo(() => {
    console.info(`InteractiveDNAExplorer: Formatting archetype summaries (sequence #${renderCount})`);
    try {
      // Process archetypes for DNA helix visualization
      return {
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
    } catch (error) {
      console.error("Error formatting archetype data:", error);
      return { familyA: [], familyB: [], familyC: [] };
    }
  }, [renderCount]);

  // Initialize interactions when component mounts
  useEffect(() => {
    if (!initialized.current && containerRef.current) {
      try {
        setupDNAInteractions();
        initialized.current = true;
      } catch (error) {
        console.error("Error initializing DNA interactions:", error);
      }
    }
  }, []);

  // Handle strand selection
  const handleStrandClick = (strandType: StrandType, strandId: string) => {
    try {
      setSelectedStrand(strandId);
      console.log(`Selected strand ${strandId} of type ${strandType}`);
    } catch (error) {
      console.error("Error handling strand click:", error);
    }
  };

  // Toggle expanded view
  const toggleExpanded = () => {
    setIsExpanded(prev => !prev);
  };

  // Safeguard to prevent rendering if data is not available
  if (!healthcareArchetypes || healthcareArchetypes.length === 0) {
    return <EmptyExplorerState />;
  }

  return (
    <section id="dna-explorer" className="relative py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Explore Healthcare Archetype DNA</h2>
          <p className="text-gray-600 mt-2">
            See how nine distinct healthcare profiles form three interconnected families.
          </p>
        </div>
        
        <div
          ref={containerRef} 
          className={`relative transition-all duration-500 ease-in-out overflow-hidden ${
            isExpanded ? 'h-[600px]' : 'h-[350px]'
          }`}
        >
          <DNAHelix 
            familyA={formattedArchetypes.familyA}
            familyB={formattedArchetypes.familyB}
            familyC={formattedArchetypes.familyC}
            selectedStrand={selectedStrand}
            onStrandClick={handleStrandClick}
            isExpanded={isExpanded}
          />
        </div>
        
        <div className="text-center mt-4">
          <Button 
            variant="ghost" 
            onClick={toggleExpanded}
            className="text-blue-600"
          >
            {isExpanded ? 'Show Less' : 'Expand View'}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDNAExplorer;
