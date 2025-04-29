
import { useCallback } from 'react';
import { AssessmentQuestion } from '@/types/assessment';

export const useQuestionValidation = (
  questions: AssessmentQuestion[], 
  answers: Record<string, string>,
  currentQuestion: number
) => {
  // Determine if the current question is valid for navigation
  const isCurrentQuestionValid = useCallback(() => {
    if (!questions.length || currentQuestion < 1 || currentQuestion > questions.length) {
      return false;
    }
    
    const currentQ = questions[currentQuestion - 1];
    
    // For multi-select questions, allow proceeding as long as at least one option is selected
    // or allow skipping (since it's just informational)
    if (currentQ.type === 'multi-select') {
      // For the priorities question, make it optional
      if (currentQ.id === 'priorities') return true;
      
      const selectedValues = answers[currentQ.id] ? answers[currentQ.id].split(',') : [];
      return selectedValues.length > 0;
    }
    
    // For single-select questions, require an answer
    return !!answers[currentQ.id];
  }, [answers, currentQuestion, questions]);
  
  return { isCurrentQuestionValid };
};
