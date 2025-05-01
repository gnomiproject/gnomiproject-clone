
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import DNAHelix from './DNAHelix';
import { healthcareArchetypes } from '@/data/healthcareArchetypes';
import EmptyExplorerState from './EmptyExplorerState';
import { useIsMobile } from '@/hooks/use-mobile';

const InteractiveDNAExplorer = () => {
  const [renderCount, setRenderCount] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedArchetypeId, setSelectedArchetypeId] = useState<string | null>(null);
  const [selectedFamilyId, setSelectedFamilyId] = useState<'a' | 'b' | 'c' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const isMobile = useIsMobile();
  
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

  // Handle archetype selection
  const handleArchetypeClick = (archetypeId: string) => {
    try {
      setSelectedArchetypeId(archetypeId);
      console.log(`Selected archetype ${archetypeId}`);
    } catch (error) {
      console.error("Error handling archetype click:", error);
    }
  };

  // Handle family selection
  const handleFamilyClick = (familyId: 'a' | 'b' | 'c') => {
    try {
      setSelectedFamilyId(prev => prev === familyId ? null : familyId);
      console.log(`Selected family ${familyId}`);
    } catch (error) {
      console.error("Error handling family click:", error);
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

  // If on mobile, render a simplified version or nothing
  if (isMobile) {
    return (
      <section id="dna-explorer" className="relative py-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold">Healthcare Archetype Families</h2>
            <p className="text-gray-600 mt-2 text-sm">
              View on desktop to explore the interactive DNA visualization.
            </p>
          </div>
        </div>
      </section>
    );
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
            selectedArchetypeId={selectedArchetypeId}
            onStepClick={handleArchetypeClick}
            selectedFamilyId={selectedFamilyId}
            onFamilyClick={handleFamilyClick}
            className="w-full h-full"
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
