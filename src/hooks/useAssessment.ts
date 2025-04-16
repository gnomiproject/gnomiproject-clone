import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateArchetypeMatch, getAssessmentQuestions } from '../utils/assessmentUtils';
import { AssessmentResult } from '../types/assessment';
import { ArchetypeId } from '../types/archetype';

// Storage keys for assessment data
const INSIGHTS_STORAGE_KEY = 'healthcareArchetypeInsights';
const SESSION_RESULTS_KEY = 'healthcareArchetypeSessionResults';
const SESSION_ANSWERS_KEY = 'healthcareArchetypeAnswers';
const SESSION_EXACT_EMPLOYEE_COUNT_KEY = 'healthcareArchetypeExactEmployeeCount';

/**
 * Hook to manage the assessment process
 */
export const useAssessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [exactEmployeeCount, setExactEmployeeCount] = useState<number | null>(null);
  const navigate = useNavigate();

  const questions = getAssessmentQuestions();
  const totalQuestions = questions.length;

  // Load answers and exact employee count from sessionStorage if available
  useEffect(() => {
    const storedAnswers = sessionStorage.getItem(SESSION_ANSWERS_KEY);
    if (storedAnswers) {
      try {
        const parsedAnswers = JSON.parse(storedAnswers);
        console.log('Loaded stored answers:', parsedAnswers);
        setAnswers(parsedAnswers);
      } catch (error) {
        console.error('Error parsing stored answers:', error);
      }
    }

    const storedEmployeeCount = sessionStorage.getItem(SESSION_EXACT_EMPLOYEE_COUNT_KEY);
    if (storedEmployeeCount) {
      try {
        setExactEmployeeCount(Number(storedEmployeeCount));
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
    
    // Simulate calculation time - 7 seconds
    setTimeout(() => {
      const assessmentResult = calculateArchetypeMatch(answers);
      setResult(assessmentResult);
      
      // Clear previous archetype insights when a new assessment is completed
      localStorage.removeItem(INSIGHTS_STORAGE_KEY);
      
      // Save results to sessionStorage to persist during the session
      sessionStorage.setItem(SESSION_RESULTS_KEY, JSON.stringify(assessmentResult));
      
      // Save exact employee count with results
      if (exactEmployeeCount !== null) {
        const resultWithEmployeeCount = {
          ...assessmentResult,
          exactData: {
            employeeCount: exactEmployeeCount
          }
        };
        sessionStorage.setItem(SESSION_RESULTS_KEY, JSON.stringify(resultWithEmployeeCount));
      }
      
      // Navigate to results page with the results
      navigate('/results', { state: { result: assessmentResult, exactEmployeeCount } });
      setIsCalculating(false);
    }, 7000);
  };

  /**
   * Reset assessment to start over
   */
  const resetAssessment = () => {
    setCurrentQuestion(1);
    setAnswers({});
    setResult(null);
    setExactEmployeeCount(null);
    
    // Clear stored insights when assessment is reset
    localStorage.removeItem(INSIGHTS_STORAGE_KEY);
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
    setAnswer,
    setMultipleAnswers,
    setExactEmployeeCount: setEmployeeCount,
    goToNext,
    goToPrevious,
    calculateResults,
    resetAssessment
  };
};
