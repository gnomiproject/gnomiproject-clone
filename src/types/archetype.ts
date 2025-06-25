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
  // Add alias properties to support existing component use
  description?: string;
  commonTraits?: string[];
}

// Add a JSON type definition that will help with Supabase's data
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// Define a strongly-typed SWOT structure
export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

// Define a strongly-typed distinctive metric structure - FIXED to match database schema
export interface DistinctiveMetric {
  metric: string;
  category: string;
  value: number;          // Changed from archetype_value to match database
  average: number;        // Changed from archetype_average to match database
  difference: number;
  significance?: string;
}

// Define unique advantage structure
export interface UniqueAdvantage {
  title: string;
  description: string;
  supporting_metric?: {
    name: string;
    value: string;
    difference: string;
    significance: string;
  };
}

// Define biggest challenge structure - identical to UniqueAdvantage
export interface BiggestChallenge {
  title: string;
  description: string;
  supporting_metric?: {
    name: string;
    value: string;
    difference: string;
    significance: string;
  };
}

// Analysis table interfaces
export interface ArchetypeDetailed extends Archetype {
  swot?: SwotAnalysis;
  swot_analysis?: SwotAnalysis;
  strengths?: string[] | Json;
  weaknesses?: string[] | Json;
  opportunities?: string[] | Json;
  threats?: string[] | Json;
  distinctive_metrics?: Array<DistinctiveMetric>;
  strategic_recommendations?: Array<{
    recommendation_number: number;
    title: string;
    description: string;
    metrics_references?: any[];
  }>;
  unique_advantages?: UniqueAdvantage[];
  biggest_challenges?: BiggestChallenge[];
}

