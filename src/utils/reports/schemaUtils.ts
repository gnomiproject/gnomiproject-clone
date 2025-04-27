
import { ReportSchema, ReportField, ReportSection } from "@/types/reports";
import { insightReportSchema } from "@/schemas/insightReportSchema";
import { deepDiveReportSchema } from "@/schemas/deepDiveReportSchema";

export type ReportType = "insight" | "deepDive";

export const getReportSchema = (type: ReportType): ReportSchema => {
  return type === "insight" ? insightReportSchema : deepDiveReportSchema;
};

export const getReportSection = (type: ReportType, sectionKey: string): ReportSection | undefined => {
  const schema = getReportSchema(type);
  return schema[sectionKey];
};

export const getReportFields = (type: ReportType, sectionKey: string): ReportField[] => {
  const section = getReportSection(type, sectionKey);
  return section?.fields || [];
};

export const getDataSource = (type: ReportType, sectionKey: string): string | undefined => {
  const section = getReportSection(type, sectionKey);
  return section?.dataSource;
};
