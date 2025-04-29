
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
  const [employeeCount, setEmployeeCount] = useState<string>(exactEmployeeCount?.toLocaleString() || '');

  useEffect(() => {
    // Update the displayed count when exactEmployeeCount changes
    if (exactEmployeeCount !== undefined && exactEmployeeCount !== null) {
      setEmployeeCount(exactEmployeeCount.toLocaleString());
    }
  }, [exactEmployeeCount]);

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
    const value = e.target.value.replace(/,/g, '');
    
    // Only update if we have a valid number
    if (value === '' || !isNaN(Number(value))) {
      const formattedValue = value ? Number(value).toLocaleString() : '';
      setEmployeeCount(formattedValue);
      
      if (setExactEmployeeCount && value) {
        const count = Number(value);
        console.log('[SizeQuestion] Setting exact employee count:', count);
        setExactEmployeeCount(count);
        
        // Also explicitly save to session storage as a backup
        sessionStorage.setItem('healthcareArchetypeExactEmployeeCount', count.toString());
        
        const optionId = mapEmployeeCountToOption(count);
        onAnswerChange(question.id, optionId);
      } else if (setExactEmployeeCount && !value) {
        console.log('[SizeQuestion] Clearing exact employee count');
        setExactEmployeeCount(null);
        sessionStorage.removeItem('healthcareArchetypeExactEmployeeCount');
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="employeeCount" className="text-sm font-medium">
          Enter the number of employees at your company
        </label>
        <Input
          id="employeeCount"
          type="text"
          inputMode="numeric"
          value={employeeCount}
          onChange={handleInputChange}
          placeholder="e.g., 5,200"
          className="w-full"
        />
      </div>
    </div>
  );
};

export default SizeQuestion;
