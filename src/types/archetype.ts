
export type ArchetypeFamily = {
  id: 'a' | 'b' | 'c';
  name: string;
  description: string;
  commonTraits: string[];
};

export type ArchetypeId = 
  | 'a1' | 'a2' | 'a3' 
  | 'b1' | 'b2' | 'b3'
  | 'c1' | 'c2' | 'c3';

export type Archetype = {
  id: ArchetypeId;
  name: string;
  familyId: 'a' | 'b' | 'c';
  shortDescription: string;
  longDescription: string;
  characteristics: string[];
  strategicPriorities: {
    primaryFocus: string;
    secondaryPriorities: string[];
    keyOpportunities: string[];
  };
  riskScore: number; // 1-10 scale
  riskVariance: number; // Percentage variance from average
  primaryRiskDriver: string;
  color: 'orange' | 'teal' | 'yellow' | 'blue' | 'purple' | 'green' | 'red' | 'indigo' | 'pink';
};

export type ArchetypeMetrics = {
  archetypeId: ArchetypeId;
  paidPEPY: number;
  paidPEPYVariance: number; // Percentage variance from average
  paidPMPY: number;
  paidPMPYVariance: number;
  paidAllowedRatio: number;
  averageFamilySize: number;
  specialistVisitsPer1K: number;
  inpatientAdmitsPer1K: number;
  emergencyVisitsPer1K: number;
  sdohScore: number; // 1-10 scale
  riskCostRatio: number;
};

export type DistinctiveTraits = {
  archetypeId: ArchetypeId;
  diseasePatterns: {
    condition: string;
    variance: number; // Percentage variance from average
  }[];
  utilizationPatterns: {
    category: string;
    variance: number;
  }[];
  uniqueInsights: string[];
};

