
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateArchetypeMatch, getAssessmentQuestions } from '../utils/assessmentUtils';
import { AssessmentResult } from '../types/assessment';
import { ArchetypeId } from '../types/archetype';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

// Storage keys for assessment data
const INSIGHTS_STORAGE_KEY = 'healthcareArchetypeInsights';
const SESSION_RESULTS_KEY = 'healthcareArchetypeSessionResults';
const SESSION_ANSWERS_KEY = 'healthcareArchetypeAnswers';
const SESSION_EXACT_EMPLOYEE_COUNT_KEY = 'healthcareArchetypeExactEmployeeCount';
const SESSION_ID_KEY = 'healthcareArchetypeSessionId';

/**
 * Hook to manage the assessment process
 */
export const useAssessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [exactEmployeeCount, setExactEmployeeCount] = useState<number | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const navigate = useNavigate();

  const questions = getAssessmentQuestions();
  const totalQuestions = questions.length;

  // Initialize or retrieve session ID
  useEffect(() => {
    let storedSessionId = sessionStorage.getItem(SESSION_ID_KEY);
    if (!storedSessionId) {
      storedSessionId = uuidv4();
      sessionStorage.setItem(SESSION_ID_KEY, storedSessionId);
      localStorage.setItem('session_id', storedSessionId); // Also store in localStorage for persistence
    }
    setSessionId(storedSessionId);
  }, []);

  // Load answers and exact employee count from sessionStorage if available
  useEffect(() => {
    const storedAnswers = sessionStorage.getItem(SESSION_ANSWERS_KEY);
    if (storedAnswers) {
      try {
        const parsedAnswers = JSON.parse(storedAnswers);
        setAnswers(parsedAnswers);
      } catch (error) {
        console.error('Error parsing stored answers:', error);
      }
    }

    const storedEmployeeCount = sessionStorage.getItem(SESSION_EXACT_EMPLOYEE_COUNT_KEY);
    if (storedEmployeeCount) {
      try {
        const count = Number(storedEmployeeCount);
        console.log('[useAssessment] Loaded exact employee count from session storage:', count);
        setExactEmployeeCount(count);
      } catch (error) {
        console.error('Error parsing stored employee count:', error);
      }
    }
  }, []);

  /**
   * Set answer for a specific question
   * @param questionId The question ID to set the answer for
   * @param answerId The selected answer ID
   */
  const setAnswer = (questionId: string, answerId: string) => {
    const updatedAnswers = { ...answers, [questionId]: answerId };
    setAnswers(updatedAnswers);
    // Save answers to sessionStorage
    sessionStorage.setItem(SESSION_ANSWERS_KEY, JSON.stringify(updatedAnswers));
  };

  /**
   * Set multiple answers for a multi-select question
   * @param questionId The question ID to set the answers for
   * @param answerIds Array of selected answer IDs
   */
  const setMultipleAnswers = (questionId: string, answerIds: string[]) => {
    const updatedAnswers = { ...answers, [questionId]: answerIds.join(',') };
    setAnswers(updatedAnswers);
    // Save answers to sessionStorage
    sessionStorage.setItem(SESSION_ANSWERS_KEY, JSON.stringify(updatedAnswers));
  };

  /**
   * Set the exact employee count and store it in sessionStorage
   * @param count The exact employee count
   */
  const setEmployeeCount = (count: number | null) => {
    console.log('[useAssessment] Setting exact employee count:', count);
    setExactEmployeeCount(count);
    if (count !== null) {
      sessionStorage.setItem(SESSION_EXACT_EMPLOYEE_COUNT_KEY, count.toString());
    } else {
      sessionStorage.removeItem(SESSION_EXACT_EMPLOYEE_COUNT_KEY);
    }
  };

  /**
   * Move to the next question
   */
  const goToNext = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Show calculating state and delay results
      calculateResults();
    }
  };

  /**
   * Move to the previous question
   */
  const goToPrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  /**
   * Calculate and set the assessment results
   */
  const calculateResults = () => {
    setIsCalculating(true);
    
    // Simulate calculation time
    setTimeout(() => {
      try {
        // Calculate the result based on answers
        const assessmentResult = calculateArchetypeMatch(answers);
        
        // Ensure exactData is always included
        const resultWithEmployeeCount: AssessmentResult = {
          ...assessmentResult,
          exactData: {
            employeeCount: exactEmployeeCount
          }
        };
        
        setResult(resultWithEmployeeCount);
        
        // Save results to localStorage for persistence
        localStorage.setItem(INSIGHTS_STORAGE_KEY, resultWithEmployeeCount.primaryArchetype);
        
        // Save results to sessionStorage to persist during the session
        console.log("[useAssessment] Saving assessment result with exact employee count:", {
          primaryArchetype: resultWithEmployeeCount.primaryArchetype,
          exactEmployeeCount: exactEmployeeCount,
          hasExactData: true,
          fullResult: JSON.stringify(resultWithEmployeeCount)
        });
        
        sessionStorage.setItem(SESSION_RESULTS_KEY, JSON.stringify(resultWithEmployeeCount));
        
        console.log("[useAssessment] Assessment completed. Results:", resultWithEmployeeCount);
        console.log("[useAssessment] Exact employee count:", exactEmployeeCount);
        console.log("[useAssessment] Navigating to insights page with sessionId:", sessionId);
        
        // Navigate to the insights page with the results state
        navigate(`/insights`, { 
          state: { 
            selectedArchetype: resultWithEmployeeCount.primaryArchetype,
            sessionId,
            assessmentAnswers: answers,
            exactEmployeeCount
          } 
        });
      } catch (error) {
        console.error("Error calculating results:", error);
        toast.error("There was an error calculating your results. Please try again.");
        setIsCalculating(false);
      }
    }, 3000);
  };

  /**
   * Reset assessment to start over
   */
  const resetAssessment = () => {
    setCurrentQuestion(1);
    setAnswers({});
    setResult(null);
    setExactEmployeeCount(null);
    
    // Clear stored session data when assessment is reset but keep the session ID
    sessionStorage.removeItem(SESSION_RESULTS_KEY);
    sessionStorage.removeItem(SESSION_ANSWERS_KEY);
    sessionStorage.removeItem(SESSION_EXACT_EMPLOYEE_COUNT_KEY);
  };

  return {
    currentQuestion,
    totalQuestions,
    questions,
    answers,
    result,
    isCalculating,
    exactEmployeeCount,
    sessionId,
    setAnswer,
    setMultipleAnswers,
    setExactEmployeeCount: setEmployeeCount,
    goToNext,
    goToPrevious,
    calculateResults,
    resetAssessment
  };
};
