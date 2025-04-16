
// Define the archetype families and their properties
export type ArchetypeFamily = {
  id: 'a' | 'b' | 'c';
  name: string;
  description: string;
  commonTraits: string[];
  hexColor?: string; // Optional field for precise hex color
};

// Define valid archetype IDs
export type ArchetypeId = 'a1' | 'a2' | 'a3' | 'b1' | 'b2' | 'b3' | 'c1' | 'c2' | 'c3';

// Define archetype color type
export type ArchetypeColor = string;

// Basic archetype information
export type Archetype = {
  id: ArchetypeId;
  familyId: 'a' | 'b' | 'c';
  name: string;
  shortDescription: string;
  longDescription: string;
  characteristics: string[];
  strategicPriorities: {
    primaryFocus: string;
    secondaryPriorities: string[];
    keyOpportunities: string[];
  };
  riskScore: number;
  riskVariance: number;
  primaryRiskDriver: string;
  color: ArchetypeColor;
  hexColor?: string;
};

// Archetype summary for overview displays
export type ArchetypeSummary = {
  id: ArchetypeId;
  familyId: 'a' | 'b' | 'c';
  name: string;
  familyName: string;
  description: string;
  keyCharacteristics: string[];
};

// Structure for key statistics
export type KeyStatistic = {
  value: string;
  trend: 'up' | 'down' | 'neutral';
};

// Structure for strategic priorities
export type StrategicPriority = {
  number: number | string;
  title: string;
  description: string;
};

// Structure for cost savings
export type CostSaving = {
  title: string;
  description: string;
  potentialSavings?: string;
};

// Structure for risk profile
export type RiskProfile = {
  score: string;
  comparison: string;
  conditions: Array<{
    name: string;
    value: string;
    barWidth: string;
  }>;
};

// Structure for SWOT analysis
export type SwotAnalysis = {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
};

// Enhanced data for detailed archetype information
export type EnhancedArchetypeData = {
  overview?: string;
  strategicPriorities: StrategicPriority[];
  costSavings: CostSaving[];
  riskProfile: RiskProfile;
  swot: SwotAnalysis;
};

// Standard archetype data
export type StandardArchetypeData = {
  fullDescription: string;
  overview: string;
  keyCharacteristics: string[];
  keyInsights: string[];
  keyStatistics: Record<string, KeyStatistic>;
};

// Summary archetype data
export type SummaryArchetypeData = {
  description: string;
  keyCharacteristics?: string[];
};

// Full detailed archetype data
export type ArchetypeDetailedData = {
  id: ArchetypeId;
  familyId: 'a' | 'b' | 'c';
  name: string;
  familyName: string;
  color: ArchetypeColor;
  hexColor?: string;
  summary: SummaryArchetypeData;
  standard: StandardArchetypeData;
  enhanced?: EnhancedArchetypeData;
};

// Metrics for archetypes
export type ArchetypeMetrics = {
  archetypeId: ArchetypeId;
  paidPEPY: number;
  paidPEPYVariance: number;
  paidPMPY: number;
  paidPMPYVariance: number;
  paidAllowedRatio: number;
  averageFamilySize: number;
  specialistVisitsPer1K: number;
  inpatientAdmitsPer1K: number;
  emergencyVisitsPer1K: number;
  sdohScore: number;
  riskCostRatio: number;
};

// Distinctive traits for archetypes
export type DistinctiveTraits = {
  archetypeId: ArchetypeId;
  diseasePatterns: Array<{ condition: string; variance: number }>;
  utilizationPatterns: Array<{ category: string; variance: number }>;
  uniqueInsights: string[];
};
