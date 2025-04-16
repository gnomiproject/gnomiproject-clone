
import React, { useState, useEffect } from 'react';
import { AssessmentQuestion } from '@/types/assessment';
import { Input } from '@/components/ui/input';

interface SizeQuestionProps {
  question: AssessmentQuestion;
  selectedAnswer: string | undefined;
  onAnswerChange: (questionId: string, value: string) => void;
  exactEmployeeCount?: number | null;
  setExactEmployeeCount?: (count: number | null) => void;
}

const SizeQuestion = ({ 
  question, 
  selectedAnswer, 
  onAnswerChange,
  exactEmployeeCount,
  setExactEmployeeCount
}: SizeQuestionProps) => {
  const [employeeCount, setEmployeeCount] = useState<string>(exactEmployeeCount?.toString() || '');

  // Map employee count to the appropriate range option
  const mapEmployeeCountToOption = (count: number): string => {
    if (count < 250) {
      return 'less_than_250';
    } else if (count >= 250 && count < 1000) {
      return '250_to_999';
    } else if (count >= 1000 && count < 10000) {
      return '1000_to_9999';
    } else if (count >= 10000 && count < 100000) {
      return '10000_to_99999';
    } else {
      return '100000_plus';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmployeeCount(value);
    
    // Only update if we have a valid number
    if (value && !isNaN(Number(value))) {
      const count = Number(value);
      if (setExactEmployeeCount) {
        setExactEmployeeCount(count);
      }
      const optionId = mapEmployeeCountToOption(count);
      onAnswerChange(question.id, optionId);
    }
  };

  // Format the number with commas for readability
  const formatNumber = (value: string): string => {
    const numberValue = Number(value.replace(/,/g, ''));
    if (isNaN(numberValue)) return value;
    return numberValue.toLocaleString();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="employeeCount" className="text-sm font-medium">
          Enter the exact number of employees
        </label>
        <Input
          id="employeeCount"
          type="text"
          inputMode="numeric"
          value={employeeCount}
          onChange={handleInputChange}
          placeholder="e.g., 5200"
          className="w-full"
        />
      </div>

      {employeeCount && !isNaN(Number(employeeCount.replace(/,/g, ''))) && (
        <div className="mt-2 text-sm text-muted-foreground">
          Size category: {question.options.find(opt => opt.id === selectedAnswer)?.text || 'Not specified'}
        </div>
      )}
    </div>
  );
};

export default SizeQuestion;
