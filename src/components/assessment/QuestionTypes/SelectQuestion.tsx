
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AssessmentQuestion } from '@/types/assessment';

interface SelectQuestionProps {
  question: AssessmentQuestion;
  selectedAnswer: string | undefined;
  onAnswerChange: (questionId: string, value: string) => void;
  placeholder: string;
}

const SelectQuestion = ({ question, selectedAnswer, onAnswerChange, placeholder }: SelectQuestionProps) => {
  return (
    <Select
      value={selectedAnswer || ""}
      onValueChange={(value) => onAnswerChange(question.id, value)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {question.options.map(option => (
          <SelectItem key={option.id} value={option.id}>
            {option.text}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectQuestion;
