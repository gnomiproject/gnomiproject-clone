
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SectionTitle from '@/components/shared/SectionTitle';
import { useArchetypes } from '../hooks/useArchetypes';
import { AssessmentResult } from '../types/assessment';
import RetakeButton from '@/components/results/RetakeButton';
import ArchetypeHeader from '@/components/results/ArchetypeHeader';
import DetailToggleButton from '@/components/results/DetailToggleButton';
import DetailedAnalysisTabs from '@/components/results/DetailedAnalysisTabs';
import PremiumReport from '@/components/results/PremiumReport';

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
  
  // Using the custom color based on archetype.id
  const color = `archetype-${archetypeData.id}`;
  
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

            {/* Retake Button Component */}
            <div className="flex justify-center mb-8">
              <RetakeButton onClick={handleRetakeAssessment} />
            </div>

            {/* Detail Toggle Button Component */}
            <DetailToggleButton 
              showDetails={showDetails}
              setShowDetails={setShowDetails}
              archetypeData={archetypeData}
            />
          </div>

          {/* Detailed Analysis Tabs (conditionally rendered) */}
          {showDetails && (
            <div className="border-t">
              <DetailedAnalysisTabs archetypeData={archetypeData} />
            </div>
          )}
          
          {/* Premium Report Component */}
          <PremiumReport archetypeData={archetypeData} />
        </div>
      </div>
    </div>
  );
};

export default Results;
