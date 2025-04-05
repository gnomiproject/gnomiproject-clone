
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

// New detailed data structure with three levels
export interface ArchetypeDetailedData {
  id: ArchetypeId;
  familyId: 'a' | 'b' | 'c';
  name: string;
  familyName: string;
  color: 'orange' | 'teal' | 'yellow' | 'blue' | 'purple' | 'green' | 'red' | 'indigo' | 'pink';
  
  // Level 1: Home page card (minimal)
  summary: {
    description: string;
    keyCharacteristics: string[];
  };
  
  // Level 2: Archetype detail page (medium detail)
  standard: {
    fullDescription: string;
    keyCharacteristics: string[];
    overview: string;
    keyStatistics: {
      emergencyUtilization: {
        value: string;
        trend: 'up' | 'down' | 'neutral';
      };
      specialistUtilization: {
        value: string;
        trend: 'up' | 'down' | 'neutral';
      };
      healthcareSpend: {
        value: string;
        trend: 'up' | 'down' | 'neutral';
      };
      [key: string]: {
        value: string;
        trend: 'up' | 'down' | 'neutral';
      };
    };
    keyInsights: string[];
  };
  
  // Level 3: Full report (comprehensive detail)
  enhanced: {
    riskProfile: {
      score: string;
      comparison: string;
      conditions: Array<{
        name: string;
        value: string;
        barWidth: string;
      }>;
    };
    strategicPriorities: Array<{
      number: string;
      title: string;
      description: string;
    }>;
    swot: {
      strengths: string[];
      weaknesses: string[];
      opportunities: string[];
      threats: string[];
    };
    costSavings: Array<{
      title: string;
      description: string;
    }>;
  };
}
