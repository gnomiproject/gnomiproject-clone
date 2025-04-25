
export type ArchetypeId = 'a1' | 'a2' | 'a3' | 'b1' | 'b2' | 'b3' | 'c1' | 'c2' | 'c3';

export type ArchetypeColor = 'archetype-a1' | 'archetype-a2' | 'archetype-a3' | 'archetype-b1' | 'archetype-b2' | 'archetype-b3' | 'archetype-c1' | 'archetype-c2' | 'archetype-c3';

export interface Archetype {
  id: ArchetypeId;
  familyId: 'a' | 'b' | 'c';
  name: string;
  description?: string;
  color?: string;
  characteristics?: string[];
  hexColor?: string; // Added hexColor
}

export interface ArchetypeSummary {
  id: ArchetypeId;
  familyId: 'a' | 'b' | 'c';
  name: string;
  description?: string;
  key_characteristics?: string[];
}

// Extended interface for display in results page
export interface ArchetypeDetailedData {
  id: ArchetypeId;
  familyId: 'a' | 'b' | 'c';
  name: string;
  familyName: string;
  color: string;
  hexColor: string;
  short_description: string;
  long_description: string;
  key_characteristics: string[];
  
  // Add fields being used in components
  summary?: {
    description: string;
    keyCharacteristics: string[];
  };
  
  standard?: {
    fullDescription: string;
    keyCharacteristics: string[];
    overview: string;
    keyStatistics: {
      [key: string]: {
        value: string;
        trend: 'up' | 'down' | 'neutral';
      };
    };
    keyInsights: string[];
  };
  
  enhanced?: {
    riskProfile?: {
      score: string;
      comparison: string;
      conditions?: {
        name: string;
        value: string;
        barWidth: string;
      }[];
    };
    strategicPriorities?: {
      number: string;
      title: string;
      description: string;
    }[];
    swot?: {
      strengths: string[];
      weaknesses: string[];
      opportunities: string[];
      threats: string[];
    };
    costSavings?: {
      title: string;
      description: string;
      potentialSavings?: string;
    }[];
  };
}

export interface ArchetypeFamily {
  id: 'a' | 'b' | 'c';
  name: string;
  hexColor: string;
  description: string;
  commonTraits: string[];
}

// Add any missing type exports used elsewhere
export interface ArchetypeMetrics {
  id: string;
  metric: string;
  value: number;
  category: string;
}

export interface DistinctiveTraits {
  id: string;
  trait: string;
  value: string;
  category: string;
}
