
import { ReportSchema, ReportField, ReportSection, ReportType } from "@/types/reports";
import { insightReportSchema } from "@/schemas/insightReportSchema";
import { deepDiveReportSchema } from "@/schemas/deepDiveReportSchema";
import { ReportDataSource, getTypeValidDataSource } from "./dataSourceUtils";

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

export const getDataSource = (type: ReportType): ReportDataSource => {
  return getTypeValidDataSource(type);
};
