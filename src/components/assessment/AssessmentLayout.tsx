
import React, { useState, useEffect } from 'react';
import { AssessmentQuestion } from '@/types/assessment';
import QuestionContent from './QuestionContent';
import QuestionNavigation from './QuestionNavigation';
import QuestionTransition from './QuestionTransition';

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
  const [animationDirection, setAnimationDirection] = useState<'forward' | 'backward' | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Handle next button click with proper animation timing
  const handleNext = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setAnimationDirection('forward');
    
    // Wait for animation to start before navigating
    setTimeout(() => {
      goToNext();
      
      // Reset transition state after navigation completes
      setTimeout(() => {
        setIsTransitioning(false);
      }, 600);
    }, 100);
  };
  
  // Handle previous button click with proper animation timing
  const handlePrevious = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setAnimationDirection('backward');
    
    // Wait for animation to start before navigating
    setTimeout(() => {
      goToPrevious();
      
      // Reset transition state after navigation completes
      setTimeout(() => {
        setIsTransitioning(false);
      }, 600);
    }, 100);
  };
  
  // Reset animation direction after animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationDirection(null);
    }, 800);
    return () => clearTimeout(timer);
  }, [currentQuestion]);
  
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-5 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-semibold text-left mb-6 sm:mb-8">gNomi Archetype Assessment</h1>
      
      {questions.length > 0 && (
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-left mb-3 sm:mb-4">Question {currentQuestion} of {totalQuestions}</h2>
          
          <div className="min-h-[300px] overflow-hidden">
            <QuestionTransition 
              questionKey={currentQuestion}
              animationDirection={animationDirection}
            >
              <p className="mb-5 sm:mb-6 text-left">{currentQ.text}</p>
              
              <QuestionContent 
                question={currentQ} 
                answers={answers}
                setAnswer={setAnswer}
                setMultipleAnswers={setMultipleAnswers}
              />
            </QuestionTransition>
          </div>
          
          <QuestionNavigation 
            currentQuestion={currentQuestion}
            totalQuestions={totalQuestions}
            isQuestionValid={isCurrentQuestionValid}
            onPrevious={handlePrevious}
            onNext={handleNext}
            isTransitioning={isTransitioning}
          />
        </div>
      )}
    </div>
  );
};

export default AssessmentLayout;
