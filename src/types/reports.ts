
// Common types for report schemas
export type ReportField = string;

export type ReportDataSource = "level3_report_data" | "level4_deepdive_report_data";

export interface ReportSection {
  title: string;
  fields: ReportField[];
  dataSource: ReportDataSource;
}

export type ReportSchema = {
  [sectionKey: string]: ReportSection;
};
