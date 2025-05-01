
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import DNAHelix from './DNAHelix';
import { healthcareArchetypes } from '@/data/healthcareArchetypes';
import EmptyExplorerState from './EmptyExplorerState';
import { useIsMobile } from '@/hooks/use-mobile';
import WebsiteImage from '@/components/common/WebsiteImage';

const InteractiveDNAExplorer = () => {
  const [renderCount, setRenderCount] = useState(0);
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
            <p className="text-gray-400 mt-2 text-sm">
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
          <h2 className="text-2xl md:text-3xl font-bold">Explore the DNA of Employer Healthcare</h2>
          <p className="text-gray-400 mt-2">
            We've identified 9 distinct employer archetypes, grouped into 3 families based on how organizations manage healthcare.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side: DNA Visualization */}
          <div className="flex-grow lg:w-2/3">
            <div
              ref={containerRef} 
              className="relative h-[400px] w-full max-w-[800px] mx-auto"
            >
              <DNAHelix 
                selectedArchetypeId={selectedArchetypeId}
                onStepClick={handleArchetypeClick}
                selectedFamilyId={selectedFamilyId}
                onFamilyClick={handleFamilyClick}
                className="w-full h-full"
              />
            </div>
          </div>
          
          {/* Right side: Gnome and CTA */}
          <div className="lg:w-1/3 bg-blue-50 p-6 rounded-lg border border-blue-100 flex flex-col items-center justify-center">
            <WebsiteImage 
              type="lefthand" 
              altText="Friendly gnome character"
              className="h-32 mb-4"
            />
            
            <h3 className="text-2xl font-bold text-blue-700 mb-2">Come Play with the DNA!</h3>
            <p className="text-gray-600 mb-6 text-center">
              Click around the helix to explore what makes each archetype unique. Then take the assessment to discover which one matches your organization.
            </p>
            
            <Button asChild size="lg">
              <Link to="/assessment">Take the Assessment</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDNAExplorer;
