
import React from 'react';
import { useAssessment } from '../hooks/useAssessment';
import { useQuestionValidation } from '@/hooks/useQuestionValidation';
import CalculationLoader from '../components/assessment/CalculationLoader';
import AssessmentLayout from '../components/assessment/AssessmentLayout';
import { trackingService } from '@/services/trackingService';

const Assessment = () => {
  const { 
    currentQuestion, 
    totalQuestions, 
    questions, 
    answers, 
    isCalculating,
    exactEmployeeCount,
    setAnswer, 
    setMultipleAnswers,
    setExactEmployeeCount,
    goToNext, 
    goToPrevious 
  } = useAssessment();
  
  const { isCurrentQuestionValid } = useQuestionValidation(questions, answers, currentQuestion);
  
  // Track page view and assessment start on component mount
  React.useEffect(() => {
    trackingService.pageView('assessment');
    trackingService.assessmentStarted();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12 px-4 sm:px-6">
      <AssessmentLayout 
        currentQuestion={currentQuestion}
        totalQuestions={totalQuestions}
        questions={questions}
        answers={answers}
        setAnswer={setAnswer}
        setMultipleAnswers={setMultipleAnswers}
        goToNext={goToNext}
        goToPrevious={goToPrevious}
        isCurrentQuestionValid={isCurrentQuestionValid()}
        exactEmployeeCount={exactEmployeeCount}
        setExactEmployeeCount={setExactEmployeeCount}
      />
      <CalculationLoader isVisible={isCalculating} />
    </div>
  );
};

export default Assessment;
