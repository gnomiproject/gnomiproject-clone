
import React, { useState } from 'react';
import { useArchetypes } from '@/hooks/useArchetypes';
import DNAHelix from './DNAHelix';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionTitle from '@/components/shared/SectionTitle';
import { ArchetypeId } from '@/types/archetype';

const InteractiveDNAExplorer = () => {
  const { getAllArchetypeSummaries, getAllFamilies } = useArchetypes();
  const archetypeSummaries = getAllArchetypeSummaries;
  const families = getAllFamilies;

  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const [selectedArchetype, setSelectedArchetype] = useState<ArchetypeId | null>(null);

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

  // Get the selected archetype's summary information
  const selectedArchetypeSummary = selectedArchetype ? 
    archetypeSummaries.find(archetype => archetype.id === selectedArchetype) : 
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Left side: DNA Helix Visualization */}
          <div className="md:col-span-1 order-2 md:order-1">
            <DNAHelix 
              className="h-[500px] mx-auto" 
              onStepClick={handleStepClick}
              selectedArchetypeId={selectedArchetype}
              onFamilyClick={handleFamilyClick}
              selectedFamilyId={selectedFamily as 'a' | 'b' | 'c' | null}
            />
            <div className="mt-4 text-center text-sm text-gray-500">
              Click on a step or family button to explore
            </div>
          </div>

          {/* Right side: Content display area */}
          <div className="md:col-span-2 order-1 md:order-2 space-y-6">
            {/* Display selected content or default message */}
            {!selectedArchetype && !selectedFamily ? (
              <div className="flex flex-col items-center justify-center h-full p-10 bg-gray-50 rounded-lg border border-gray-100 text-center">
                <img 
                  src="/lovable-uploads/3efcc8b7-0e2d-4a2b-bb23-fa686f18c691.png" 
                  alt="Interactive guide" 
                  className="h-16 mb-4 opacity-60"
                />
                <h3 className="text-xl font-bold text-gray-700 mb-2">Explore the Healthcare Archetypes</h3>
                <p className="text-gray-600 max-w-md">
                  Click on any step in the DNA helix or family button to learn more about our healthcare archetypes.
                </p>
              </div>
            ) : selectedArchetypeSummary ? (
              <div className="animate-fade-in p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mb-2 bg-archetype-${selectedArchetypeSummary.id}/20 text-archetype-${selectedArchetypeSummary.id}`}>
                  Family {selectedArchetypeSummary.familyId}
                </div>
                <h3 className={`text-2xl font-bold mb-3 text-archetype-${selectedArchetypeSummary.id}`}>
                  {selectedArchetypeSummary.name}
                </h3>
                
                <p className="text-gray-600 mb-4">{selectedArchetypeSummary.description}</p>
                
                <h4 className="font-semibold text-gray-700 mb-2">Key Characteristics:</h4>
                <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                  {selectedArchetypeSummary.keyCharacteristics.map((trait, index) => (
                    <li key={index}>{trait}</li>
                  ))}
                </ul>
                
                <Link 
                  to={`/insights/${selectedArchetype}`} 
                  className={`inline-flex items-center mt-4 px-4 py-2 rounded text-white bg-archetype-${selectedArchetypeSummary.id} hover:opacity-90 transition-opacity`}
                >
                  View Full Profile
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            ) : selectedFamilyInfo ? (
              <div className={`animate-fade-in p-6 bg-white rounded-lg shadow-sm border-l-4 border-family-${selectedFamilyInfo.id}`}>
                <h3 className={`text-2xl font-bold mb-3 text-family-${selectedFamilyInfo.id}`}>
                  Family {selectedFamilyInfo.id}: {selectedFamilyInfo.name}
                </h3>
                
                <p className="text-gray-600 mb-4">{selectedFamilyInfo.description}</p>
                
                <h4 className="font-semibold text-gray-700 mb-2">Common Traits:</h4>
                <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                  {selectedFamilyInfo.commonTraits.map((trait, index) => (
                    <li key={index}>{trait}</li>
                  ))}
                </ul>
                
                <div className="mt-6 space-y-4">
                  <h4 className="font-semibold text-gray-700">Archetypes in this family:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {archetypeSummaries
                      .filter(archetype => archetype.familyId === selectedFamilyInfo.id)
                      .map(archetype => (
                        <div 
                          key={archetype.id} 
                          className={`p-3 bg-gray-50 rounded border-l-3 border-archetype-${archetype.id} cursor-pointer hover:shadow-md transition-shadow`}
                          onClick={() => setSelectedArchetype(archetype.id)}
                        >
                          <h5 className={`font-semibold text-archetype-${archetype.id}`}>{archetype.name}</h5>
                          <p className="text-sm text-gray-600 mt-1">{archetype.description.substring(0, 75)}...</p>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDNAExplorer;
