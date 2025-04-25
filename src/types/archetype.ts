
export type ArchetypeId = 'a1' | 'a2' | 'a3' | 'b1' | 'b2' | 'b3' | 'c1' | 'c2' | 'c3';

export type ArchetypeColor = 'archetype-a1' | 'archetype-a2' | 'archetype-a3' | 'archetype-b1' | 'archetype-b2' | 'archetype-b3' | 'archetype-c1' | 'archetype-c2' | 'archetype-c3';

export interface ArchetypeSummary {
  id: ArchetypeId;
  familyId: 'a' | 'b' | 'c';
  name: string;
  description?: string;
  color?: string;
  key_characteristics?: string[];
}

export interface ArchetypeDetailedData {
  id: ArchetypeId;
  familyId: 'a' | 'b' | 'c';
  name: string;
  familyName: string;
  color: string;
  hexColor: string;
  fullDescription: string;
  keyFindings: string[];
  summary?: {
    description: string;
    keyCharacteristics: string[];
  };
  standard?: {
    fullDescription: string;
    keyCharacteristics: string[];
    overview: string;
    keyStatistics: {
      emergencyUtilization: { value: string; trend: 'up' | 'down' | 'neutral' };
      specialistUtilization: { value: string; trend: 'up' | 'down' | 'neutral' };
      healthcareSpend: { value: string; trend: 'up' | 'down' | 'neutral' };
      familySize?: { value: string; trend: 'up' | 'down' | 'neutral' };
      [key: string]: { value: string; trend: 'up' | 'down' | 'neutral' } | undefined;
    };
    keyInsights: string[];
  };
  enhanced?: {
    riskProfile?: {
      score: string;
      comparison: string;
      conditions?: Array<{
        name: string;
        value: string;
        barWidth: string;
      }>;
    };
    strategicPriorities?: Array<{
      number: string;
      title: string;
      description: string;
    }>;
    swot?: {
      strengths: string[];
      weaknesses: string[];
      opportunities: string[];
      threats: string[];
    };
    costSavings?: Array<{
      title: string;
      description: string;
      potentialSavings?: string;
    }>;
  };
}

export interface ArchetypeFamily {
  id: 'a' | 'b' | 'c';
  name: string;
  hexColor: string;
  description: string;
  commonTraits: string[];
}

export interface Archetype {
  id: ArchetypeId;
  familyId: 'a' | 'b' | 'c';
  name: string;
  description?: string;
  shortDescription?: string;
  longDescription?: string;
  hexColor?: string;
  color?: string;
  characteristics?: string[];
  strategicPriorities?: {
    primaryFocus: string;
    secondaryPriorities: string[];
    keyOpportunities: string[];
  };
  riskScore?: number;
  riskVariance?: number;
  primaryRiskDriver?: string;
}

export interface ArchetypeMetrics {
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
}

export interface DistinctiveTraits {
  archetypeId: ArchetypeId;
  diseasePatterns: Array<{ condition: string; variance: number }>;
  utilizationPatterns: Array<{ category: string; variance: number }>;
  uniqueInsights: string[];
}
