
import { formatNumber, formatPercent, formatCurrency, formatMetric } from '@/utils/formatters';

// Helper type for field names
type ReportField = string;

// Helper to determine if a field represents a percentage
export const isPercentageField = (fieldName: ReportField): boolean => {
  return fieldName.startsWith('Dise_') || 
         fieldName.startsWith('Gaps_') || 
         fieldName.includes('Percent') ||
         fieldName.includes('Prevalence') ||
         fieldName.includes('Adoption');
};

// Helper to determine if a field represents a currency value
export const isCurrencyField = (fieldName: ReportField): boolean => {
  return fieldName.startsWith('Cost_');
};

// Helper to determine if a field represents a count or rate
export const isRateField = (fieldName: ReportField): boolean => {
  return fieldName.includes('per 1k') || 
         fieldName.startsWith('Util_') ||
         fieldName.startsWith('Demo_');
};

// Main formatting function that handles all field types
export const formatFieldValue = (fieldName: ReportField, value: number | null | undefined): string => {
  if (value === null || value === undefined) {
    return 'N/A';
  }

  // Format based on field type
  if (isCurrencyField(fieldName)) {
    return formatCurrency(value);
  }

  if (isPercentageField(fieldName)) {
    return formatPercent(value);
  }

  if (isRateField(fieldName)) {
    return formatNumber(value, 'number', 1);
  }

  // Default formatting for other numeric fields
  return formatNumber(value, 'number', 2);
};

// Formats field labels for display
export const formatFieldLabel = (fieldName: ReportField): string => {
  // Remove common prefixes
  const withoutPrefix = fieldName
    .replace(/^(Cost_|Util_|Demo_|Dise_|Gaps_|SDOH_|Risk_)/, '')
    .replace(/_/g, ' ');

  // Replace common abbreviations
  return withoutPrefix
    .replace('RX', 'Prescription')
    .replace('PEPY', 'Per Employee Per Year')
    .replace('PMPY', 'Per Member Per Year')
    .replace('PMPM', 'Per Member Per Month')
    .replace('ED', 'Emergency Department')
    .replace('FU', 'Follow-up')
    .replace('SUD', 'Substance Use Disorder')
    .replace('ADHD', 'ADHD');
};

// Get display metadata for a field
export const getFieldDisplayMetadata = (fieldName: ReportField) => {
  return {
    label: formatFieldLabel(fieldName),
    prefix: isCurrencyField(fieldName) ? '$' : '',
    suffix: isPercentageField(fieldName) ? '%' : 
           isRateField(fieldName) && fieldName.includes('per 1k') ? ' per 1,000' : '',
    decimals: isCurrencyField(fieldName) ? 0 : 
             isPercentageField(fieldName) ? 1 : 
             isRateField(fieldName) ? 1 : 2
  };
};

