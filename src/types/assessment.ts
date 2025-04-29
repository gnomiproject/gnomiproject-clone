
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

export interface AssessmentQuestion {
  id: string;
  text: string;
  type?: 'single-select' | 'multi-select'; // Default is single-select if not specified
  options: {
    id: string;
    text: string;
    archetypeWeights: {
      [key: string]: number;
    };
  }[];
}
