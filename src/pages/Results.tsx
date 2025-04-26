
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SectionTitle from '@/components/shared/SectionTitle';
import { useArchetypes } from '../hooks/useArchetypes';
import { AssessmentResult } from '../types/assessment';
import ArchetypeHeader from '@/components/results/ArchetypeHeader';
import DetailedAnalysisTabs from '@/components/results/DetailedAnalysisTabs';
import PremiumReport from '@/components/results/PremiumReport';
import { ArrowDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Storage key for session results
const SESSION_RESULTS_KEY = 'healthcareArchetypeSessionResults';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { allDetailedArchetypes, allFamilies, isLoading } = useArchetypes();
  
  // Get the result from location state or redirect to assessment
  const result = location.state?.result as AssessmentResult | undefined;
  
  useEffect(() => {
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
  
  // Show loading state while archetype data is loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden p-8">
            <SectionTitle 
              title="Loading Results"
              subtitle="Please wait while we load your assessment results."
              center
            />
            <div className="space-y-4 my-8">
              <Skeleton className="h-12 w-3/4 mx-auto" />
              <Skeleton className="h-8 w-1/2 mx-auto" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Get the archetype data directly from allDetailedArchetypes
  const archetypeData = allDetailedArchetypes?.find(archetype => archetype.id === result.primaryArchetype);
  
  if (!archetypeData) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden p-8">
            <SectionTitle 
              title="Results Not Available"
              subtitle="We couldn't find detailed information for your archetype."
              center
            />
            <div className="flex justify-center mt-8">
              <button 
                onClick={() => navigate('/assessment')}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Retake Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  console.log("Results page - archetype data:", archetypeData);
  
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

          {/* Detailed Analysis Tabs */}
          <div className="border-t">
            <DetailedAnalysisTabs 
              archetypeData={archetypeData} 
              onRetakeAssessment={handleRetakeAssessment} 
            />
          </div>
          
          {/* Premium Report Component */}
          <div className="border-t p-6 md:p-8 bg-gray-50">
            <PremiumReport 
              archetypeData={archetypeData} 
              archetypeId={archetypeData.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
