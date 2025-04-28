import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useArchetypes } from '@/hooks/useArchetypes';
import { ArchetypeId } from '@/types/archetype';
import { AssessmentResult } from '@/types/assessment';
import MatchFeedbackMenu from '@/components/insights/MatchFeedbackMenu';
import NoAssessmentResults from '@/components/insights/NoAssessmentResults';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useGetArchetype } from '@/hooks/useGetArchetype';
import InsightsContainer from '@/components/insights/InsightsContainer';

// Storage keys
const INSIGHTS_STORAGE_KEY = 'healthcareArchetypeInsights';
const SESSION_RESULTS_KEY = 'healthcareArchetypeSessionResults';
const SESSION_ID_KEY = 'healthcareArchetypeSessionId';
const SESSION_ANSWERS_KEY = 'healthcareArchetypeAnswers';

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
  
  // Use consistent hook calls - important for React's hook rules
  const { getArchetypeDetailedById, getFamilyById } = useArchetypes();

  // Check if the user is interacting with a form
  const handleFormVisibilityChange = (isVisible: boolean) => {
    setIsFormVisible(isVisible);
  };
  
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
    }
    
    const answersStr = sessionStorage.getItem(SESSION_ANSWERS_KEY);
    if (answersStr) {
      try {
        setSessionAnswers(JSON.parse(answersStr));
      } catch (e) {
        console.error("Could not parse assessment answers:", e);
      }
    }
  }, []);
  
  // This useEffect is crucial for handling the assessment result
  useEffect(() => {
    console.log("Insights page: Checking for archetype data sources");
    
    // Check sources for archetype in this priority order:
    // 1. Location state (direct navigation from Results)
    // 2. Session storage (user has taken assessment this session)
    // 3. Local storage (persisted preference)
    
    let newArchetype: ArchetypeId | null = null;
    let assessmentResults = null;
    
    if (location.state?.selectedArchetype) {
      console.log("Setting archetype from location state:", location.state.selectedArchetype);
      // Source 1: Direct navigation from Results
      newArchetype = location.state.selectedArchetype;
      
      // Store in localStorage to persist across refreshes
      localStorage.setItem(INSIGHTS_STORAGE_KEY, newArchetype);
      
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
      
      // Clear the location state to avoid persisting the selection on refresh
      window.history.replaceState({}, document.title);
    } else {
      // Source 2: Check sessionStorage for results from current session
      const sessionResultsStr = sessionStorage.getItem(SESSION_RESULTS_KEY);
      if (sessionResultsStr) {
        console.log("Found session results in storage");
        try {
          assessmentResults = JSON.parse(sessionResultsStr);
          setSessionResults(assessmentResults);
          newArchetype = assessmentResults.primaryArchetype;
          console.log("Using archetype from session storage:", newArchetype);
        } catch (error) {
          console.error('Error parsing session results:', error);
          toast.error("Couldn't load your assessment results. Please try again.");
        }
      } else {
        // Source 3: Try to retrieve from localStorage if no state is present
        const storedArchetype = localStorage.getItem(INSIGHTS_STORAGE_KEY);
        if (storedArchetype) {
          console.log("Using archetype from local storage:", storedArchetype);
          newArchetype = storedArchetype as ArchetypeId;
        } else {
          console.log("No archetype found in any storage");
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
  }, [location, queryClient]); 

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

  // Use useGetArchetype hook to fetch the latest archetype data from the DB
  const { archetypeData: fetchedArchetypeData, isLoading: isLoadingArchetype } = 
    useGetArchetype(selectedArchetype as ArchetypeId);

  // Get the archetype data from local cache if DB fetch is still loading
  const localArchetypeData = selectedArchetype ? getArchetypeDetailedById(selectedArchetype) : null;
  
  // Use fetched data if available, otherwise fall back to local data
  const archetypeData = fetchedArchetypeData || localArchetypeData;
  const familyData = archetypeData?.familyId ? getFamilyById(archetypeData.familyId) : null;

  // Debug
  console.log("Selected archetype:", selectedArchetype);
  console.log("Archetype data:", archetypeData);
  console.log("Field values:", archetypeData ? {
    "Demo_Average Family Size": archetypeData["Demo_Average Family Size"],
    "Demo_Average Age": archetypeData["Demo_Average Age"],
    "Util_Emergency Visits per 1k Members": archetypeData["Util_Emergency Visits per 1k Members"]
  } : 'No data');
  console.log("Session results:", sessionResults);
  console.log("Session answers:", sessionAnswers);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-12 pb-24 relative">
      <div className="max-w-5xl mx-auto">
        {/* Show assessment results if an archetype is selected */}
        {selectedArchetype && archetypeData ? (
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
      {selectedArchetype && archetypeData && showFeedback && !isFormVisible && (
        <div className="fixed bottom-6 right-6 z-10 animate-slide-in-from-bottom">
          <MatchFeedbackMenu 
            archetypeId={selectedArchetype} 
            onClose={handleCloseFeedback}
            sessionId={sessionId}
            assessmentResult={sessionResults}
          />
        </div>
      )}
    </div>
  );
};

export default Insights;
