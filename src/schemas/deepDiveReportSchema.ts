import { ReportSchema } from "@/types/reports";

/**
 * Schema definition for the Deep Dive Report type.
 * This represents the comprehensive, detailed analysis report that provides
 * in-depth metrics and insights for an archetype. It extends the insight
 * report with additional detailed sections and metrics.
 */
export const deepDiveReportSchema: ReportSchema = {
  // Detailed archetype profile information
  archetypeProfile: {
    title: "Archetype Profile",
    fields: [
      // Basic identification and classification
      "archetype_name",
      "family_name", 
      "family_id",
      "long_description",
      "industries",
      "key_characteristics",
      "hex_color",
      "match_percentage",     // How closely the population matches the archetype
      "secondary_archetype"   // Secondary matching archetype if applicable
    ],
    dataSource: "level4_deepdive_report_data"
  },
  
  // Comprehensive demographics analysis
  demographics: {
    title: "Demographics",
    fields: [
      // Population size metrics
      "Demo_Average Employees",    // Mean number of employees
      "Demo_Average Members",      // Mean number of total members (including dependents)
      "Demo_Average Family Size",  // Mean family unit size
      "Demo_Average States",      // Geographic distribution
      
      // Population characteristics
      "Demo_Average Percent Female", // Gender distribution
      "Demo_Average Age",          // Age demographics
      "Demo_Average Salary"        // Income level indicators
    ],
    dataSource: "level4_deepdive_report_data"
  },
  
  // Detailed cost analysis metrics
  costAnalysis: {
    title: "Cost Analysis",
    fields: [
      // Per employee metrics
      "Cost_Medical & RX Paid Amount PEPY",  // Total healthcare costs per employee
      "Cost_Medical Paid Amount PEPY",       // Medical-only costs per employee
      "Cost_RX Paid Amount PEPY",            // Pharmacy-only costs per employee
      
      // Per member metrics
      "Cost_Specialty RX Allowed Amount PMPM", // Specialty drug costs per member per month
      "Cost_Medical & RX Paid Amount PMPY",    // Total healthcare costs per member per year
      "Cost_Medical Paid Amount PMPY",         // Medical-only costs per member per year
      "Cost_RX Paid Amount PMPY",             // Pharmacy-only costs per member per year
      
      // Savings opportunities
      "Cost_Avoidable ER Potential Savings PMPY" // Potential ER cost reduction
    ],
    dataSource: "level4_deepdive_report_data"
  },
  
  // Detailed utilization patterns
  utilizationPatterns: {
    title: "Utilization Patterns",
    fields: [
      // Primary care utilization
      "Util_PCP Visits per 1k Members",
      "Util_Specialist Visits per 1k Members",
      "Util_Emergency Visits per 1k Members",
      "Util_Urgent Care Visits per 1k Members",
      "Util_Telehealth Adoption",
      
      // Hospital utilization
      "Util_Inpatient Admits per 1k Members",
      "Util_Inpatient Days per 1k Members",
      "Util_Observational Stays per 1k Members",
      "Util_Outpatient Surgeries per 1k Members",
      
      // Ancillary services
      "Util_Lab Services per 1k Members",
      "Util_Radiology Services per 1k Members",
      
      // Population segments
      "Util_Percent of Members who are Non-Utilizers",
      "Util_Percent of Members who are High Cost Claimants",
      "Util_Percent of Allowed Amount Spent on High Cost Claimants"
    ],
    dataSource: "level4_deepdive_report_data"
  },
  
  // Comprehensive disease prevalence analysis
  diseasePrevalence: {
    title: "Disease Prevalence",
    fields: [
      // Chronic conditions
      "Dise_Heart Disease Prevalence",
      "Dise_Type 2 Diabetes Prevalence",
      "Dise_Type 1 Diabetes Prevalence",
      "Dise_Hypertension Prevalence",
      "Dise_COPD Prevalence",
      
      // Mental health conditions
      "Dise_Mental Health Disorder Prevalence",
      "Dise_Substance Use Disorder Prevalence",
      
      // Other conditions
      "Dise_Cancer Prevalence",
      "Dise_Multiple Sclerosis Prevalence",
      "Dise_Infertility Prevalence",
      "Dise_Vitamin D Deficiency Prevalence"
    ],
    dataSource: "level4_deepdive_report_data"
  },
  
  // Detailed care gaps analysis
  careGaps: {
    title: "Care Gaps",
    fields: [
      // Preventive care
      "Gaps_Wellness Visit Adults",
      "Gaps_Cancer Screening Breast",
      "Gaps_Cancer Screening Cervical",
      "Gaps_Cancer Screening Colon",
      
      // Pediatric care
      "Gaps_Wellness Visit Ages 1-2",
      "Gaps_Wellness Visit Ages 2-7",
      "Gaps_Wellness Visit Ages 7-12",
      "Gaps_Wellness Visit Ages 12-20",
      
      // Immunizations
      "Gaps_Immunization HPV",
      "Gaps_Immunization TDAP",
      "Gaps_Immunization Meningitis",
      
      // Chronic condition management
      "Gaps_Diabetes Annual Exam",
      "Gaps_Diabetes HbA1C Test",
      "Gaps_Diabetes Retinal Screening",
      "Gaps_Diabetes RX Adherence",
      
      // Mental health care
      "Gaps_Behavioral Health FU Antidepressant Med Man",
      "Gaps_Behavioral Health FU ED Visit Mental Illness",
      "Gaps_Behavioral Health FU Hospitalization Mental Illness",
      "Gaps_Behavioral Health FU ED Visit Alcohol Other Drug Abuse",
      "Gaps_Behavioral Health FU High Intensity Care SUD",
      "Gaps_Behavioral Health FU Care Children ADHDMeds"
    ],
    dataSource: "level4_deepdive_report_data"
  },
  
  // Risk factors and social determinants analysis
  riskFactors: {
    title: "Risk & SDOH Factors",
    fields: [
      "Risk_Average Risk Score",      // Overall population health risk
      "SDOH_Average SDOH",           // Overall social determinants score
      
      // Detailed SDOH metrics
      "SDOH_Average Economic Insecurity",
      "SDOH_Average Healthcare Access",
      "SDOH_Average Food Access",
      "SDOH_Average Transportation",
      "SDOH_Average Digital Access",
      "SDOH_Average Neighborhood",
      "SDOH_Average Health Literacy",
      "SDOH_Average Womens Health",
      "SDOH_Average Childcare Access",
      "SDOH_Average Amenities Access"
    ],
    dataSource: "level4_deepdive_report_data"
  },
  
  // Strategic recommendations and implementation
  strategicRecommendations: {
    title: "Strategic Recommendations",
    fields: [
      "strategic_recommendations", // Detailed action items and interventions
      "implementation_roadmap",   // Step-by-step implementation plan
      "expected_impact",         // Projected outcomes and benefits
      "success_metrics"          // KPIs for measuring success
    ],
    dataSource: "level4_deepdive_report_data"
  }
};
