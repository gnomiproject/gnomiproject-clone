
import React from 'react';
import { useNavigate } from 'react-router-dom';
import NoAssessmentResults from '@/components/insights/NoAssessmentResults';
import InsightsContainer from '@/components/insights/InsightsContainer';
import FeedbackManager from '@/components/insights/FeedbackManager';
import useFormFocusDetection from '@/components/insights/FormFocusManager';
import { useInsightsData } from '@/hooks/useInsightsData';

const Insights = () => {
  const navigate = useNavigate();
  const { isFormVisible } = useFormFocusDetection();
  const { selectedArchetype, sessionResults, sessionAnswers, sessionId } = useInsightsData();

  // Add debug logging to help identify issues
  console.log('[Insights] Rendering main Insights page', { 
    hasSelectedArchetype: !!selectedArchetype,
    hasSessionResults: !!sessionResults
  });

  // Handle retaking the assessment
  const handleRetakeAssessment = () => {
    // Navigate to assessment without clearing localStorage or sessionStorage
    // This allows the user to come back to insights with their previous results
    navigate('/assessment');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-12 pb-24 relative">
      <div className="max-w-5xl mx-auto">
        {/* Show assessment results if an archetype is selected */}
        {selectedArchetype ? (
          <InsightsContainer
            archetypeId={selectedArchetype}
            onRetakeAssessment={handleRetakeAssessment}
            assessmentResult={sessionResults}
            assessmentAnswers={sessionAnswers}
          />
        ) : (
          <NoAssessmentResults />
        )}
      </div>

      {/* Feedback menu component */}
      {selectedArchetype && (
        <FeedbackManager
          archetypeId={selectedArchetype}
          sessionId={sessionId}
          assessmentResult={sessionResults}
          assessmentAnswers={sessionAnswers}
          isFormVisible={isFormVisible}
        />
      )}
    </div>
  );
};

export default Insights;
