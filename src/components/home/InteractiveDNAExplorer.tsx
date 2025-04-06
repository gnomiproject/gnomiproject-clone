
import React, { useState } from 'react';
import { useArchetypes } from '@/hooks/useArchetypes';
import DNAHelix from './DNAHelix';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionTitle from '@/components/shared/SectionTitle';
import { ArchetypeId } from '@/types/archetype';

const InteractiveDNAExplorer = () => {
  const { getAllArchetypeSummaries, getAllFamilies, getArchetypeStandard } = useArchetypes();
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

  // Get the selected archetype's detailed information (level 2)
  const selectedArchetypeData = selectedArchetype ? 
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
            ) : selectedArchetypeData ? (
              <div className="animate-fade-in space-y-6">
                {/* Archetype header */}
                <div className={`p-6 bg-white rounded-lg shadow-sm border border-gray-100`}>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <div className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-family-${selectedArchetypeData.familyId}/20 text-family-${selectedArchetypeData.familyId}`}>
                      Family {selectedArchetypeData.familyId}: {selectedArchetypeData.familyName}
                    </div>
                    <div className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-archetype-${selectedArchetypeData.id}/20 text-archetype-${selectedArchetypeData.id}`}>
                      {selectedArchetypeData.id}
                    </div>
                  </div>
                  
                  <h3 className={`text-2xl font-bold mb-3 text-archetype-${selectedArchetypeData.id}`}>
                    {selectedArchetypeData.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">{selectedArchetypeData.fullDescription}</p>
                  
                  <Link 
                    to={`/insights/${selectedArchetype}`} 
                    className={`inline-flex items-center mt-2 px-4 py-2 rounded text-white bg-archetype-${selectedArchetypeData.id} hover:opacity-90 transition-opacity`}
                  >
                    View Full Profile
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>

                {/* Key Statistics Section */}
                <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                  <h4 className="font-semibold text-gray-700 mb-4 text-lg">Key Statistics:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(selectedArchetypeData.keyStatistics).map(([key, stat]) => (
                      <div key={key} className={`bg-archetype-${selectedArchetypeData.id}/5 rounded-lg p-4 border border-archetype-${selectedArchetypeData.id}/20`}>
                        <h5 className="font-medium text-gray-600 text-sm mb-1">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </h5>
                        <div className="flex items-center">
                          <span className={`text-xl font-bold ${
                            stat.trend === 'up' ? 'text-orange-600' : 
                            stat.trend === 'down' ? 'text-green-600' : 
                            `text-archetype-${selectedArchetypeData.id}`
                          }`}>
                            {stat.value}
                          </span>
                          <span className={`ml-2 ${
                            stat.trend === 'up' ? 'text-orange-600' : 
                            stat.trend === 'down' ? 'text-green-600' : 
                            'text-gray-600'
                          }`}>
                            {stat.trend === 'up' ? '↑' : stat.trend === 'down' ? '↓' : '–'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Key Characteristics Section */}
                <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                  <h4 className="font-semibold text-gray-700 mb-4 text-lg">Key Characteristics:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedArchetypeData.keyCharacteristics.map((trait, index) => (
                      <div 
                        key={index} 
                        className={`flex items-start gap-3 p-4 rounded-md bg-archetype-${selectedArchetypeData.id}/5 border-l-3 border-archetype-${selectedArchetypeData.id}`}
                      >
                        <div className={`h-2.5 w-2.5 mt-1.5 rounded-full bg-archetype-${selectedArchetypeData.id} flex-shrink-0`}></div>
                        <span className="text-gray-700">{trait}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Insights Section */}
                <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                  <h4 className="font-semibold text-gray-700 mb-4 text-lg">Key Insights:</h4>
                  <ul className="space-y-3">
                    {selectedArchetypeData.keyInsights.map((insight, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className={`h-3 w-3 mt-1 rounded-full bg-archetype-${selectedArchetypeData.id} flex-shrink-0`}></div>
                        <span className="text-gray-600">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
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
