import { formatNumber } from '@/utils/formatters';
import { calculatePercentageDifference } from './metricUtils';
import { organizeMetricsByCategory } from './metricUtils';

/**
 * Generates a report for a given archetype.
 * @param archetype - The archetype data.
 * @returns The generated report.
 */
export const generateArchetypeReport = (archetype: any): any => {
  const report: any = {};

  // Basic archetype information
  report.name = archetype.archetype_name;
  report.description = archetype.long_description;
  report.key_characteristics = archetype.key_characteristics;

  // Organize metrics by category
  report.metricsByCategory = organizeMetricsByCategory(archetype.metrics);

  // Example: Calculating a simple metric (this should be replaced with actual logic)
  report.averageMetricValue = archetype.metrics?.reduce((sum: number, metric: any) => sum + metric.value, 0) / archetype.metrics?.length || 0;

  return report;
};
