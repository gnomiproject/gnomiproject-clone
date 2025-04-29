export interface AssessmentResult {
  primaryArchetype?: string;
  secondaryArchetype?: string;
  tertiaryArchetype?: string;
  percentageMatch?: number;
  resultTier?: string;
  exactData?: {
    employeeCount?: number;
    [key: string]: any;
  };
  [key: string]: any;
}
