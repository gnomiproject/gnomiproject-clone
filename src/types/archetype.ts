
export type ArchetypeId = 'a1' | 'a2' | 'a3' | 'b1' | 'b2' | 'b3' | 'c1' | 'c2' | 'c3';
export type FamilyId = 'a' | 'b' | 'c';

// Core table interfaces
export interface Archetype {
  id: ArchetypeId;
  name: string;
  family_id: FamilyId;
  short_description?: string;
  long_description?: string;
  hex_color?: string;
  key_characteristics?: string[];
  industries?: string;
}

export interface ArchetypeFamily {
  id: FamilyId;
  name: string;
  short_description: string;
  hex_color?: string;
  common_traits?: string[];
  industries?: string;
  long_description?: string;
}

// Analysis table interfaces
export interface ArchetypeDetailed extends Archetype {
  swot?: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  distinctive_metrics?: Array<{
    metric: string;
    category: string;
    archetype_value: number;
    archetype_average: number;
    difference: number;
    significance?: string;
  }>;
  strategic_recommendations?: Array<{
    recommendation_number: number;
    title: string;
    description: string;
    metrics_references?: any[];
  }>;
}

export interface ArchetypeDeepDive {
  archetype_id: ArchetypeId;
  cost_analysis?: string;
  utilization_patterns?: string;
  care_gaps?: string;
  recommendations?: string;
  benefits_structure?: string;
  demographic_insights?: string;
  disease_prevalence?: string;
}
