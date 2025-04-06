
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

  // Get the selected archetype's summary information (level 1)
  const selectedArchetypeSummary = selectedArchetype ? 
    archetypeSummaries.find(archetype => archetype.id === selectedArchetype) : 
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

          {/* Middle: Family descriptions */}
          <div className="md:col-span-1 order-1 md:order-2 flex flex-col justify-center">
            <div className="text-center md:text-left mb-8">
              <h3 className="text-xl font-bold mb-4">Archetype Families</h3>
              <p className="text-gray-600 mb-6">
                Each of our nine healthcare archetypes belongs to one of three distinct families. 
                Click on a family to learn more.
              </p>
            </div>

            <div className="space-y-4">
              {families.map((family) => (
                <div 
                  key={family.id}
                  className={`p-4 rounded-lg transition-all cursor-pointer border-l-4 hover:shadow-md ${
                    selectedFamily === family.id 
                      ? `bg-family-${family.id}/10 border-family-${family.id} shadow-md` 
                      : 'border-transparent bg-gray-50'
                  }`}
                  onClick={() => setSelectedFamily(family.id === selectedFamily ? null : family.id)}
                >
                  <h4 className={`font-semibold ${selectedFamily === family.id ? `text-family-${family.id}` : ''}`}>
                    Family {family.id.toUpperCase()}: {family.name}
                  </h4>
                  {selectedFamily === family.id && (
                    <div className="mt-2 animate-fade-in">
                      <p className="text-gray-700 mb-2">{family.description}</p>
                      <ul className="list-disc list-inside text-sm text-gray-600">
                        {family.commonTraits.slice(0, 2).map((trait, index) => (
                          <li key={index}>{trait}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Link to="/assessment" className="mt-8 flex items-center justify-center md:justify-start text-blue-500 hover:underline">
              Find your archetype <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          {/* Right side: Selected Archetype Summary (Level 1) or Archetype examples */}
          <div className="md:col-span-1 order-3">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm h-full">
              {selectedArchetypeSummary ? (
                <div className="animate-fade-in">
                  <div className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mb-2 bg-archetype-${selectedArchetypeSummary.id}/20 text-archetype-${selectedArchetypeSummary.id}`}>
                    Family {selectedArchetypeSummary.familyId.toUpperCase()}
                  </div>
                  <h3 className={`text-xl font-bold mb-3 text-archetype-${selectedArchetypeSummary.id}`}>
                    {selectedArchetypeSummary.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">{selectedArchetypeSummary.description}</p>
                  
                  <h4 className="font-semibold text-gray-700 mb-2">Key Characteristics:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 mb-4">
                    {selectedArchetypeSummary.keyCharacteristics.slice(0, 3).map((trait, index) => (
                      <li key={index}>{trait}</li>
                    ))}
                  </ul>
                  
                  <Link 
                    to={`/insights/${selectedArchetype}`} 
                    className={`inline-block mt-4 px-4 py-2 rounded text-white bg-archetype-${selectedArchetypeSummary.id} hover:opacity-90 transition-opacity`}
                  >
                    View Full Profile
                  </Link>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold mb-4">Featured Archetypes</h3>
                  
                  <div className="space-y-4">
                    {selectedFamily 
                      ? archetypeSummaries
                          .filter(archetype => archetype.familyId === selectedFamily)
                          .slice(0, 3)
                          .map(archetype => (
                            <div 
                              key={archetype.id} 
                              className={`p-3 bg-white rounded border-l-3 border-archetype-${archetype.id} shadow-sm cursor-pointer hover:shadow-md transition-shadow`}
                              onClick={() => setSelectedArchetype(archetype.id)}
                            >
                              <h4 className={`font-semibold text-archetype-${archetype.id}`}>{archetype.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">{archetype.description.substring(0, 100)}...</p>
                            </div>
                          ))
                      : archetypeSummaries
                          .filter((_, index) => index % 3 === 0)
                          .slice(0, 3)
                          .map(archetype => (
                            <div 
                              key={archetype.id} 
                              className={`p-3 bg-white rounded border-l-3 border-archetype-${archetype.id} shadow-sm cursor-pointer hover:shadow-md transition-shadow`}
                              onClick={() => setSelectedArchetype(archetype.id)}
                            >
                              <h4 className={`font-semibold text-archetype-${archetype.id}`}>{archetype.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">{archetype.description.substring(0, 100)}...</p>
                            </div>
                          ))
                    }
                  </div>
                  
                  <Link to="#archetype-section" className="mt-4 flex items-center text-blue-500 hover:underline">
                    View all archetypes <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDNAExplorer;
