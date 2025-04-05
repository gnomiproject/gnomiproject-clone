
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '@/components/shared/Button';
import SectionTitle from '@/components/shared/SectionTitle';
import { RefreshCw, Check, ChevronDown } from 'lucide-react';
import { useArchetypes } from '../hooks/useArchetypes';
import { AssessmentResult } from '../types/assessment';

const Results = () => {
  const [showDetails, setShowDetails] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { getArchetypeEnhanced, getFamilyById } = useArchetypes();
  
  // Get the result from location state or redirect to assessment
  const result = location.state?.result as AssessmentResult | undefined;
  
  useEffect(() => {
    if (!result) {
      navigate('/assessment');
    }
  }, [result, navigate]);
  
  if (!result) return null;
  
  // Get the archetype data
  const archetypeData = getArchetypeEnhanced(result.primaryArchetype);
  const familyId = archetypeData?.familyId;
  const familyData = familyId ? getFamilyById(familyId) : undefined;
  
  if (!archetypeData) return null;
  
  const handleRetakeAssessment = () => {
    navigate('/assessment');
  };

  const handleViewInsights = () => {
    navigate('/insights', { state: { selectedArchetype: archetypeData.id } });
  };
  
  // Using the custom color based on archetype.id
  const color = `archetype-${archetypeData.id}`;
  const familyColor = `family-${archetypeData.familyId}`;
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <div className={`bg-white rounded-lg shadow-sm overflow-hidden border-t-4 border-${color}`}>
          <div className="p-8">
            <SectionTitle 
              title="Assessment Results"
              subtitle="The best match for your organization is:"
              center
            />

            <div className="text-center mb-6">
              <span className={`inline-block bg-${familyColor}/10 text-${familyColor} rounded-full px-4 py-1 text-sm font-medium`}>
                family {archetypeData.familyId}: {familyData?.name || ''}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              {archetypeData.name} <span className={`inline-block bg-${color}/10 text-${color} border border-${color}/30 rounded-full px-3 py-1 text-sm font-medium align-middle ml-2`}>{archetypeData.id}</span>
            </h2>

            <p className="text-gray-700 text-lg text-center mb-8">
              {archetypeData.summary.description}
            </p>

            <div className="flex justify-center mb-8">
              <Button
                onClick={handleRetakeAssessment}
                variant="outline"
                className="flex items-center text-sm"
                size="sm"
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Retake Assessment
              </Button>
            </div>

            {/* Make the dropdown button more prominent */}
            <div className="text-center mb-8">
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className={`flex items-center justify-center mx-auto px-6 py-3 rounded-lg text-white font-medium transition-colors bg-${color} hover:bg-${color}/90`}
              >
                {showDetails ? "Hide Detailed Analysis" : "Show Detailed Analysis"}
                <ChevronDown className={`ml-2 h-5 w-5 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {showDetails && (
            <div className="border-t">
              <div className="bg-white px-8 py-6">
                <h3 className="text-2xl font-bold mb-6">Detailed Analysis</h3>
                
                <div className="border-b flex overflow-x-auto">
                  <button className={`px-6 py-3 font-medium text-${color} border-b-2 border-${color}`}>Overview</button>
                  <button className="px-6 py-3 font-medium text-gray-600 hover:text-gray-800">KPIs & Risk</button>
                  <button className="px-6 py-3 font-medium text-gray-600 hover:text-gray-800">Strategic Priorities</button>
                  <button className="px-6 py-3 font-medium text-gray-600 hover:text-gray-800">SWOT Analysis</button>
                  <button className="px-6 py-3 font-medium text-gray-600 hover:text-gray-800">Cost Savings</button>
                </div>

                <div className="py-8">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/3 md:border-r md:pr-8">
                      <div className="flex flex-col h-full">
                        <div className={`bg-${color}/10 rounded-full h-24 w-24 flex items-center justify-center mb-6`}>
                          <span className={`text-3xl font-bold text-${color}`}>{archetypeData.id}</span>
                        </div>
                        <h4 className="text-2xl font-bold mb-4">{archetypeData.name}</h4>
                        <h5 className="text-xl font-bold mb-4">What Makes {archetypeData.name} Unique</h5>
                        <p className="text-gray-600 mb-6">
                          Organizations in the {archetypeData.name} archetype have a distinctive approach to healthcare benefits and management strategies. Here's what sets them apart:
                        </p>
                      </div>
                    </div>
                    <div className="w-full md:w-2/3 md:pl-8 mt-8 md:mt-0">
                      <h4 className="text-2xl font-bold mb-6">Recommended Strategies</h4>
                      <p className="mb-6 text-gray-700">
                        Based on extensive analysis of similar organizations, these are the most effective healthcare strategies for the {archetypeData.name} archetype:
                      </p>

                      <div className="space-y-6">
                        {archetypeData.enhanced?.strategicPriorities?.slice(0, 3).map((priority, index) => (
                          <div key={index} className="bg-white rounded-lg border p-6">
                            <div className="flex items-start gap-4">
                              <div className={`bg-${color}/10 rounded-full p-3`}>
                                <span className={`text-${color}`}>
                                  {index === 0 ? '🧠' : index === 1 ? '💎' : '📈'}
                                </span>
                              </div>
                              <div>
                                <h5 className="font-bold mb-2">{priority.title}</h5>
                                <p className="text-gray-600">
                                  {priority.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-gray-50 px-8 py-6 border-t">
            <h3 className="text-xl font-bold mb-4">Want a More In-Depth Analysis?</h3>
            <p className="text-gray-600 mb-6">
              Get a comprehensive report tailored specifically for your organization based on your {archetypeData.name} archetype.
            </p>

            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-${color} text-xl`}>📄</span>
                <h4 className="text-xl font-bold">Complete {archetypeData.id} Archetype Analysis</h4>
                <span className={`bg-${color}/10 text-${color} text-xs px-2 py-1 rounded-full`}>PREMIUM</span>
              </div>

              <h5 className="font-bold mb-4">Your detailed report includes:</h5>

              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <span className={`text-${color} mr-2`}>→</span>
                  <span>Customized benchmarking against similar organizations</span>
                </li>
                <li className="flex items-start">
                  <span className={`text-${color} mr-2`}>→</span>
                  <span>Strategic implementation roadmap with priorities</span>
                </li>
                <li className="flex items-start">
                  <span className={`text-${color} mr-2`}>→</span>
                  <span>Cost-saving estimates specific to your business</span>
                </li>
                <li className="flex items-start">
                  <span className={`text-${color} mr-2`}>→</span>
                  <span>Expert consultation with a healthcare strategist</span>
                </li>
              </ul>

              <div className="flex flex-col md:flex-row items-center justify-between">
                <p className="text-gray-600 mb-4 md:mb-0">
                  Our team will prepare a custom analysis within 24 hours.
                </p>
                <Button className={`bg-${color} hover:bg-${color}/90 text-white w-full md:w-auto`}>
                  Request My Detailed Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
