
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '@/components/shared/Button';
import SectionTitle from '@/components/shared/SectionTitle';
import { useArchetypes } from '@/hooks/useArchetypes';
import { ArchetypeId } from '@/types/archetype';
import ArchetypeReport from '@/components/insights/ArchetypeReport';

const Insights = () => {
  const [selectedArchetype, setSelectedArchetype] = useState<ArchetypeId | null>(null);
  const location = useLocation();
  const { getAllArchetypeSummaries } = useArchetypes();
  const archetypeSummaries = getAllArchetypeSummaries();
  
  useEffect(() => {
    // Check if an archetype was selected from Results page
    if (location.state?.selectedArchetype) {
      setSelectedArchetype(location.state.selectedArchetype);
      // Clear the location state to avoid persisting the selection on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Handle clicking on an archetype card
  const handleSelectArchetype = (archetypeId: ArchetypeId) => {
    setSelectedArchetype(archetypeId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <SectionTitle
            title="Healthcare Archetype Insights"
            subtitle="Discover strategies tailored to your organization's unique healthcare profile"
            center
          />
        </div>

        {/* No assessment results message (only show if no archetype is selected) */}
        {!selectedArchetype && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
              <div className="flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-4">No Assessment Results Found</h2>
                <p className="text-gray-600 mb-6 max-w-xl">
                  To access personalized insights about your organization's healthcare archetype, 
                  you'll need to complete our quick 3-minute assessment.
                </p>
                <Link to="/assessment">
                  <Button>Take the Assessment</Button>
                </Link>
              </div>
            </div>
            
            <div className="mt-12">
              <h3 className="text-xl font-bold mb-4">Why Complete the Assessment?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <span className="text-blue-600 text-xl">🔍</span>
                  </div>
                  <h4 className="font-bold mb-2">Identify Your Archetype</h4>
                  <p className="text-gray-600">
                    Discover which of the nine healthcare archetypes best matches your organization's profile.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <span className="text-green-600 text-xl">📊</span>
                  </div>
                  <h4 className="font-bold mb-2">Get Targeted Strategies</h4>
                  <p className="text-gray-600">
                    Access strategies proven to work for organizations with similar healthcare characteristics.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                    <span className="text-purple-600 text-xl">💰</span>
                  </div>
                  <h4 className="font-bold mb-2">Unlock Savings</h4>
                  <p className="text-gray-600">
                    Identify cost-saving opportunities specific to your healthcare management pattern.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-12">
              <Link to="/assessment">
                <Button className="mx-auto">Start My Assessment</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Show either selected archetype report or all archetype cards */}
        {selectedArchetype ? (
          <div>
            <div className="mb-8 flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => setSelectedArchetype(null)}
              >
                View All Archetypes
              </Button>
            </div>
            <ArchetypeReport archetypeId={selectedArchetype} />
          </div>
        ) : (
          <div className="mt-20">
            <h2 className="text-2xl font-bold mb-6 text-center">Explore Healthcare Archetypes</h2>
            <p className="text-gray-600 text-center max-w-3xl mx-auto mb-10">
              Even without taking the assessment, you can explore each healthcare archetype to learn 
              about different organizational profiles and strategies.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {archetypeSummaries.map((archetype) => (
                <div 
                  key={archetype.id}
                  onClick={() => handleSelectArchetype(archetype.id)}
                  className={`bg-white border rounded-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-${`archetype-${archetype.id}`}/50`}
                >
                  <div className={`w-12 h-12 rounded-full bg-${"archetype-" + archetype.id}/10 flex items-center justify-center mb-4`}>
                    <span className={`text-${"archetype-" + archetype.id} text-xl font-bold`}>{archetype.id}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{archetype.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm">Family {archetype.familyId.toUpperCase()}</p>
                  <p className="text-gray-700 mb-4">{archetype.description}</p>
                  <Button className={`w-full bg-${"archetype-" + archetype.id} hover:bg-${"archetype-" + archetype.id}/90 text-white`}>
                    View Report
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Insights;
