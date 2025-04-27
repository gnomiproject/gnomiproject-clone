
import { ReportType } from '@/types/reports';

// Define valid data sources as literal types for type safety with Supabase
export type ReportDataSource = 'level3_report_data' | 'level4_deepdive_report_data';

export const getTypeValidDataSource = (reportType: ReportType): ReportDataSource => {
  return reportType === 'insight' ? 'level3_report_data' : 'level4_deepdive_report_data';
};
