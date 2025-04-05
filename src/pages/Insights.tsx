
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '@/components/shared/Button';
import SectionTitle from '@/components/shared/SectionTitle';
import { useArchetypes } from '@/hooks/useArchetypes';
import { ArchetypeId } from '@/types/archetype';
import ArchetypeReport from '@/components/insights/ArchetypeReport';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, RefreshCw } from 'lucide-react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';

const Insights = () => {
  const [selectedArchetype, setSelectedArchetype] = useState<ArchetypeId | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { getAllArchetypeSummaries, getArchetypeEnhanced, getFamilyById } = useArchetypes();
  
  // Fix: getAllArchetypeSummaries is returning an array, not a function
  const archetypeSummaries = getAllArchetypeSummaries;
  
  useEffect(() => {
    // Check if an archetype was selected from Results page
    if (location.state?.selectedArchetype) {
      setSelectedArchetype(location.state.selectedArchetype);
      // Clear the location state to avoid persisting the selection on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Handle retaking the assessment
  const handleRetakeAssessment = () => {
    navigate('/assessment');
  };

  // Get the archetype data if one is selected
  const archetypeData = selectedArchetype ? getArchetypeEnhanced(selectedArchetype) : null;
  const familyData = archetypeData?.familyId ? getFamilyById(archetypeData.familyId) : null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        {/* Show assessment results if an archetype is selected */}
        {selectedArchetype && archetypeData ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-12 border">
            {/* Orange top border - using the archetype-specific color */}
            <div className={`h-2 bg-${`archetype-${archetypeData.id}`}`}></div>
            
            <div className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Assessment Results</h1>
                <p className="text-gray-600">The best match for your organization is:</p>
              </div>
              
              <div className="text-center mb-6">
                <Badge className={`bg-family-${archetypeData.familyId}/10 text-family-${archetypeData.familyId} hover:bg-family-${archetypeData.familyId}/20 border-0 px-4 py-2 rounded-full text-sm`}>
                  Family {archetypeData.familyId}: {familyData?.name}
                </Badge>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-center flex items-center justify-center gap-3 mb-6">
                {archetypeData.name}
                <span className={`inline-flex items-center justify-center bg-${`archetype-${archetypeData.id}`}/10 text-${`archetype-${archetypeData.id}`} border border-${`archetype-${archetypeData.id}`}/30 rounded-full px-3 py-1 text-sm font-medium`}>
                  {archetypeData.id}
                </span>
              </h2>

              <p className="text-gray-700 text-lg text-center max-w-3xl mx-auto mb-8">
                {archetypeData.summary.description}
              </p>

              <div className="flex justify-center">
                <Button
                  onClick={handleRetakeAssessment}
                  variant="outline"
                  className="flex items-center"
                >
                  <RefreshCw className="mr-2 h-4 w-4" /> Retake Assessment
                </Button>
              </div>
            </div>
            
            {/* Detailed analysis section - now open by default */}
            <Collapsible
              open={isOpen}
              onOpenChange={setIsOpen}
              className="w-full"
            >
              <div className="border-t py-4 px-8 text-center">
                <CollapsibleTrigger className="flex items-center justify-center text-gray-600 hover:text-gray-800 w-full">
                  {isOpen ? "Hide detailed analysis" : "Show detailed analysis"}
                  <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
              </div>
              
              <CollapsibleContent>
                <div className="border-t">
                  <div className="p-8">
                    <h2 className="text-2xl font-bold mb-8">Detailed Analysis</h2>
                    <ArchetypeReport archetypeId={selectedArchetype} />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
              <div className="flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-4">No Assessment Results Found</h2>
                <p className="text-gray-600 mb-6 max-w-xl text-center">
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
      </div>
    </div>
  );
};

export default Insights;
