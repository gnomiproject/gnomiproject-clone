
import { ReportSchema } from "@/types/reports";

export const deepDiveReportSchema: ReportSchema = {
  archetypeProfile: {
    title: "Archetype Profile",
    fields: [
      "archetype_name",
      "family_name", 
      "family_id",
      "long_description",
      "industries",
      "key_characteristics",
      "hex_color",
      "match_percentage",
      "secondary_archetype"
    ],
    dataSource: "level4_deepdive_report_data"
  },
  
  demographics: {
    title: "Demographics",
    fields: [
      "Demo_Average Employees",
      "Demo_Average Members",
      "Demo_Average Family Size",
      "Demo_Average States",
      "Demo_Average Percent Female",
      "Demo_Average Age",
      "Demo_Average Salary"
    ],
    dataSource: "level4_deepdive_report_data"
  },

  costAnalysis: {
    title: "Cost Analysis",
    fields: [
      "Cost_Medical & RX Paid Amount PEPY",
      "Cost_Medical Paid Amount PEPY",
      "Cost_RX Paid Amount PEPY",
      "Cost_Specialty RX Allowed Amount PMPM",
      "Cost_Medical & RX Paid Amount PMPY",
      "Cost_Medical Paid Amount PMPY",
      "Cost_RX Paid Amount PMPY",
      "Cost_Avoidable ER Potential Savings PMPY"
    ],
    dataSource: "level4_deepdive_report_data"
  },
  
  utilizationPatterns: {
    title: "Utilization Patterns",
    fields: [
      "Util_PCP Visits per 1k Members",
      "Util_Specialist Visits per 1k Members",
      "Util_Emergency Visits per 1k Members",
      "Util_Urgent Care Visits per 1k Members",
      "Util_Telehealth Adoption",
      "Util_Inpatient Admits per 1k Members",
      "Util_Inpatient Days per 1k Members",
      "Util_Observational Stays per 1k Members",
      "Util_Outpatient Surgeries per 1k Members",
      "Util_Lab Services per 1k Members",
      "Util_Radiology Services per 1k Members",
      "Util_Percent of Members who are Non-Utilizers",
      "Util_Percent of Members who are High Cost Claimants",
      "Util_Percent of Allowed Amount Spent on High Cost Claimants"
    ],
    dataSource: "level4_deepdive_report_data"
  },
  
  diseasePrevalence: {
    title: "Disease Prevalence",
    fields: [
      "Dise_Heart Disease Prevalence",
      "Dise_Type 2 Diabetes Prevalence",
      "Dise_Type 1 Diabetes Prevalence",
      "Dise_Hypertension Prevalence",
      "Dise_COPD Prevalence",
      "Dise_Mental Health Disorder Prevalence",
      "Dise_Substance Use Disorder Prevalence",
      "Dise_Cancer Prevalence",
      "Dise_Multiple Sclerosis Prevalence",
      "Dise_Infertility Prevalence",
      "Dise_Vitamin D Deficiency Prevalence"
    ],
    dataSource: "level4_deepdive_report_data"
  },
  
  careGaps: {
    title: "Care Gaps",
    fields: [
      "Gaps_Wellness Visit Adults",
      "Gaps_Cancer Screening Breast",
      "Gaps_Cancer Screening Cervical",
      "Gaps_Cancer Screening Colon",
      "Gaps_Wellness Visit Ages 1-2",
      "Gaps_Wellness Visit Ages 2-7",
      "Gaps_Wellness Visit Ages 7-12",
      "Gaps_Wellness Visit Ages 12-20",
      "Gaps_Immunization HPV",
      "Gaps_Immunization TDAP",
      "Gaps_Immunization Meningitis",
      "Gaps_Diabetes Annual Exam",
      "Gaps_Diabetes HbA1C Test",
      "Gaps_Diabetes Retinal Screening",
      "Gaps_Diabetes RX Adherence",
      "Gaps_Hypertension Annual Exam",
      "Gaps_Hypertension RX Adherence",
      "Gaps_Hyperlipidemia RX Adherence",
      "Gaps_Behavioral Health FU Antidepressant Med Man",
      "Gaps_Behavioral Health FU ED Visit Mental Illness",
      "Gaps_Behavioral Health FU Hospitalization Mental Illness",
      "Gaps_Behavioral Health FU ED Visit Alcohol Other Drug Abuse",
      "Gaps_Behavioral Health FU High Intensity Care SUD",
      "Gaps_Behavioral Health FU Care Children ADHDMeds"
    ],
    dataSource: "level4_deepdive_report_data"
  },
  
  riskFactors: {
    title: "Risk & SDOH Factors",
    fields: [
      "Risk_Average Risk Score",
      "SDOH_Average SDOH",
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
  
  strategicRecommendations: {
    title: "Strategic Recommendations",
    fields: [
      "strategic_recommendations",
      "implementation_roadmap",
      "expected_impact",
      "success_metrics"
    ],
    dataSource: "level4_deepdive_report_data"
  }
};
