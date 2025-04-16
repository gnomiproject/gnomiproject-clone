
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SectionTitle from '@/components/shared/SectionTitle';
import { useArchetypes } from '../hooks/useArchetypes';
import { AssessmentResult } from '../types/assessment';
import ArchetypeHeader from '@/components/results/ArchetypeHeader';
import DetailedAnalysisTabs from '@/components/results/DetailedAnalysisTabs';
import PremiumReport from '@/components/results/PremiumReport';
import { ArrowDown } from 'lucide-react';

// Storage key for session results
const SESSION_RESULTS_KEY = 'healthcareArchetypeSessionResults';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { allDetailedArchetypes, allFamilies } = useArchetypes();
  
  // Get the result from location state or redirect to assessment
  const result = location.state?.result as AssessmentResult | undefined;
  
  React.useEffect(() => {
    if (!result) {
      // Try to get results from sessionStorage
      const sessionResultsStr = sessionStorage.getItem(SESSION_RESULTS_KEY);
      if (sessionResultsStr) {
        // If found in sessionStorage, update the location state
        try {
          const sessionResults = JSON.parse(sessionResultsStr) as AssessmentResult;
          navigate('/results', { state: { result: sessionResults }, replace: true });
        } catch (error) {
          console.error('Error parsing session results:', error);
          navigate('/assessment');
        }
      } else {
        navigate('/assessment');
      }
    } else {
      // Save to sessionStorage for persistence during session
      sessionStorage.setItem(SESSION_RESULTS_KEY, JSON.stringify(result));
    }
  }, [result, navigate]);
  
  if (!result) return null;
  
  // Get the archetype data directly from allDetailedArchetypes
  const archetypeData = allDetailedArchetypes?.find(archetype => archetype.id === result.primaryArchetype);
  if (!archetypeData) return null;
  
  const familyId = archetypeData.familyId;
  // Find family data from allFamilies
  const familyData = familyId && allFamilies ? allFamilies.find(family => family.id === familyId) : undefined;
  
  // Using the custom color based on archetype.id
  const color = `archetype-${archetypeData.id}`;
  
  const handleRetakeAssessment = () => {
    navigate('/assessment');
  };
  
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

            {/* Archetype Header Component */}
            <ArchetypeHeader 
              archetypeData={archetypeData}
              familyData={familyData}
            />

            {/* Prompt to check detailed analysis with bouncing arrow */}
            <div className="text-center mb-8">
              <p className="text-gray-600">
                Scroll down to explore your detailed analysis results below.
              </p>
              <div className="flex justify-center mt-4 animate-bounce">
                <ArrowDown className={`h-8 w-8 text-${color}`} />
              </div>
            </div>
          </div>

          {/* Detailed Analysis Tabs (always visible) */}
          <div className="border-t">
            <DetailedAnalysisTabs 
              archetypeData={archetypeData} 
              onRetakeAssessment={handleRetakeAssessment} 
            />
          </div>
          
          {/* Premium Report Component */}
          <PremiumReport archetypeData={archetypeData} />
        </div>
      </div>
    </div>
  );
};

export default Results;
