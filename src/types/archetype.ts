
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

// Add a JSON type definition that will help with Supabase's data
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface ArchetypeDetailedData {
  id: ArchetypeId;
  name: string;
  familyId: FamilyId;
  familyName?: string;
  family_name?: string; // Added for compatibility with level3_report_data
  color?: string;
  hexColor?: string;
  short_description?: string;
  long_description?: string;
  key_characteristics?: string[];
  industries?: string; // Added for compatibility with level3_report_data
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
    swot: {
      strengths: string[];
      weaknesses: string[];
      opportunities: string[];
      threats: string[];
    };
    strategicPriorities: any[];
    costSavings: any[];
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
  // Add full compatibility with ArchetypeDetailed
  family_id?: FamilyId;
  swot?: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  swot_analysis?: {
    strengths: string[] | Json;
    weaknesses: string[] | Json;
    opportunities: string[] | Json;
    threats: string[] | Json;
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
  
  // Add standalone properties for SWOT analysis 
  strengths?: string[] | Json;
  weaknesses?: string[] | Json;
  opportunities?: string[] | Json;
  threats?: string[] | Json;
  
  // Add missing properties needed by components
  fullDescription?: string;
  keyFindings?: string[];
  
  // Add properties for compatibility with level4_deepdive_report_data
  // These are the fields we need from the database tables
  archetype_id?: string;  // Add this property to fix the type error
  archetype_name?: string; // Add this property to fix the type error
  
  // New properties from level3_report_data with correct naming
  // Demographics metrics
  "Demo_Average Family Size"?: number;
  "Demo_Average Age"?: number;
  "Demo_Average Employees"?: number;
  "Demo_Average States"?: number;
  "Demo_Average Percent Female"?: number;
  
  // Utilization metrics
  "Util_Emergency Visits per 1k Members"?: number;
  "Util_Specialist Visits per 1k Members"?: number;
  "Util_Inpatient Admits per 1k Members"?: number;
  "Util_Percent of Members who are Non-Utilizers"?: number;
  
  // Risk metrics
  "Risk_Average Risk Score"?: number;
  "SDOH_Average SDOH"?: number;
  
  // Cost metrics
  "Cost_Medical & RX Paid Amount PEPY"?: number;
  "Cost_Medical & RX Paid Amount PMPY"?: number;
  "Cost_Avoidable ER Potential Savings PMPY"?: number;
  "Cost_Medical Paid Amount PEPY"?: number;
  "Cost_RX Paid Amount PEPY"?: number;
  
  // Disease metrics
  "Dise_Heart Disease Prevalence"?: number;
  "Dise_Type 2 Diabetes Prevalence"?: number;
  "Dise_Mental Health Disorder Prevalence"?: number;
  "Dise_Substance Use Disorder Prevalence"?: number;
  
  // Care gap metrics
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
