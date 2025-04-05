
import React from 'react';
import { useAssessment } from '../hooks/useAssessment';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import CalculationLoader from '../components/assessment/CalculationLoader';

const Assessment = () => {
  const { 
    currentQuestion, 
    totalQuestions, 
    questions, 
    answers, 
    isCalculating,
    setAnswer, 
    goToNext, 
    goToPrevious 
  } = useAssessment();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-semibold text-center mb-8">Assessment</h1>
        
        {questions.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Question {currentQuestion} of {totalQuestions}</h2>
            <p className="mb-4">{questions[currentQuestion - 1].text}</p>
            
            <div className="space-y-4">
              {questions[currentQuestion - 1].options.map(option => (
                <label key={option.id} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={option.id}
                    checked={answers[questions[currentQuestion - 1].id] === option.id}
                    onChange={() => setAnswer(questions[currentQuestion - 1].id, option.id)}
                    className="form-radio h-5 w-5 text-blue-600"
                  />
                  <span>{option.text}</span>
                </label>
              ))}
            </div>
            
            <div className="flex justify-between mt-8">
              <button
                onClick={goToPrevious}
                disabled={currentQuestion === 1}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={goToNext}
                className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
              >
                {currentQuestion === totalQuestions ? 'Submit' : 'Next'}
              </button>
            </div>
          </div>
        )}
      </div>
      <CalculationLoader isVisible={isCalculating} />
    </div>
  );
};

export default Assessment;
