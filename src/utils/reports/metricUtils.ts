
/**
 * Calculate the percentage difference between two values
 */
export const calculatePercentageDifference = (value: number, benchmark: number): number => {
  if (benchmark === 0) return 0;
  return ((value - benchmark) / benchmark) * 100;
};

/**
 * Format a percentage difference with a + or - sign
 */
export const formatPercentageDifference = (percentDiff: number): string => {
  const sign = percentDiff > 0 ? '+' : '';
  return `${sign}${percentDiff.toFixed(1)}%`;
};

/**
 * Get comparative text and color based on the comparison of values
 */
export const getMetricComparisonText = (value: number, average: number, metricName: string): { text: string; color: string } => {
  const percentDiff = calculatePercentageDifference(value, average);
  
  // Determine if higher or lower is better based on metric name
  const lowerIsBetter = 
    metricName.toLowerCase().includes('cost') ||
    metricName.toLowerCase().includes('emergency') ||
    metricName.toLowerCase().includes('risk') ||
    metricName.toLowerCase().includes('gap');
  
  let text, color;
  
  if (Math.abs(percentDiff) < 5) {
    text = `Similar to average (${formatPercentageDifference(percentDiff)})`;
    color = 'text-gray-600';
  } else if (
    (percentDiff > 0 && !lowerIsBetter) || 
    (percentDiff < 0 && lowerIsBetter)
  ) {
    text = `Better than average (${formatPercentageDifference(Math.abs(percentDiff))})`;
    color = 'text-green-600';
  } else {
    text = `Worse than average (${formatPercentageDifference(Math.abs(percentDiff))})`;
    color = 'text-red-600';
  }
  
  return { text, color };
};
