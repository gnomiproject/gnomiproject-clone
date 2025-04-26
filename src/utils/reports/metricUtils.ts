
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
