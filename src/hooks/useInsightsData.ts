
import { useState, useEffect, useRef } from 'react';
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
  // Using non-null assertion for initial state to avoid unnecessary conditionals
  const [selectedArchetype, setSelectedArchetype] = useState<ArchetypeId | null>(null);
  const [sessionResults, setSessionResults] = useState<AssessmentResult | null>(null);
  const [sessionAnswers, setSessionAnswers] = useState<any | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const location = useLocation();
  const queryClient = useQueryClient();
  
  // Use refs to track if we've already processed data to prevent re-processing
  const processedRef = useRef(false);
  const locationProcessedRef = useRef(false);
  
  // Track last selected archetype to prevent duplicate work
  const lastArchetypeRef = useRef<ArchetypeId | null>(null);

  // Add debug logging to track hook execution
  console.log('[useInsightsData] Hook initializing');

  // Load session ID and answers once
  useEffect(() => {
    // Skip if we've already processed this data
    if (processedRef.current) return;
    
    try {
      const storedSessionId = sessionStorage.getItem(SESSION_ID_KEY);
      if (storedSessionId) {
        setSessionId(storedSessionId);
        console.log('[useInsightsData] Loaded session ID from storage:', storedSessionId);
      }
      
      const answersStr = sessionStorage.getItem(SESSION_ANSWERS_KEY);
      if (answersStr) {
        const parsedAnswers = JSON.parse(answersStr);
        setSessionAnswers(parsedAnswers);
        console.log('[useInsightsData] Loaded session answers from storage');
      }
      
      processedRef.current = true;
    } catch (error) {
      console.error('[useInsightsData] Error loading session data:', error);
    }
  }, []); // No dependencies - only run once
  
  // Handle archetypes from different sources
  useEffect(() => {
    console.log("[useInsightsData] Checking for archetype data sources");
    
    try {
      // Avoid processing the same location state multiple times
      if (location.state?.selectedArchetype && !locationProcessedRef.current) {
        locationProcessedRef.current = true;
        
        console.log("[useInsightsData] Setting archetype from location state:", location.state.selectedArchetype);
        // Source 1: Direct navigation from Results
        const newArchetype = location.state.selectedArchetype;
        
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
        
        // Update selected archetype if it changed
        if (newArchetype !== lastArchetypeRef.current) {
          lastArchetypeRef.current = newArchetype;
          setSelectedArchetype(newArchetype);
          
          // Pre-fetch the archetype data to fill the cache
          queryClient.prefetchQuery({
            queryKey: ['archetype', newArchetype],
            staleTime: 5 * 60 * 1000 // 5 minutes
          });
        }
        
        // Clear the location state to avoid persisting the selection on refresh
        window.history.replaceState({}, document.title);
        return; // Exit early since we processed location state
      }
      
      // Only proceed with storage checks if we don't already have an archetype
      if (lastArchetypeRef.current) return;
      
      // Source 2: Check sessionStorage for results from current session
      const sessionResultsStr = sessionStorage.getItem(SESSION_RESULTS_KEY);
      if (sessionResultsStr) {
        console.log("[useInsightsData] Found session results in storage");
        
        const assessmentResults = JSON.parse(sessionResultsStr);
        
        // Ensure exactData exists in the parsed result
        if (!assessmentResults.exactData) {
          const storedEmployeeCount = sessionStorage.getItem(SESSION_EXACT_EMPLOYEE_COUNT_KEY);
          assessmentResults.exactData = {
            employeeCount: storedEmployeeCount ? Number(storedEmployeeCount) : null
          };
        }
        
        setSessionResults(assessmentResults);
        const newArchetype = assessmentResults.primaryArchetype;
        console.log("[useInsightsData] Using archetype from session storage:", newArchetype);
        
        if (newArchetype !== lastArchetypeRef.current) {
          lastArchetypeRef.current = newArchetype;
          setSelectedArchetype(newArchetype);
          
          // Pre-fetch data
          queryClient.prefetchQuery({
            queryKey: ['archetype', newArchetype],
            staleTime: 5 * 60 * 1000 // 5 minutes
          });
        }
        return; // Exit early since we have an archetype
      } 
      
      // Source 3: Try to retrieve from localStorage if no state is present
      const storedArchetype = localStorage.getItem(INSIGHTS_STORAGE_KEY);
      if (storedArchetype) {
        console.log("[useInsightsData] Using archetype from local storage:", storedArchetype);
        const newArchetype = storedArchetype as ArchetypeId;
        
        // Check if we need to create assessment results from stored employee count
        const storedEmployeeCount = sessionStorage.getItem(SESSION_EXACT_EMPLOYEE_COUNT_KEY);
        if (storedEmployeeCount) {
          const assessmentResults = {
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
        
        if (newArchetype !== lastArchetypeRef.current) {
          lastArchetypeRef.current = newArchetype;
          setSelectedArchetype(newArchetype);
          
          // Pre-fetch data
          queryClient.prefetchQuery({
            queryKey: ['archetype', newArchetype],
            staleTime: 5 * 60 * 1000 // 5 minutes
          });
        }
      } else {
        console.log("[useInsightsData] No archetype found in any storage");
      }
    } catch (error) {
      console.error('[useInsightsData] Error processing archetype data:', error);
    }
  }, [location, queryClient]); // Remove sessionResults from the dependency array

  return {
    selectedArchetype,
    sessionResults,
    sessionAnswers,
    sessionId
  };
};
