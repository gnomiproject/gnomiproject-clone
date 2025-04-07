
import React from 'react';
import { Button } from "@/components/ui/button";
import { AssessmentQuestion } from '@/types/assessment';

interface QuestionNavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  isQuestionValid: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

const QuestionNavigation = ({
  currentQuestion,
  totalQuestions,
  isQuestionValid,
  onPrevious,
  onNext
}: QuestionNavigationProps) => {
  return (
    <div className="flex justify-between mt-6 sm:mt-8">
      <Button
        onClick={onPrevious}
        disabled={currentQuestion === 1}
        variant="outline"
        className="font-semibold py-2 px-3 sm:px-4"
      >
        Previous
      </Button>
      <Button
        onClick={onNext}
        disabled={!isQuestionValid}
        className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-3 sm:px-4"
      >
        {currentQuestion === totalQuestions ? 'Submit' : 'Next'}
      </Button>
    </div>
  );
};

export default QuestionNavigation;
