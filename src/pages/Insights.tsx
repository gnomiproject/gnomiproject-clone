import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArchetypeId } from '@/types/archetype';
import { AssessmentResult } from '@/types/assessment';
import MatchFeedbackMenu from '@/components/insights/MatchFeedbackMenu';
import NoAssessmentResults from '@/components/insights/NoAssessmentResults';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import InsightsContainer from '@/components/insights/InsightsContainer';

// Storage keys
const INSIGHTS_STORAGE_KEY = 'healthcareArchetypeInsights';
const SESSION_RESULTS_KEY = 'healthcareArchetypeSessionResults';
const SESSION_ID_KEY = 'healthcareArchetypeSessionId';
const SESSION_ANSWERS_KEY = 'healthcareArchetypeAnswers';
const SESSION_EXACT_EMPLOYEE_COUNT_KEY = 'healthcareArchetypeExactEmployeeCount';

const Insights = () => {
  const [selectedArchetype, setSelectedArchetype] = useState<ArchetypeId | null>(null);
  const [sessionResults, setSessionResults] = useState<AssessmentResult | null>(null);
  const [sessionAnswers, setSessionAnswers] = useState<any | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [hasFeedbackBeenClosed, setHasFeedbackBeenClosed] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Added effect to detect when user is focusing on form inputs
  useEffect(() => {
    const formInputs = document.querySelectorAll('input, textarea');
    
    const handleFocus = () => setIsFormVisible(true);
    const handleBlur = () => {
      // Set a small delay to avoid flickering when switching between form fields
      setTimeout(() => {
        // Check if any form element is still focused
        if (!document.activeElement || 
            (document.activeElement.tagName !== 'INPUT' && 
             document.activeElement.tagName !== 'TEXTAREA' &&
             document.activeElement.tagName !== 'SELECT')) {
          setIsFormVisible(false);
        }
      }, 100);
    };
    
    formInputs.forEach(input => {
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
    });
    
    return () => {
      formInputs.forEach(input => {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
      });
    };
  }, []);
  
  // Load session ID and answers
  useEffect(() => {
    const storedSessionId = sessionStorage.getItem(SESSION_ID_KEY);
    if (storedSessionId) {
      setSessionId(storedSessionId);
      console.log('[Insights] Loaded session ID from storage:', storedSessionId);
    }
    
    const answersStr = sessionStorage.getItem(SESSION_ANSWERS_KEY);
    if (answersStr) {
      try {
        const parsedAnswers = JSON.parse(answersStr);
        setSessionAnswers(parsedAnswers);
        console.log('[Insights] Loaded session answers from storage');
      } catch (e) {
        console.error("Could not parse assessment answers:", e);
      }
    }
  }, []);
  
  // This useEffect is crucial for handling the assessment result
  useEffect(() => {
    console.log("[Insights] Checking for archetype data sources");
    
    // Check sources for archetype in this priority order:
    // 1. Location state (direct navigation from Results)
    // 2. Session storage (user has taken assessment this session)
    // 3. Local storage (persisted preference)
    
    let newArchetype: ArchetypeId | null = null;
    let assessmentResults = null;
    
    if (location.state?.selectedArchetype) {
      console.log("[Insights] Setting archetype from location state:", location.state.selectedArchetype);
      console.log("[Insights] Location state exact employee count:", location.state.exactEmployeeCount);
      // Source 1: Direct navigation from Results
      newArchetype = location.state.selectedArchetype;
      
      // Store in localStorage to persist across refreshes
      localStorage.setItem(INSIGHTS_STORAGE_KEY, newArchetype);
      
      // Save the exact employee count to session storage if available
      if (location.state.exactEmployeeCount !== undefined) {
        const count = location.state.exactEmployeeCount;
        console.log("[Insights] Saving exact employee count to session storage:", count);
        sessionStorage.setItem(SESSION_EXACT_EMPLOYEE_COUNT_KEY, count !== null ? count.toString() : '');
      }
      
      // Set session ID if available in location state
      if (location.state.sessionId) {
        sessionStorage.setItem(SESSION_ID_KEY, location.state.sessionId);
        setSessionId(location.state.sessionId);
      }
      
      // Store assessment answers if available in location state
      if (location.state.assessmentAnswers) {
        sessionStorage.setItem(SESSION_ANSWERS_KEY, JSON.stringify(location.state.assessmentAnswers));
        setSessionAnswers(location.state.assessmentAnswers);
      }
      
      // Create a temporary assessment result object if not present
      if (!sessionResults && location.state.exactEmployeeCount !== undefined) {
        const tempResult: AssessmentResult = {
          primaryArchetype: newArchetype,
          secondaryArchetype: null,
          tertiaryArchetype: null,
          score: 1.0,
          percentageMatch: 80,
          resultTier: 'Comprehensive',
          exactData: {
            employeeCount: location.state.exactEmployeeCount
          }
        };
        
        console.log("[Insights] Created temporary result from location state:", tempResult);
        sessionStorage.setItem(SESSION_RESULTS_KEY, JSON.stringify(tempResult));
        setSessionResults(tempResult);
      }
      
      // Clear the location state to avoid persisting the selection on refresh
      window.history.replaceState({}, document.title);
    } else {
      // Source 2: Check sessionStorage for results from current session
      const sessionResultsStr = sessionStorage.getItem(SESSION_RESULTS_KEY);
      if (sessionResultsStr) {
        console.log("[Insights] Found session results in storage");
        try {
          assessmentResults = JSON.parse(sessionResultsStr);
          
          // Ensure exactData exists in the parsed result
          if (!assessmentResults.exactData) {
            const storedEmployeeCount = sessionStorage.getItem(SESSION_EXACT_EMPLOYEE_COUNT_KEY);
            assessmentResults.exactData = {
              employeeCount: storedEmployeeCount ? Number(storedEmployeeCount) : null
            };
          }
          
          console.log("[Insights] Parsed assessment results:", {
            primaryArchetype: assessmentResults.primaryArchetype,
            resultTier: assessmentResults.resultTier,
            hasExactData: !!assessmentResults.exactData,
            exactEmployeeCount: assessmentResults.exactData?.employeeCount,
            fullData: JSON.stringify(assessmentResults)
          });
          setSessionResults(assessmentResults);
          newArchetype = assessmentResults.primaryArchetype;
          console.log("[Insights] Using archetype from session storage:", newArchetype);
        } catch (error) {
          console.error('Error parsing session results:', error);
          toast.error("Couldn't load your assessment results. Please try again.");
        }
      } else {
        // Source 3: Try to retrieve from localStorage if no state is present
        const storedArchetype = localStorage.getItem(INSIGHTS_STORAGE_KEY);
        if (storedArchetype) {
          console.log("[Insights] Using archetype from local storage:", storedArchetype);
          newArchetype = storedArchetype as ArchetypeId;
          
          // Check if we need to create assessment results from stored employee count
          const storedEmployeeCount = sessionStorage.getItem(SESSION_EXACT_EMPLOYEE_COUNT_KEY);
          if (storedEmployeeCount) {
            assessmentResults = {
              primaryArchetype: newArchetype,
              secondaryArchetype: null,
              tertiaryArchetype: null,
              score: 1.0,
              percentageMatch: 80,
              resultTier: 'Basic',
              exactData: {
                employeeCount: Number(storedEmployeeCount)
              }
            };
            console.log("[Insights] Created assessment results from stored employee count:", assessmentResults);
            setSessionResults(assessmentResults);
            sessionStorage.setItem(SESSION_RESULTS_KEY, JSON.stringify(assessmentResults));
          }
        } else {
          console.log("[Insights] No archetype found in any storage");
        }
      }
    }
    
    // Only update selectedArchetype if we found one
    if (newArchetype) {
      setSelectedArchetype(newArchetype);
      
      // Pre-fetch the archetype data to fill the cache
      queryClient.prefetchQuery({
        queryKey: ['archetype', newArchetype],
        staleTime: 5 * 60 * 1000 // 5 minutes
      });
    }
  }, [location, queryClient, sessionResults]); 

  // Add scroll event listener to show feedback menu when scrolling
  // with throttling to avoid too many events
  useEffect(() => {
    let scrollTimeout: number | null = null;
    
    const handleScroll = () => {
      if (scrollTimeout !== null) {
        return;
      }
      
      scrollTimeout = window.setTimeout(() => {
        if (!hasFeedbackBeenClosed && window.scrollY > 100 && !isFormVisible) {
          setShowFeedback(true);
        }
        scrollTimeout = null;
      }, 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout !== null) {
        window.clearTimeout(scrollTimeout);
      }
    };
  }, [hasFeedbackBeenClosed, isFormVisible]);

  // Handle retaking the assessment
  const handleRetakeAssessment = () => {
    // Navigate to assessment without clearing localStorage or sessionStorage
    // This allows the user to come back to insights with their previous results
    navigate('/assessment');
  };

  // Handle closing the feedback menu with error handling
  const handleCloseFeedback = () => {
    try {
      setShowFeedback(false);
      setHasFeedbackBeenClosed(true);
    } catch (error) {
      console.error('Error closing feedback menu:', error);
      toast.error('There was an issue closing the feedback menu');
    }
  };

  // Debug
  console.log("[Insights] Selected archetype:", selectedArchetype);
  console.log("[Insights] Session results full data:", sessionResults);
  console.log("[Insights] Session answers:", sessionAnswers);
  console.log("[Insights] Exact employee count:", sessionResults?.exactData?.employeeCount);

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

      {/* Feedback menu in bottom right corner - only show if archetype is selected and user has scrolled */}
      {selectedArchetype && showFeedback && !isFormVisible && (
        <div className="fixed bottom-6 right-6 z-10 animate-slide-in-from-bottom">
          <MatchFeedbackMenu 
            archetypeId={selectedArchetype} 
            onClose={handleCloseFeedback}
            sessionId={sessionId}
            assessmentResult={sessionResults}
            assessmentAnswers={sessionAnswers}
          />
        </div>
      )}
    </div>
  );
};

export default Insights;
