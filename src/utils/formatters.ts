
/**
 * Utility functions for formatting numbers, currencies, and percentages
 */

/**
 * Format a number as currency, percentage, or plain number
 * @param value The number to format
 * @param type The type of formatting to apply ('currency', 'percent', or 'number')
 * @param decimals The number of decimal places to include
 * @returns The formatted value as a string
 */
export const formatNumber = (value: number, type: 'currency' | 'percent' | 'number' = 'number', decimals: number = 2): string => {
  if (value === null || value === undefined) return 'N/A';
  
  try {
    switch (type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'USD',
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        }).format(value);
      
      case 'percent':
        // FIXED: Don't use Intl percent formatter as it expects decimal values
        // We already have percentage values (90.94), so just add % sign
        return new Intl.NumberFormat('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        }).format(value) + '%';
      
      default:
        return new Intl.NumberFormat('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        }).format(value);
    }
  } catch (error) {
    console.error('Error formatting number:', error);
    return String(value);
  }
};

/**
 * Format a percentage value with automatic decimal detection
 * @param value The value to format (can be decimal like 0.0271 or percentage like 90.94)
 * @param decimals The number of decimal places to include
 * @returns The formatted percentage as a string
 */
export const formatPercent = (value: number, decimals: number = 1): string => {
  if (value === null || value === undefined) return 'N/A';
  
  // FIXED: Detect if value is a decimal that needs conversion to percentage
  // Values less than 1 are likely decimals (e.g., 0.0271 = 2.71%)
  // Values >= 1 are likely already percentages (e.g., 90.94 = 90.94%)
  let adjustedValue = value;
  
  if (value > 0 && value < 1) {
    // Convert decimal to percentage (0.0271 -> 2.71)
    adjustedValue = value * 100;
    console.log(`[formatPercent] Converting decimal ${value} to percentage ${adjustedValue}%`);
  }
  
  return formatNumber(adjustedValue, 'percent', decimals);
};

/**
 * Format a currency value
 * @param value The value in dollars
 * @param decimals The number of decimal places to include
 * @returns The formatted currency as a string
 */
export const formatCurrency = (value: number, decimals: number = 0): string => {
  return formatNumber(value, 'currency', decimals);
};

/**
 * Format a metric value based on its name or key
 * Automatically determines the appropriate format based on the metric name
 * @param key The metric key or name
 * @param value The value to format
 * @returns The formatted value as a string
 */
export const formatMetric = (key: string, value: number): string => {
  if (value === null || value === undefined) return 'N/A';
  
  // Cost metrics as currency
  if (key.startsWith('Cost_')) {
    return formatCurrency(value);
  }
  
  // Percentage metrics
  if (
    key.startsWith('Dise_') || 
    key.startsWith('Gaps_') || 
    key.includes('Percent') ||
    key.includes('Prevalence') ||
    key.includes('Adoption')
  ) {
    return formatPercent(value);
  }
  
  // Utilization metrics with 0 decimals
  if (key.includes('per 1k') || key.startsWith('Util_')) {
    return formatNumber(value, 'number', 0);
  }
  
  // Risk scores with 2 decimals
  if (key.includes('Risk') || key.includes('SDOH')) {
    return formatNumber(value, 'number', 2);
  }
  
  // Default format
  return formatNumber(value, 'number');
};
