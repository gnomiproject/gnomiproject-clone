
// Add or update these types in the existing file

export interface GenerationResult {
  total: number;
  succeeded: number;
  failed: number;
  archetypeIds: string[];
  errors?: string[];
}

export interface ReportGenerationResults {
  total: number;
  processed: number;
  succeeded: number;
  failed: number;
  archetypeIds: string[];
  errors: string[];
}
