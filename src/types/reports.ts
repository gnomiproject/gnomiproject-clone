
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

export interface GenerationResult {
  total: number;
  processed: number;
  succeeded: number;
  failed: number;
  archetypeIds: string[];
  errors?: string[];
}
