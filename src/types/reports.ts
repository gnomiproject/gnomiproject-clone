
/** Type of report being generated */
export type ReportType = "insight" | "deepDive";

/** Individual field identifier in a report section */
export type ReportField = string;

/**
 * Represents a section within a report schema
 * Each section contains a set of related fields and metadata
 */
export interface ReportSection {
  /** Display title for the section */
  title: string;
  /** Array of field identifiers that belong to this section */
  fields: ReportField[];
  /** The database table/view where this section's data is sourced from */
  dataSource: string;
}

/**
 * Complete schema definition for a report type
 * Maps section keys to their corresponding section definitions
 */
export interface ReportSchema {
  [sectionKey: string]: ReportSection;
}

/**
 * Results from a report generation operation
 */
export interface GenerationResult {
  /** Total number of reports that were attempted */
  total: number;
  /** Number of reports that were processed */
  processed: number;
  /** Number of reports that were successfully generated */
  succeeded: number;
  /** Number of reports that failed to generate */
  failed: number;
  /** Array of archetype IDs that were processed */
  archetypeIds: string[];
  /** Optional array of error messages if any failures occurred */
  errors?: string[];
}

/**
 * Strategic recommendation interface used in reports
 */
export interface StrategicRecommendation {
  recommendation_number?: number;
  title?: string;
  name?: string;
  description?: string;
  content?: string;
  metrics_references?: string[];
  metrics?: string[];
}

/**
 * Success metric interface used in reports
 */
export interface SuccessMetric {
  name?: string;
  title?: string;
  description?: string;
}
