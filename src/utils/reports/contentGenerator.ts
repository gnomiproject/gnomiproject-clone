
import { OrganizedMetrics, ReportContent } from './types';

/**
 * Generates report content based on archetype data and organized metrics
 */
export function generateReportContent(archetype: any, organizedMetrics: OrganizedMetrics): ReportContent {
  console.log(`Generating report content for archetype ${archetype.archetype_id}: ${archetype.archetype_name}`);
  
  const title = `Deep Dive Report: ${archetype.archetype_name}`;
  const introduction = archetype.executive_summary || 
    `This report provides an in-depth analysis of the ${archetype.archetype_name} archetype, focusing on key metrics and strategic insights.`;
  const summary_analysis = `The ${archetype.archetype_name} archetype exhibits distinct characteristics across several key performance indicators.`;
  const distinctive_metrics_summary = `Key metrics highlight the unique attributes of the ${archetype.archetype_name} archetype, providing a comprehensive overview of its strengths and weaknesses.`;
  
  return {
    title,
    introduction,
    summary_analysis,
    distinctive_metrics_summary,
    detailed_metrics: organizedMetrics
  };
}
