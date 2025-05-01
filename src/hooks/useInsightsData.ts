
import { useState, useEffect } from 'react';
import { ArchetypeId } from '@/types/archetype';
import { AssessmentResult } from '@/types/assessment';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';

// Storage keys
export const INSIGHTS_STORAGE_KEY = 'healthcareArchetypeInsights';
export const SESSION_RESULTS_KEY = 'healthcareArchetypeSessionResults';
export const SESSION_ID_KEY = 'healthcareArchetypeSessionId';
export const SESSION_ANSWERS_KEY = 'healthcareArchetypeAnswers';
export const SESSION_EXACT_EMPLOYEE_COUNT_KEY = 'healthcareArchetypeExactEmployeeCount';

export const useInsightsData = () => {
  const [selectedArchetype, setSelectedArchetype] = useState<ArchetypeId | null>(null);
  const [sessionResults, setSessionResults] = useState<AssessmentResult | null>(null);
  const [sessionAnswers, setSessionAnswers] = useState<any | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const location = useLocation();
  const queryClient = useQueryClient();

  // Load session ID and answers once
  useEffect(() => {
    const storedSessionId = sessionStorage.getItem(SESSION_ID_KEY);
    if (storedSessionId) {
      setSessionId(storedSessionId);
      console.log('[useInsightsData] Loaded session ID from storage:', storedSessionId);
    }
    
    const answersStr = sessionStorage.getItem(SESSION_ANSWERS_KEY);
    if (answersStr) {
      try {
        const parsedAnswers = JSON.parse(answersStr);
        setSessionAnswers(parsedAnswers);
        console.log('[useInsightsData] Loaded session answers from storage');
      } catch (e) {
        console.error("Could not parse assessment answers:", e);
      }
    }
  }, []);
  
  // Handle archetypes from different sources
  useEffect(() => {
    console.log("[useInsightsData] Checking for archetype data sources");
    
    let newArchetype: ArchetypeId | null = null;
    let assessmentResults = null;
    
    if (location.state?.selectedArchetype) {
      console.log("[useInsightsData] Setting archetype from location state:", location.state.selectedArchetype);
      // Source 1: Direct navigation from Results
      newArchetype = location.state.selectedArchetype;
      
      // Store in localStorage to persist across refreshes
      localStorage.setItem(INSIGHTS_STORAGE_KEY, newArchetype);
      
      // Save the exact employee count to session storage if available
      if (location.state.exactEmployeeCount !== undefined) {
        const count = location.state.exactEmployeeCount;
        console.log("[useInsightsData] Saving exact employee count to session storage:", count);
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
        
        console.log("[useInsightsData] Created temporary result from location state");
        sessionStorage.setItem(SESSION_RESULTS_KEY, JSON.stringify(tempResult));
        setSessionResults(tempResult);
      }
      
      // Clear the location state to avoid persisting the selection on refresh
      window.history.replaceState({}, document.title);
    } else {
      // Source 2: Check sessionStorage for results from current session
      const sessionResultsStr = sessionStorage.getItem(SESSION_RESULTS_KEY);
      if (sessionResultsStr) {
        console.log("[useInsightsData] Found session results in storage");
        try {
          assessmentResults = JSON.parse(sessionResultsStr);
          
          // Ensure exactData exists in the parsed result
          if (!assessmentResults.exactData) {
            const storedEmployeeCount = sessionStorage.getItem(SESSION_EXACT_EMPLOYEE_COUNT_KEY);
            assessmentResults.exactData = {
              employeeCount: storedEmployeeCount ? Number(storedEmployeeCount) : null
            };
          }
          
          setSessionResults(assessmentResults);
          newArchetype = assessmentResults.primaryArchetype;
          console.log("[useInsightsData] Using archetype from session storage:", newArchetype);
        } catch (error) {
          console.error('Error parsing session results:', error);
          toast.error("Couldn't load your assessment results. Please try again.");
        }
      } else {
        // Source 3: Try to retrieve from localStorage if no state is present
        const storedArchetype = localStorage.getItem(INSIGHTS_STORAGE_KEY);
        if (storedArchetype) {
          console.log("[useInsightsData] Using archetype from local storage:", storedArchetype);
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
            console.log("[useInsightsData] Created assessment results from stored employee count");
            setSessionResults(assessmentResults);
            sessionStorage.setItem(SESSION_RESULTS_KEY, JSON.stringify(assessmentResults));
          }
        } else {
          console.log("[useInsightsData] No archetype found in any storage");
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

  return {
    selectedArchetype,
    sessionResults,
    sessionAnswers,
    sessionId
  };
};
