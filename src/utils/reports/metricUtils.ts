
/**
 * Utilities for working with metrics
 */

/**
 * Calculate the percentage difference between a value and an average
 * 
 * @param value The value to compare
 * @param average The average to compare against
 * @returns The percentage difference (e.g., 10.5 for 10.5% higher)
 */
export const calculatePercentageDifference = (value: number, average: number): number => {
  // Handle edge cases to avoid division by zero
  if (!value && !average) return 0;
  if (!average) return value > 0 ? 100 : -100;
  
  // Calculate the difference as a percentage
  return ((value - average) / average) * 100;
};

/**
 * Determine if a higher or lower value is better for a metric
 * 
 * @param metricName The name of the metric
 * @returns True if lower is better, false if higher is better
 */
export const isLowerBetter = (metricName: string): boolean => {
  const lowerIsBetterTerms = [
    'cost', 'risk', 'gap', 'readmission', 'mortality', 'complication', 
    'infection', 'error', 'avoidable', 'preventable', 'unnecessary',
    'fraud', 'waste', 'abuse'
  ];
  
  const metricNameLower = metricName.toLowerCase();
  return lowerIsBetterTerms.some(term => metricNameLower.includes(term));
};

/**
 * Format a metric value for display
 * 
 * @param value The value to format
 * @param options Formatting options
 * @returns Formatted string
 */
export const formatMetricValue = (value: number, options: {
  decimals?: number;
  asPercentage?: boolean;
  asCurrency?: boolean;
  withSign?: boolean;
} = {}): string => {
  const {
    decimals = 1,
    asPercentage = false,
    asCurrency = false,
    withSign = false
  } = options;
  
  if (value === undefined || value === null) {
    return 'N/A';
  }
  
  let formatted = value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
  
  if (asPercentage) {
    formatted += '%';
  }
  
  if (asCurrency) {
    formatted = '$' + formatted;
  }
  
  if (withSign && value > 0) {
    formatted = '+' + formatted;
  }
  
  return formatted;
};
