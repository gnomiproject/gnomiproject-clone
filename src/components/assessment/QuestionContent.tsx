
import React from 'react';
import { AssessmentQuestion } from '@/types/assessment';
import CheckboxQuestion from './QuestionTypes/CheckboxQuestion';
import IndustryQuestion from './QuestionTypes/IndustryQuestion';
import SelectQuestion from './QuestionTypes/SelectQuestion';
import RadioQuestion from './QuestionTypes/RadioQuestion';

interface QuestionContentProps {
  question: AssessmentQuestion;
  answers: Record<string, string>;
  setAnswer: (questionId: string, value: string) => void;
  setMultipleAnswers: (questionId: string, values: string[]) => void;
}

const QuestionContent = ({ 
  question, 
  answers, 
  setAnswer, 
  setMultipleAnswers 
}: QuestionContentProps) => {
  
  // Handle multiple-select questions (checkboxes)
  if (question.type === 'multi-select') {
    const selectedValues = answers[question.id] ? answers[question.id].split(',') : [];
    
    return (
      <CheckboxQuestion 
        question={question} 
        selectedValues={selectedValues}
        onAnswerChange={(questionId, values) => setMultipleAnswers(questionId, values)}
      />
    );
  }
  
  // Special handling for industry question (first question)
  if (question.id === 'industry') {
    return (
      <IndustryQuestion
        question={question}
        selectedAnswer={answers[question.id]}
        onAnswerChange={setAnswer}
      />
    );
  }
  
  // Geography question with dropdown (second question)
  if (question.id === 'geography') {
    return (
      <SelectQuestion
        question={question}
        selectedAnswer={answers[question.id]}
        onAnswerChange={setAnswer}
        placeholder="Select number of states..."
      />
    );
  }
  
  // Organization size with dropdown (third question)
  if (question.id === 'size') {
    return (
      <SelectQuestion
        question={question}
        selectedAnswer={answers[question.id]}
        onAnswerChange={setAnswer}
        placeholder="Select organization size..."
      />
    );
  }
  
  // Standard radio group for other questions (like gender)
  return (
    <RadioQuestion
      question={question}
      selectedAnswer={answers[question.id]}
      onAnswerChange={setAnswer}
    />
  );
};

export default QuestionContent;
