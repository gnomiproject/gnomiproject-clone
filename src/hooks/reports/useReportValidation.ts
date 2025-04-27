
import { useState, useEffect } from 'react';
import { ReportField } from '@/types/reports';
import { validateFields, getSafeFieldValue } from '@/utils/reports/validationUtils';

interface UseReportValidationResult {
  isValid: boolean;
  validationMessages: string[];
  getSafeValue: (fieldName: ReportField) => any;
  validateData: () => boolean;
}

export const useReportValidation = (data: any, requiredFields: ReportField[]): UseReportValidationResult => {
  const [isValid, setIsValid] = useState(true);
  const [validationMessages, setValidationMessages] = useState<string[]>([]);

  const validateData = () => {
    const { isValid: valid, messages } = validateFields(data, requiredFields);
    setIsValid(valid);
    setValidationMessages(messages);
    return valid;
  };

  useEffect(() => {
    validateData();
  }, [data]);

  const getSafeValue = (fieldName: ReportField) => {
    return getSafeFieldValue(data, fieldName);
  };

  return {
    isValid,
    validationMessages,
    getSafeValue,
    validateData
  };
};
