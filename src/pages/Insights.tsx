
import React, { useEffect, useState } from 'react';
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
  const { selectedArchetype, sessionResults, sessionAnswers, sessionId, isLoading } = useInsightsData();
  const [messageShown, setMessageShown] = useState(false);

  // Enhanced debug logging to track component initialization
  useEffect(() => {
    console.log('[Insights] Component mounted successfully', { 
      hasSelectedArchetype: !!selectedArchetype,
      hasSessionResults: !!sessionResults,
      selectedArchetypeId: selectedArchetype || 'none',
      pathname: window.location.pathname,
      isLoading
    });
    
    // Use a timeout to allow data loading to complete before showing message
    let toastTimeout;
    
    // Only show message if still no archetype after a delay and message not yet shown
    if (!selectedArchetype && !isLoading && !messageShown && 
        !window.location.pathname.includes('assessment')) {
      
      // Delay the toast to give time for the data to load
      toastTimeout = setTimeout(() => {
        // Double check if archetype is still not available after delay
        if (!selectedArchetype) {
          toast.info("No assessment results found. Please take the assessment first.");
          setMessageShown(true);
        }
      }, 800); // Delay by 800ms to give time for data loading
    }
    
    return () => {
      console.log('[Insights] Component unmounting');
      if (toastTimeout) {
        clearTimeout(toastTimeout);
      }
    };
  }, [selectedArchetype, messageShown, isLoading]);

  // Handle retaking the assessment
  const handleRetakeAssessment = () => {
    console.log('[Insights] Navigating to assessment page');
    // Navigate to assessment without clearing localStorage or sessionStorage
    navigate('/assessment');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-12 pb-24 relative">
      <div className="max-w-5xl mx-auto">
        {/* Show loading state while determining if we have assessment results */}
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        ) : selectedArchetype ? (
          <InsightsContainer
            archetypeId={selectedArchetype}
            onRetakeAssessment={handleRetakeAssessment}
            assessmentResult={sessionResults}
            assessmentAnswers={sessionAnswers}
            hideRequestSection={false} // Explicitly set to false to ensure the form is shown
          />
        ) : (
          <NoAssessmentResults />
        )}
      </div>

      {/* Feedback menu component */}
      {selectedArchetype && !isLoading && (
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
