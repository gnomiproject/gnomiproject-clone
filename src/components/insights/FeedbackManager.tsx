
import React, { useCallback, useEffect, useRef } from 'react';
import { ArchetypeId } from '@/types/archetype';
import { AssessmentResult } from '@/types/assessment';
import MatchFeedbackMenu from './MatchFeedbackMenu';

interface FeedbackManagerProps {
  archetypeId: ArchetypeId;
  sessionId: string | null;
  assessmentResult: AssessmentResult | null;
  assessmentAnswers: any;
  isFormVisible: boolean;
}

const FeedbackManager: React.FC<FeedbackManagerProps> = ({
  archetypeId,
  sessionId,
  assessmentResult,
  assessmentAnswers,
  isFormVisible
}) => {
  const [showFeedback, setShowFeedback] = React.useState(false);
  const [hasFeedbackBeenClosed, setHasFeedbackBeenClosed] = React.useState(false);
  const scrollTimeout = useRef<number | null>(null);
  const hasScrolledRef = useRef(false);
  
  // Optimized scroll event handler with useCallback to prevent recreation on each render
  const handleScroll = useCallback(() => {
    if (scrollTimeout.current !== null) {
      return;
    }
    
    scrollTimeout.current = window.setTimeout(() => {
      if (!hasFeedbackBeenClosed && window.scrollY > 100 && !isFormVisible && !hasScrolledRef.current) {
        setShowFeedback(true);
        hasScrolledRef.current = true; // Mark that we've shown feedback after scroll
      }
      scrollTimeout.current = null;
    }, 300); // Increased debounce time for better performance
  }, [hasFeedbackBeenClosed, isFormVisible]);

  // Add scroll event listener to show feedback menu when scrolling
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current !== null) {
        window.clearTimeout(scrollTimeout.current);
      }
    };
  }, [handleScroll]);

  // Handle closing the feedback menu with error handling
  const handleCloseFeedback = () => {
    try {
      setShowFeedback(false);
      setHasFeedbackBeenClosed(true);
    } catch (error) {
      console.error('Error closing feedback menu:', error);
    }
  };

  if (!showFeedback || isFormVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-10 animate-slide-in-from-bottom">
      <MatchFeedbackMenu 
        archetypeId={archetypeId} 
        onClose={handleCloseFeedback}
        sessionId={sessionId}
        assessmentResult={assessmentResult}
        assessmentAnswers={assessmentAnswers}
      />
    </div>
  );
};

export default FeedbackManager;
