
import { ReportField } from "@/types/reports";
import { formatFieldValue } from "./fieldFormatters";

type ValidationResult = {
  isValid: boolean;
  value: any;
  fallback: any;
  message?: string;
};

/**
 * Interface for field validation configuration
 */
interface FieldValidation {
  required?: boolean;
  fallback?: any;
  type?: 'string' | 'number' | 'percentage' | 'array' | 'object';
  minValue?: number;
  maxValue?: number;
}

/**
 * Default validation configurations for different field types
 */
const defaultValidations: Record<string, FieldValidation> = {
  'name': { required: true, type: 'string', fallback: 'Unnamed' },
  'description': { type: 'string', fallback: 'No description available' },
  'archetype_name': { required: true, type: 'string', fallback: 'Unknown Archetype' },
  'family_name': { type: 'string', fallback: 'Unknown Family' },
  'hex_color': { type: 'string', fallback: '#6B7280' },
  'industries': { type: 'string', fallback: 'Various industries' },
  'key_characteristics': { type: 'array', fallback: [] },
  'strategic_recommendations': { type: 'array', fallback: [] },
  // Percentage fields
  'Demo_Average Percent Female': { type: 'percentage', minValue: 0, maxValue: 1, fallback: 0 },
  'Util_Percent of Members who are Non-Utilizers': { type: 'percentage', minValue: 0, maxValue: 1, fallback: 0 },
  // Numeric fields with reasonable ranges
  'Demo_Average Age': { type: 'number', minValue: 0, maxValue: 120, fallback: 0 },
  'Demo_Average Family Size': { type: 'number', minValue: 0, maxValue: 10, fallback: 0 },
  'Risk_Average Risk Score': { type: 'number', minValue: 0, fallback: 1 }
};

/**
 * Validates a field value against its expected configuration
 */
export const validateField = (
  fieldName: ReportField, 
  value: any, 
  customValidation?: FieldValidation
): ValidationResult => {
  const validation = customValidation || defaultValidations[fieldName] || {};
  const result: ValidationResult = {
    isValid: true,
    value,
    fallback: validation.fallback
  };

  // Handle undefined or null values
  if (value === undefined || value === null) {
    if (validation.required) {
      result.isValid = false;
      result.message = `Required field ${fieldName} is missing`;
      result.value = validation.fallback;
    } else {
      result.value = validation.fallback;
    }
    return result;
  }

  // Type validation
  if (validation.type) {
    switch (validation.type) {
      case 'string':
        if (typeof value !== 'string') {
          result.isValid = false;
          result.value = String(value);
          result.message = `${fieldName} should be a string`;
        }
        break;
      case 'number':
      case 'percentage':
        if (typeof value !== 'number' || isNaN(value)) {
          result.isValid = false;
          result.value = validation.fallback || 0;
          result.message = `${fieldName} should be a number`;
        }
        if (validation.minValue !== undefined && value < validation.minValue) {
          result.isValid = false;
          result.value = validation.minValue;
          result.message = `${fieldName} below minimum value`;
        }
        if (validation.maxValue !== undefined && value > validation.maxValue) {
          result.isValid = false;
          result.value = validation.maxValue;
          result.message = `${fieldName} exceeds maximum value`;
        }
        break;
      case 'array':
        if (!Array.isArray(value)) {
          result.isValid = false;
          result.value = validation.fallback || [];
          result.message = `${fieldName} should be an array`;
        }
        break;
      case 'object':
        if (typeof value !== 'object' || value === null || Array.isArray(value)) {
          result.isValid = false;
          result.value = validation.fallback || {};
          result.message = `${fieldName} should be an object`;
        }
        break;
    }
  }

  return result;
};

/**
 * Safely retrieves a field value with validation and formatting
 */
export const getSafeFieldValue = (
  data: any,
  fieldName: ReportField,
  validation?: FieldValidation
): any => {
  const validationResult = validateField(fieldName, data[fieldName], validation);
  return validationResult.value;
};

/**
 * Validates an array of fields and returns any validation messages
 */
export const validateFields = (
  data: any,
  fields: ReportField[]
): { isValid: boolean; messages: string[] } => {
  const messages: string[] = [];
  let isValid = true;

  fields.forEach(field => {
    const result = validateField(field, data[field]);
    if (!result.isValid && result.message) {
      messages.push(result.message);
      isValid = false;
    }
  });

  return { isValid, messages };
};

/**
 * Checks if a report dataset has all required fields
 */
export const isValidReportData = (
  data: any,
  requiredFields: ReportField[]
): boolean => {
  if (!data) return false;
  const { isValid } = validateFields(data, requiredFields);
  return isValid;
};

