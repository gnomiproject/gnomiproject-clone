
import { ReportType } from './schemaUtils';

// Simplified data source type that only includes our main report tables
export type ReportDataSource = 'level3_report_data' | 'level4_deepdive_report_data';

/**
 * Get the correct data source table based on report type and section
 */
export const getTypeValidDataSource = (reportType: ReportType, sectionKey: string): ReportDataSource => {
  // For now, we'll use a simple mapping based on report type
  return reportType === 'insight' ? 'level3_report_data' : 'level4_deepdive_report_data';
};
