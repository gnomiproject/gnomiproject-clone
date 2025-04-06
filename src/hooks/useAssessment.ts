
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateArchetypeMatch, getAssessmentQuestions } from '../utils/assessmentUtils';
import { AssessmentResult } from '../types/assessment';
import { ArchetypeId } from '../types/archetype';

// Storage keys for assessment data
const INSIGHTS_STORAGE_KEY = 'healthcareArchetypeInsights';
const SESSION_RESULTS_KEY = 'healthcareArchetypeSessionResults';

/**
 * Hook to manage the assessment process
 */
export const useAssessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const navigate = useNavigate();

  const questions = getAssessmentQuestions();
  const totalQuestions = questions.length;

  /**
   * Set answer for a specific question
   * @param questionId The question ID to set the answer for
   * @param answerId The selected answer ID
   */
  const setAnswer = (questionId: string, answerId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerId }));
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
      
      // Navigate to results page with the results
      navigate('/results', { state: { result: assessmentResult } });
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
    
    // Clear stored insights when assessment is reset
    localStorage.removeItem(INSIGHTS_STORAGE_KEY);
    sessionStorage.removeItem(SESSION_RESULTS_KEY);
  };

  return {
    currentQuestion,
    totalQuestions,
    questions,
    answers,
    result,
    isCalculating,
    setAnswer,
    goToNext,
    goToPrevious,
    calculateResults,
    resetAssessment
  };
};
