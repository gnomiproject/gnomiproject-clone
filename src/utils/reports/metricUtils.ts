import { OrganizedMetrics, ReportMetric } from './types';

/**
 * Organizes metrics by their category prefix (e.g., "Cost_", "Demo_", etc.)
 */
export function organizeMetricsByCategory(metrics: any): OrganizedMetrics {
  console.log(`Organizing metrics by category`);
  const organized: OrganizedMetrics = {};
  
  // Go through all properties in the data object
  Object.keys(metrics).forEach(key => {
    // Skip non-metric properties or null values
    if (!key.includes('_') || !metrics[key]) return;
    
    // Extract category from the metric name (e.g., "Cost_Medical Paid Amount PEPY" -> "Cost")
    const category = key.split('_')[0];
    
    if (!organized[category]) {
      organized[category] = [];
    }
    
    organized[category].push({
      metric: key.split('_')[1],
      value: metrics[key],
      category: category
    });
  });
  
  console.log(`Organized into ${Object.keys(organized).length} categories`);
  return organized;
}

/**
 * Calculates the percentage difference between two values
 * @param value The current value
 * @param average The average/baseline value to compare against
 * @returns Percentage difference as a number (positive means higher than average)
 */
export function calculatePercentageDifference(value: number, average: number): number {
  if (average === 0) return 0; // Avoid division by zero
  return ((value - average) / average) * 100;
}

/**
 * Formats the percentage difference with a + or - sign and determines if higher is better
 * based on the metric type
 * @param difference The calculated percentage difference
 * @param metricName The name of the metric (used to determine if higher is better)
 * @returns Formatted string with appropriate sign and color indication
 */
export function formatPercentageDifference(difference: number, metricName: string): {
  formatted: string;
  isPositive: boolean;
  isBetter: boolean;
} {
  // Determine if a higher value is better for this metric (could be expanded based on metric types)
  const higherIsBetter = !metricName.includes('Cost') && 
                         !metricName.includes('Risk') && 
                         !metricName.includes('Emergency') &&
                         !metricName.includes('Inpatient') &&
                         !metricName.includes('Non-Utilizers');
  
  const isPositive = difference > 0;
  const sign = isPositive ? '+' : '';
  const formatted = `${sign}${difference.toFixed(1)}%`;
  
  // Determine if the difference is "better" based on the metric type
  const isBetter = (higherIsBetter && isPositive) || (!higherIsBetter && !isPositive);
  
  return {
    formatted,
    isPositive,
    isBetter
  };
}

/**
 * Gets comparison text for a metric value compared to average
 * @param value Current value
 * @param average Average/baseline value
 * @param metricName Name of the metric
 * @returns Formatted comparison string with appropriate styling information
 */
export interface ComparisonResult {
  text: string;
  color: string;
  isPositive: boolean;
  isBetter: boolean;
}

/**
 * Gets a formatted comparison string that includes both the percentage difference and the average value
 */
export function getMetricComparisonText(value: number, average: number, metricName: string): ComparisonResult {
  if (!value || !average) {
    return {
      text: 'No data available',
      color: 'text-gray-500',
      isPositive: false,
      isBetter: false
    };
  }
  
  const difference = calculatePercentageDifference(value, average);
  const { formatted, isPositive, isBetter } = formatPercentageDifference(difference, metricName);
  
  // Choose the appropriate text based on whether the difference is positive or negative
  const comparisonWord = difference > 0 ? "higher" : "lower";
  
  // Format the average value based on whether it's a currency or regular number
  const formattedAverage = metricName.toLowerCase().includes('cost') ? 
    `$${average.toLocaleString()}` : 
    average.toLocaleString();
  
  const text = `${Math.abs(difference).toFixed(1)}% ${comparisonWord} than average (${formattedAverage})`;
  const color = isBetter ? "text-green-600" : "text-amber-600";
  
  return { text, color, isPositive, isBetter };
}
