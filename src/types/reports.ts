
// If this file doesn't exist yet, we'll create it

export type ReportType = "insight" | "deepDive";

export type ReportField = string;

export interface ReportSection {
  title: string;
  fields: ReportField[];
  dataSource: string;
}

export interface ReportSchema {
  [sectionKey: string]: ReportSection;
}
