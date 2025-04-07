
import React from 'react';
import { AssessmentQuestion } from '@/types/assessment';
import QuestionContent from './QuestionContent';
import QuestionNavigation from './QuestionNavigation';

interface AssessmentLayoutProps {
  currentQuestion: number;
  totalQuestions: number;
  questions: AssessmentQuestion[];
  answers: Record<string, string>;
  setAnswer: (questionId: string, value: string) => void;
  setMultipleAnswers: (questionId: string, values: string[]) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  isCurrentQuestionValid: boolean;
}

const AssessmentLayout = ({
  currentQuestion,
  totalQuestions,
  questions,
  answers,
  setAnswer,
  setMultipleAnswers,
  goToNext,
  goToPrevious,
  isCurrentQuestionValid
}: AssessmentLayoutProps) => {
  
  const currentQ = questions[currentQuestion - 1];
  
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-5 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-semibold text-left mb-6 sm:mb-8">gNomi Archetype Assessment</h1>
      
      {questions.length > 0 && (
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-left mb-3 sm:mb-4">Question {currentQuestion} of {totalQuestions}</h2>
          <p className="mb-5 sm:mb-6 text-left">{currentQ.text}</p>
          
          <QuestionContent 
            question={currentQ} 
            answers={answers}
            setAnswer={setAnswer}
            setMultipleAnswers={setMultipleAnswers}
          />
          
          <QuestionNavigation 
            currentQuestion={currentQuestion}
            totalQuestions={totalQuestions}
            isQuestionValid={isCurrentQuestionValid}
            onPrevious={goToPrevious}
            onNext={goToNext}
          />
        </div>
      )}
    </div>
  );
};

export default AssessmentLayout;
