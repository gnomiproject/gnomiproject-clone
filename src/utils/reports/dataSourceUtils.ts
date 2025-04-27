
import { ReportType } from './schemaUtils';
import { insightReportSchema } from '@/schemas/insightReportSchema';
import { deepDiveReportSchema } from '@/schemas/deepDiveReportSchema';

// Define valid data source names that match Supabase tables
export type ValidDataSource = 
  | "level3_report_data" 
  | "level4_deepdive_report_data"
  | "View_Cost_Metrics"
  | "View_Demographics_Metrics"
  | "View_Disease_Prevalence" 
  | "View_Gaps_In_Care"
  | "View_Risk_Factors"
  | "View_Utilization_Metrics";

// Ensure schema data sources map to valid Supabase tables
export const validDataSources: Record<string, ValidDataSource> = {
  "level3_report_data": "level3_report_data",
  "level4_deepdive_report_data": "level4_deepdive_report_data"
};

/**
 * Get a type-safe data source for the specified report type and section
 */
export const getTypeValidDataSource = (reportType: ReportType, sectionKey: string): ValidDataSource => {
  let source: string | undefined;
  
  if (reportType === 'insight') {
    source = insightReportSchema[sectionKey]?.dataSource;
  } else {
    source = deepDiveReportSchema[sectionKey]?.dataSource;
  }
  
  // Ensure the data source is valid
  if (source && source in validDataSources) {
    return validDataSources[source];
  }
  
  // Fall back to default data source for the report type
  return reportType === 'insight' ? "level3_report_data" : "level4_deepdive_report_data";
};
