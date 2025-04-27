
import { ReportSchema } from "@/types/reports";

/**
 * Schema definition for the Insight Report type.
 * This represents the high-level overview report that provides key metrics,
 * analysis, and recommendations for an archetype.
 */
export const insightReportSchema: ReportSchema = {
  // Overview section - General archetype information
  overview: {
    title: "Archetype Overview",
    fields: [
      // Basic archetype identification and classification
      "archetype_name",     // Display name of the archetype
      "family_name",        // Name of the archetype family this belongs to
      "family_id",          // Unique identifier for the archetype family
      "long_description",   // Detailed description of the archetype
      "industries",         // Common industries represented in this archetype
      "key_characteristics", // Notable traits and characteristics
      "hex_color"          // Color code used for UI representation
    ],
    dataSource: "level3_report_data"
  },
  
  // Key Metrics section - Important performance indicators
  metrics: {
    title: "Key Metrics",
    fields: [
      // Demographics
      "Demo_Average Family Size",    // Average number of members per family unit
      "Demo_Average Age",           // Mean age of population
      "Demo_Average States",        // Geographic spread across states
      
      // Utilization metrics
      "Util_Emergency Visits per 1k Members",      // ER visits normalized per 1000 members
      "Util_Specialist Visits per 1k Members",     // Specialist consultation rate
      "Util_Inpatient Admits per 1k Members",     // Hospital admission rate
      "Util_Percent of Members who are Non-Utilizers", // Members not using services
      
      // Risk and social determinants
      "Risk_Average Risk Score",    // Population health risk assessment
      "SDOH_Average SDOH",         // Social Determinants of Health score
      
      // Cost metrics
      "Cost_Medical & RX Paid Amount PEPY",   // Total healthcare spend per employee per year
      "Cost_Avoidable ER Potential Savings PMPY" // Potential savings from reducing avoidable ER visits
    ],
    dataSource: "level3_report_data"
  },
  
  // SWOT Analysis section - Strengths, Weaknesses, Opportunities, Threats
  swot: {
    title: "SWOT Analysis",
    fields: [
      "strengths",         // Array of positive attributes and advantages
      "weaknesses",        // Array of areas needing improvement
      "opportunities",     // Array of potential growth or improvement areas
      "threats"           // Array of potential risks or challenges
    ],
    dataSource: "level3_report_data"
  },
  
  // Disease & Care Management section - Health conditions and care metrics
  diseaseAndCare: {
    title: "Disease & Care Management",
    fields: [
      // Disease prevalence metrics (as percentages)
      "Dise_Heart Disease Prevalence",
      "Dise_Type 2 Diabetes Prevalence",
      "Dise_Mental Health Disorder Prevalence",
      "Dise_Substance Use Disorder Prevalence",
      
      // Care gap metrics (as percentages)
      "Gaps_Diabetes RX Adherence",             // Medication adherence for diabetes
      "Gaps_Behavioral Health FU ED Visit Mental Illness", // Follow-up after mental health ER visits
      "Gaps_Cancer Screening Breast",           // Breast cancer screening compliance
      "Gaps_Wellness Visit Adults"              // Annual wellness visit completion
    ],
    dataSource: "level3_report_data"
  },
  
  // Strategic Recommendations section - Action items and suggestions
  recommendations: {
    title: "Strategic Recommendations",
    fields: [
      "strategic_recommendations" // Array of structured recommendations with titles and descriptions
    ],
    dataSource: "level3_report_data"
  }
};
