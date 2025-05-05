
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

/**
 * Format a percentage difference for display
 * 
 * @param percentDiff The percentage difference to format
 * @returns Formatted string with sign
 */
export const formatPercentageDifference = (percentDiff: number): string => {
  const sign = percentDiff > 0 ? '+' : '';
  return `${sign}${percentDiff.toFixed(1)}%`;
};

/**
 * Get comparison text and color for a metric
 * 
 * @param value The value to compare
 * @param average The average to compare against
 * @param metricName The name of the metric
 * @returns Object with text and color properties
 */
export const getMetricComparisonText = (value: number, average: number, metricName: string): { text: string; color: string } => {
  if (!value || !average) {
    return { text: 'No comparison data', color: 'text-gray-500' };
  }
  
  // Calculate the percentage difference
  const percentDiff = calculatePercentageDifference(value, average);
  
  // Determine if lower is better for this metric
  const lowerIsBetter = isLowerBetter(metricName);
  
  // Determine if this is positive or negative
  const isPositive = (percentDiff > 0 && !lowerIsBetter) || (percentDiff < 0 && lowerIsBetter);
  
  // Determine display text
  const comparisonWord = percentDiff > 0 ? "higher than" : "lower than";
  const text = `${Math.abs(percentDiff).toFixed(1)}% ${comparisonWord} average`;
  
  // Determine color for the comparison text
  const color = isPositive ? "text-green-600" : percentDiff === 0 ? "text-gray-600" : "text-amber-600";
  
  return { text, color };
};

/**
 * Organize metrics by category
 * 
 * @param metrics Array of metrics
 * @returns Object with metrics organized by category
 */
export const organizeMetricsByCategory = (metrics: any[]): Record<string, any[]> => {
  const categories: Record<string, any[]> = {};
  
  metrics.forEach(metric => {
    const category = metric.category || 'Uncategorized';
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(metric);
  });
  
  return categories;
};
