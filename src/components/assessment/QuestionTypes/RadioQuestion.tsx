
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AssessmentQuestion } from '@/types/assessment';

interface RadioQuestionProps {
  question: AssessmentQuestion;
  selectedAnswer: string | undefined;
  onAnswerChange: (questionId: string, value: string) => void;
}

const RadioQuestion = ({ question, selectedAnswer, onAnswerChange }: RadioQuestionProps) => {
  return (
    <RadioGroup
      value={selectedAnswer || ""}
      onValueChange={(value) => onAnswerChange(question.id, value)}
      className="space-y-4"
    >
      {question.options.map(option => (
        <div key={option.id} className="flex items-center space-x-3 text-left">
          <RadioGroupItem id={option.id} value={option.id} />
          <Label htmlFor={option.id} className="text-base font-normal cursor-pointer">
            {option.text}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default RadioQuestion;
