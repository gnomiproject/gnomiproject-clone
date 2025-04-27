
import { ReportSchema, ReportType } from "@/types/reports";
import { insightReportSchema } from "@/schemas/insightReportSchema";
import { deepDiveReportSchema } from "@/schemas/deepDiveReportSchema";

// Define mapping between insight and deep dive sections
export const sectionMappings = {
  overview: ['archetypeProfile'],
  metrics: ['demographics', 'costAnalysis', 'utilizationPatterns'],
  swot: ['swotAnalysis'],
  diseaseAndCare: ['diseaseManagement', 'careGaps'],
  recommendations: ['strategicRecommendations']
} as const;

// Get all fields for a specific section in the insight report
export const getInsightFields = (sectionKey: string): string[] => {
  return insightReportSchema[sectionKey]?.fields || [];
};

// Get all fields for a specific section in the deep dive report
export const getDeepDiveFields = (sectionKey: string): string[] => {
  return deepDiveReportSchema[sectionKey]?.fields || [];
};

// Get the data source for a specific report type and section
export const getReportDataSource = (reportType: ReportType, sectionKey: string): string | undefined => {
  const schema = reportType === 'insight' ? insightReportSchema : deepDiveReportSchema;
  return schema[sectionKey]?.dataSource;
};

// Find fields that are shared between insight and deep dive sections
export const findSharedFields = (insightSection: string, deepDiveSection: string): string[] => {
  const insightFields = getInsightFields(insightSection);
  const deepDiveFields = getDeepDiveFields(deepDiveSection);
  
  return insightFields.filter(field => deepDiveFields.includes(field));
};

// Get corresponding deep dive sections for an insight section
export const getCorrespondingDeepDiveSections = (insightSection: string): readonly string[] => {
  return sectionMappings[insightSection as keyof typeof sectionMappings] || [];
};

// Get all fields from corresponding deep dive sections for an insight section
export const getMappedDeepDiveFields = (insightSection: string): string[] => {
  const deepDiveSections = getCorrespondingDeepDiveSections(insightSection);
  return [...deepDiveSections].flatMap(section => getDeepDiveFields(section));
};

// Helper to check if a field exists in both report types
export const isSharedField = (fieldName: string): boolean => {
  const insightFields = Object.values(insightReportSchema).flatMap(section => section.fields);
  const deepDiveFields = Object.values(deepDiveReportSchema).flatMap(section => section.fields);
  
  return insightFields.includes(fieldName) && deepDiveFields.includes(fieldName);
};
