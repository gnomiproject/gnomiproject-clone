
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NoAssessmentResults from '@/components/insights/NoAssessmentResults';
import InsightsContainer from '@/components/insights/InsightsContainer';
import FeedbackManager from '@/components/insights/FeedbackManager';
import useFormFocusDetection from '@/components/insights/FormFocusManager';
import { useInsightsData } from '@/hooks/useInsightsData';
import { toast } from 'sonner';

const Insights = () => {
  const navigate = useNavigate();
  const { isFormVisible } = useFormFocusDetection();
  const { selectedArchetype, sessionResults, sessionAnswers, sessionId } = useInsightsData();

  // Enhanced debug logging to track component initialization
  useEffect(() => {
    console.log('[Insights] Component mounted successfully', { 
      hasSelectedArchetype: !!selectedArchetype,
      hasSessionResults: !!sessionResults,
      pathname: window.location.pathname,
    });
    
    // Show a friendly message if there are no results and not coming from assessment
    if (!selectedArchetype && !window.location.pathname.includes('assessment')) {
      toast.info("No assessment results found. Please take the assessment first.");
    }
    
    return () => {
      console.log('[Insights] Component unmounting');
    };
  }, [selectedArchetype]);

  // Handle retaking the assessment
  const handleRetakeAssessment = () => {
    console.log('[Insights] Navigating to assessment page');
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