// Flexible interface for database raw data (allows Json types)
export interface ArchetypeDetailedDataRaw {
  id: ArchetypeId;
  name: string;
  familyId: FamilyId;
  familyName?: string;
  family_name?: string;
  color?: string;
  hexColor?: string;
  hex_color?: string;
  short_description?: string;
  long_description?: string;
  key_characteristics?: string[] | Json;
  industries?: string;
  summary?: {
    description: string;
    keyCharacteristics: string[];
  };
  standard?: {
    fullDescription: string;
    keyCharacteristics: string[];
    overview: string;
    keyStatistics: Record<string, any>;
    keyInsights: any[];
  };
  enhanced?: {
    swot: SwotAnalysis;
    strategicPriorities: any[];
    costSavings: any[];
    successMetrics?: any[];
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
  family_id?: FamilyId;
  swot?: SwotAnalysis | Json;
  swot_analysis?: SwotAnalysis | Json;
  strengths?: string[] | Json;
  weaknesses?: string[] | Json;
  opportunities?: string[] | Json;
  threats?: string[] | Json;
  distinctive_metrics?: Array<DistinctiveMetric> | Json;
  strategic_recommendations?: Array<{
    recommendation_number: number;
    title: string;
    description: string;
    metrics_references?: any[];
  }> | Json;
  success_metrics?: any[];
  fullDescription?: string;
  keyFindings?: string[];
  key_findings?: string[] | Json;
  executive_summary?: string;
  archetype_id?: string;
  archetype_name?: string;
  top_distinctive_metrics?: DistinctiveMetric[] | string | Json;
  detailed_metrics?: any;
  disease_prevalence?: any;
  unique_advantages?: UniqueAdvantage[] | Json;
  biggest_challenges?: BiggestChallenge[] | Json;
  
  "Demo_Average Family Size"?: number;
  "Demo_Average Age"?: number;
  "Demo_Average Employees"?: number;
  "Demo_Average States"?: number;
  "Demo_Average Percent Female"?: number;
  "Util_Emergency Visits per 1k Members"?: number;
  "Util_Specialist Visits per 1k Members"?: number;
  "Util_Inpatient Admits per 1k Members"?: number;
  "Util_Percent of Members who are Non-Utilizers"?: number;
  "Risk_Average Risk Score"?: number;
  "SDOH_Average SDOH"?: number;
  "Cost_Medical & RX Paid Amount PEPY"?: number;
  "Cost_Medical & RX Paid Amount PMPY"?: number;
  "Cost_Avoidable ER Potential Savings PMPY"?: number;
  "Cost_Medical Paid Amount PEPY"?: number;
  "Cost_RX Paid Amount PEPY"?: number;
  "Dise_Heart Disease Prevalence"?: number;
  "Dise_Type 2 Diabetes Prevalence"?: number;
  "Dise_Mental Health Disorder Prevalence"?: number;
  "Dise_Substance Use Disorder Prevalence"?: number;
  "Gaps_Diabetes RX Adherence"?: number;
  "Gaps_Behavioral Health FU ED Visit Mental Illness"?: number;
  "Gaps_Cancer Screening Breast"?: number;
  "Gaps_Wellness Visit Adults"?: number;
}

// Processed interface for application use (strongly typed)
export interface ArchetypeDetailedData {
  id: ArchetypeId;
  name: string;
  familyId: FamilyId;
  familyName?: string;
  family_name?: string;
  color?: string;
  hexColor?: string;
  hex_color?: string;
  short_description?: string;
  long_description?: string;
  key_characteristics?: string[];
  industries?: string;
  summary?: {
    description: string;
    keyCharacteristics: string[];
  };
  standard?: {
    fullDescription: string;
    keyCharacteristics: string[];
    overview: string;
    keyStatistics: Record<string, any>;
    keyInsights: any[];
  };
  enhanced?: {
    swot: SwotAnalysis;
    strategicPriorities: any[];
    costSavings: any[];
    successMetrics?: any[];
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
  family_id?: FamilyId;
  swot?: SwotAnalysis;
  swot_analysis?: SwotAnalysis;
  strengths?: string[];
  weaknesses?: string[];
  opportunities?: string[];
  threats?: string[];
  distinctive_metrics?: Array<DistinctiveMetric>;
  strategic_recommendations?: Array<{
    recommendation_number: number;
    title: string;
    description: string;
    metrics_references?: any[];
  }>;
  success_metrics?: any[];
  fullDescription?: string;
  keyFindings?: string[];
  key_findings?: string[];
  executive_summary?: string;
  archetype_id?: string;
  archetype_name?: string;
  top_distinctive_metrics?: DistinctiveMetric[] | string | Json;
  detailed_metrics?: any;
  disease_prevalence?: any;
  unique_advantages?: UniqueAdvantage[];
  biggest_challenges?: BiggestChallenge[];
  
  "Demo_Average Family Size"?: number;
  "Demo_Average Age"?: number;
  "Demo_Average Employees"?: number;
  "Demo_Average States"?: number;
  "Demo_Average Percent Female"?: number;
  "Util_Emergency Visits per 1k Members"?: number;
  "Util_Specialist Visits per 1k Members"?: number;
  "Util_Inpatient Admits per 1k Members"?: number;
  "Util_Percent of Members who are Non-Utilizers"?: number;
  "Risk_Average Risk Score"?: number;
  "SDOH_Average SDOH"?: number;
  "Cost_Medical & RX Paid Amount PEPY"?: number;
  "Cost_Medical & RX Paid Amount PMPY"?: number;
  "Cost_Avoidable ER Potential Savings PMPY"?: number;
  "Cost_Medical Paid Amount PEPY"?: number;
  "Cost_RX Paid Amount PEPY"?: number;
  "Dise_Heart Disease Prevalence"?: number;
  "Dise_Type 2 Diabetes Prevalence"?: number;
  "Dise_Mental Health Disorder Prevalence"?: number;
  "Dise_Substance Use Disorder Prevalence"?: number;
  "Gaps_Diabetes RX Adherence"?: number;
  "Gaps_Behavioral Health FU ED Visit Mental Illness"?: number;
  "Gaps_Cancer Screening Breast"?: number;
  "Gaps_Wellness Visit Adults"?: number;
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

// Add missing ArchetypeSummary type for components that need it
export interface ArchetypeSummary {
  id: ArchetypeId;
  name: string;
  familyId: FamilyId;
  familyName?: string;
  description?: string;
  keyCharacteristics?: string[];
  color?: string;
  hexColor?: string;
  short_description?: string;
  key_characteristics?: string[];
  family_id?: FamilyId;
}
