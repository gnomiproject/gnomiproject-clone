
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface QuestionNavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  isQuestionValid: boolean;
  onPrevious: () => void;
  onNext: () => void;
  isTransitioning?: boolean; // Added prop to handle transition state
}

const QuestionNavigation = ({
  currentQuestion,
  totalQuestions,
  isQuestionValid,
  onPrevious,
  onNext,
  isTransitioning = false
}: QuestionNavigationProps) => {
  const isFirstQuestion = currentQuestion === 1;
  const isLastQuestion = currentQuestion === totalQuestions;
  
  return (
    <div className="flex justify-between mt-8">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstQuestion || isTransitioning}
        className="flex items-center gap-1"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </Button>
      
      <Button
        onClick={onNext}
        disabled={!isQuestionValid || isTransitioning}
        className="flex items-center gap-1"
      >
        {isLastQuestion ? 'Submit' : 'Next'}
        {!isLastQuestion && <ChevronRight className="w-4 h-4" />}
      </Button>
    </div>
  );
};

export default QuestionNavigation;
