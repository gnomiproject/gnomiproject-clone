
import { formatNumber, formatPercent, formatCurrency, formatMetric } from '@/utils/formatters';

// Helper type for field names
type ReportField = string;

/**
 * Determines if a field represents a percentage value
 */
export const isPercentageField = (fieldName: ReportField): boolean => {
  // Look for common percentage indicators in field names
  const percentageIndicators = [
    'Percent',
    'Prevalence',
    'Adoption',
    'Rate',
    'Ratio'
  ];
  
  // Check for specific field prefixes
  const percentagePrefixes = ['Dise_', 'Gaps_'];
  
  // Check if field starts with a percentage prefix
  const hasPercentagePrefix = percentagePrefixes.some(prefix => fieldName.startsWith(prefix));
  
  // Check if field contains a percentage indicator
  const hasPercentageIndicator = percentageIndicators.some(indicator => 
    fieldName.includes(indicator)
  );
  
  return hasPercentagePrefix || hasPercentageIndicator;
};

/**
 * Determines if a field represents a currency value
 */
export const isCurrencyField = (fieldName: ReportField): boolean => {
  // Check for common currency indicators
  const currencyIndicators = [
    'Cost_', 
    'Price',
    'Paid',
    'Amount',
    'Budget',
    'Expense',
    'Savings',
    'PMPM',
    'PMPY',
    'PEPY',
    'PEPM'
  ];
  
  return currencyIndicators.some(indicator => fieldName.includes(indicator));
};

/**
 * Determines if a field represents a count or rate
 */
export const isRateField = (fieldName: ReportField): boolean => {
  // Check for common rate indicators
  const rateIndicators = [
    'per 1k',
    'per 1000',
    'Util_',
    'Demo_',
    'Count',
    'Visits',
    'Admits'
  ];
  
  return rateIndicators.some(indicator => fieldName.includes(indicator));
};

/**
 * Main formatting function that handles all field types
 */
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

/**
 * Formats field labels for display by removing prefixes and improving readability
 */
export const formatFieldLabel = (fieldName: ReportField): string => {
  if (!fieldName) return '';
  
  // Remove common prefixes
  const prefixes = ['Cost_', 'Util_', 'Demo_', 'Dise_', 'Gaps_', 'SDOH_', 'Risk_'];
  let withoutPrefix = fieldName;
  
  for (const prefix of prefixes) {
    if (withoutPrefix.startsWith(prefix)) {
      withoutPrefix = withoutPrefix.slice(prefix.length);
      break;
    }
  }
  
  // Replace underscores with spaces
  withoutPrefix = withoutPrefix.replace(/_/g, ' ');
  
  // Replace common abbreviations
  const replacements = {
    'RX': 'Prescription',
    'PEPY': 'Per Employee Per Year',
    'PMPY': 'Per Member Per Year',
    'PMPM': 'Per Member Per Month',
    'PEPM': 'Per Employee Per Month',
    'ED': 'Emergency Department',
    'FU': 'Follow-up',
    'SUD': 'Substance Use Disorder',
    'ADHD': 'ADHD',
    'HbA1C': 'HbA1c',
    'ACE': 'ACE',
    'ARB': 'ARB',
    'HDL': 'HDL',
    'LDL': 'LDL',
    'PCP': 'Primary Care',
    'HPV': 'HPV',
    'TDAP': 'Tdap',
    'MSK': 'Musculoskeletal',
    'COPD': 'COPD',
    'PTSD': 'PTSD'
  };
  
  // Replace each abbreviation with its full text
  let result = withoutPrefix;
  for (const [abbr, full] of Object.entries(replacements)) {
    // Use word boundary to prevent partial replacements
    const regex = new RegExp(`\\b${abbr}\\b`, 'g');
    result = result.replace(regex, full);
  }
  
  // Capitalize the first letter
  if (result.length > 0) {
    result = result.charAt(0).toUpperCase() + result.slice(1);
  }
  
  return result;
};

/**
 * Get display metadata for a field
 */
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
