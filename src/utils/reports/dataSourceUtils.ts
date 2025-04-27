
import { ReportType } from '@/types/reports';

export type ReportDataSource = 'level3_report_data' | 'level4_deepdive_report_data';

export const getTypeValidDataSource = (reportType: ReportType, sectionKey: string): ReportDataSource => {
  return reportType === 'insight' ? 'level3_report_data' : 'level4_deepdive_report_data';
};
