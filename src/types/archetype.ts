
export type ArchetypeId = 'a1' | 'a2' | 'a3' | 'b1' | 'b2' | 'b3' | 'c1' | 'c2' | 'c3';

export type ArchetypeColor = 'archetype-a1' | 'archetype-a2' | 'archetype-a3' | 'archetype-b1' | 'archetype-b2' | 'archetype-b3' | 'archetype-c1' | 'archetype-c2' | 'archetype-c3';

export interface Archetype {
  id: ArchetypeId;
  familyId: 'a' | 'b' | 'c';
  name: string;
  description?: string;
  color?: string;
  characteristics?: string[];
  hexColor?: string;
}

export interface ArchetypeFamily {
  id: 'a' | 'b' | 'c';
  name: string;
  hexColor: string;
  description: string;
  commonTraits: string[];
}

// Interface for Core_Archetype_Overview table data
export interface ArchetypeOverview {
  id: ArchetypeId;
  name: string;
  family_id: 'a' | 'b' | 'c';
  short_description?: string;
  long_description?: string;
  hex_color?: string;
  key_characteristics?: string[];
  industries?: string;
}

// Add ArchetypeSummary for FamilyDetailView
export interface ArchetypeSummary {
  id: ArchetypeId;
  familyId: 'a' | 'b' | 'c';
  name: string;
  description: string;
  color?: string;
  hexColor?: string;
  familyName?: string;
  key_characteristics?: string[];
}

// Add ArchetypeDetailedData for components that need detailed data
export interface ArchetypeDetailedData {
  id: ArchetypeId;
  familyId: 'a' | 'b' | 'c';
  name: string;
  familyName?: string;
  color?: string;
  hexColor?: string;
  short_description?: string;
  long_description?: string;
  key_characteristics?: string[];
  
  // For backward compatibility with existing components
  summary?: {
    description: string;
    keyCharacteristics?: string[];
  };
  standard?: {
    fullDescription?: string;
    keyCharacteristics?: string[];
    overview?: string;
    keyStatistics?: Record<string, { value: string; trend?: 'up' | 'down' | 'neutral' }>;
    keyInsights?: string[];
  };
  enhanced?: {
    swot?: {
      strengths: string[];
      weaknesses: string[];
      opportunities: string[];
      threats: string[];
    };
    strategicPriorities?: Array<{
      number: number;
      title: string;
      description: string;
    }>;
    costSavings?: Array<{
      title: string;
      description: string;
      potentialSavings?: string;
    }>;
    riskProfile?: {
      score: string;
      comparison: string;
      conditions: Array<{
        name: string;
        value: string;
        barWidth: string;
      }>;
    };
  };
}

// Add this for backward compatibility
export interface ArchetypeMetrics {
  id: string;
  metrics: Record<string, number>;
}

// Add this for backward compatibility
export interface DistinctiveTraits {
  archetypeId: string;
  traits: Array<{
    metric: string;
    value: number;
    average: number;
    difference: number;
    category?: string;
    definition?: string;
  }>;
}
