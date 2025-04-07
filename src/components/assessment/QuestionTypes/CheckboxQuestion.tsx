
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AssessmentQuestion } from '@/types/assessment';

interface CheckboxQuestionProps {
  question: AssessmentQuestion;
  selectedValues: string[];
  onAnswerChange: (questionId: string, values: string[]) => void;
}

const CheckboxQuestion = ({ question, selectedValues, onAnswerChange }: CheckboxQuestionProps) => {
  return (
    <div className="space-y-4">
      {question.options.map(option => (
        <div key={option.id} className="flex items-start space-x-3 text-left">
          <Checkbox 
            id={option.id} 
            checked={selectedValues.includes(option.id)}
            onCheckedChange={(checked) => {
              let newValues;
              if (checked) {
                newValues = [...selectedValues, option.id];
              } else {
                newValues = selectedValues.filter(value => value !== option.id);
              }
              onAnswerChange(question.id, newValues);
            }}
          />
          <Label htmlFor={option.id} className="text-base font-normal cursor-pointer">
            {option.text}
          </Label>
        </div>
      ))}
    </div>
  );
};

export default CheckboxQuestion;
