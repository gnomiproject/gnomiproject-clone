
import { formatCurrency, formatNumber } from '@/utils/formatters';

/**
 * Format a cost value with appropriate currency symbol
 */
export const formatCost = (value: number | null | undefined, decimals: number = 0): string => {
  if (value === null || value === undefined) return 'N/A';
  return formatCurrency(value, decimals);
};

/**
 * Calculate cost per member from cost per employee based on family size
 */
export const calculateCostPerMember = (costPerEmployee: number, familySize: number): number => {
  if (!familySize || familySize < 1) return costPerEmployee;
  return costPerEmployee / familySize;
};

/**
 * Calculate cost per employee from cost per member based on family size
 */
export const calculateCostPerEmployee = (costPerMember: number, familySize: number): number => {
  if (!familySize || familySize < 1) return costPerMember;
  return costPerMember * familySize;
};

/**
 * Calculate potential savings percentage based on avoidable costs
 */
export const calculatePotentialSavingsPercentage = (
  avoidableCost: number, 
  totalCost: number
): number => {
  if (!totalCost || totalCost === 0 || !avoidableCost) return 0;
  return (avoidableCost / totalCost) * 100;
};

/**
 * Format cost comparison data into a consistent structure for charts
 */
export const formatCostComparisonData = (
  yourData: any, 
  archetypeAverage: any, 
  metrics: string[]
): any[] => {
  return metrics.map(metricKey => {
    const metricName = formatMetricName(metricKey);
    return {
      name: metricName,
      'Your Cost': yourData[metricKey] || 0,
      'Archetype Average': archetypeAverage[metricKey] || 0
    };
  });
};

/**
 * Format a cost metric key into a readable name
 */
export const formatMetricName = (metricKey: string): string => {
  // Remove common prefixes
  let name = metricKey.replace(/^(Cost_|Util_|Demo_|Dise_|Gaps_)/, '');
  
  // Replace underscores with spaces
  name = name.replace(/_/g, ' ');
  
  // Replace common abbreviations
  name = name
    .replace('RX', 'Prescription')
    .replace('PEPY', 'Per Employee Per Year')
    .replace('PMPY', 'Per Member Per Year')
    .replace('PMPM', 'Per Member Per Month')
    .replace('PEPM', 'Per Employee Per Month');
    
  return name;
};
