
import { ReportSchema } from "@/types/reports";

export const insightReportSchema: ReportSchema = {
  // Overview section
  overview: {
    title: "Archetype Overview",
    fields: [
      "archetype_name",
      "family_name", 
      "family_id",
      "long_description",
      "industries",
      "key_characteristics",
      "hex_color"
    ],
    dataSource: "level3_report_data"
  },
  
  // Key Metrics section
  metrics: {
    title: "Key Metrics",
    fields: [
      "Demo_Average Family Size",
      "Demo_Average Age",
      "Demo_Average States",
      "Util_Emergency Visits per 1k Members",
      "Util_Specialist Visits per 1k Members",
      "Util_Inpatient Admits per 1k Members",
      "Util_Percent of Members who are Non-Utilizers",
      "Risk_Average Risk Score",
      "SDOH_Average SDOH",
      "Cost_Medical & RX Paid Amount PEPY",
      "Cost_Avoidable ER Potential Savings PMPY"
    ],
    dataSource: "level3_report_data"
  },
  
  // SWOT Analysis section
  swot: {
    title: "SWOT Analysis",
    fields: [
      "strengths",
      "weaknesses",
      "opportunities",
      "threats"
    ],
    dataSource: "level3_report_data"
  },
  
  // Disease & Care Management section
  diseaseAndCare: {
    title: "Disease & Care Management",
    fields: [
      "Dise_Heart Disease Prevalence",
      "Dise_Type 2 Diabetes Prevalence",
      "Dise_Mental Health Disorder Prevalence",
      "Dise_Substance Use Disorder Prevalence",
      "Gaps_Diabetes RX Adherence",
      "Gaps_Behavioral Health FU ED Visit Mental Illness",
      "Gaps_Cancer Screening Breast",
      "Gaps_Wellness Visit Adults"
    ],
    dataSource: "level3_report_data"
  },
  
  // Strategic Recommendations section
  recommendations: {
    title: "Strategic Recommendations",
    fields: [
      "strategic_recommendations"
    ],
    dataSource: "level3_report_data"
  }
};
