
/**
 * Enhanced utilities for working with metrics using centralized services
 */

import { percentageCalculatorService } from '@/services/PercentageCalculatorService';

/**
 * Calculate the percentage difference between a value and an average using centralized service
 * 
 * @param value The value to compare
 * @param average The archetype average to compare against
 * @returns The percentage difference (e.g., 10.5 for 10.5% higher)
 */
export const calculatePercentageDifference = async (
  value: number, 
  average: number,
  options: { isLowerBetter?: boolean; metricName?: string } = {}
): Promise<number> => {
  try {
    const result = await percentageCalculatorService.calculatePercentage(
      options.metricName || 'custom',
      {},
      {
        customValue: value,
        customAverage: average,
        isLowerBetter: options.isLowerBetter
      }
    );
    
    return result.isValid ? result.percentageDifference : 0;
  } catch (error) {
    console.error('[calculatePercentageDifference] Error:', error);
    return 0;
  }
};

/**
 * Legacy synchronous version for backward compatibility
 */
export const calculatePercentageDifferenceSync = (value: number, average: number): number => {
  // Handle edge cases to avoid division by zero or invalid comparisons
  if (value === null || value === undefined || average === null || average === undefined) {
    console.warn('[calculatePercentageDifferenceSync] Invalid inputs:', { value, average });
    return 0;
  }
  
  // If both are the same (or very close), return 0 difference
  if (Math.abs(value - average) < 0.001) return 0;
  
  // If average is zero or very close to zero
  if (Math.abs(average) < 0.001) {
    console.warn('[calculatePercentageDifferenceSync] Near-zero average detected:', { value, average });
    return value > 0 ? 100 : (value < 0 ? -100 : 0);
  }
  
  // Calculate the difference as a percentage
  const percentDiff = ((value - average) / Math.abs(average)) * 100;
  
  // Bound the result to reasonable limits (+/- 1000%) to prevent extreme values
  if (percentDiff > 1000) return 1000;
  if (percentDiff < -1000) return -1000;
  
  return percentDiff;
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
    'fraud', 'waste', 'abuse', 'emergency'
  ];
  
  const metricNameLower = metricName.toLowerCase();
  return lowerIsBetterTerms.some(term => metricNameLower.includes(term));
};

/**
 * Get comparison text and color for a metric using centralized service
 */
export const getMetricComparisonText = async (
  value: number, 
  average: number, 
  metricName: string
): Promise<{ text: string; color: string }> => {
  try {
    const result = await percentageCalculatorService.calculatePercentage(
      metricName,
      {},
      {
        customValue: value,
        customAverage: average,
        isLowerBetter: isLowerBetter(metricName)
      }
    );
    
    return {
      text: result.comparisonText,
      color: result.colorClass
    };
  } catch (error) {
    console.error('[getMetricComparisonText] Error:', error);
    return {
      text: 'No comparison data',
      color: 'text-gray-500'
    };
  }
};

/**
 * Legacy synchronous version for backward compatibility
 */
export const getMetricComparisonTextSync = (value: number, average: number, metricName: string): { text: string; color: string } => {
  if (!value || !average) {
    return { text: 'No comparison data', color: 'text-gray-500' };
  }
  
  // Calculate the percentage difference
  const percentDiff = calculatePercentageDifferenceSync(value, average);
  
  // Determine if lower is better for this metric
  const lowerIsBetter = isLowerBetter(metricName);
  
  // Determine if this is positive or negative
  const isPositive = (percentDiff > 0 && !lowerIsBetter) || (percentDiff < 0 && lowerIsBetter);
  
  // Handle values that are virtually the same
  if (Math.abs(percentDiff) < 0.1) {
    return { text: 'Same as archetype average', color: 'text-gray-600' };
  }
  
  // Determine display text
  const comparisonWord = percentDiff > 0 ? "higher than" : "lower than";
  const text = `${Math.abs(percentDiff).toFixed(1)}% ${comparisonWord} archetype average`;
  
  // Determine color for the comparison text
  const color = isPositive ? "text-green-600" : percentDiff === 0 ? "text-gray-600" : "text-amber-600";
  
  return { text, color };
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
 * Organize metrics by category
 * 
 * @param metrics Array of metrics
 * @returns Object with metrics organized by category
 */
export const organizeMetricsByCategory = (metrics: any[]): Record<string, any[]> => {
  if (!metrics || !Array.isArray(metrics)) {
    return {};
  }
  
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
