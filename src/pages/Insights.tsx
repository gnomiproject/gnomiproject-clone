
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
  
  useEffect(() => {
    // Check if an archetype was selected from Results page
    if (location.state?.selectedArchetype) {
      setSelectedArchetype(location.state.selectedArchetype);
      // Clear the location state to avoid persisting the selection on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {selectedArchetype ? (
          <ArchetypeReport archetypeId={selectedArchetype} />
        ) : (
          <div className="text-center py-16">
            <div className="max-w-3xl mx-auto">
              <SectionTitle
                title="Discover Your Organization's Healthcare Archetype"
                subtitle="Get personalized insights based on your unique healthcare profile"
                center
              />
              
              <div className="mt-10 bg-white rounded-lg shadow-sm p-8 mb-12">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Insights;
