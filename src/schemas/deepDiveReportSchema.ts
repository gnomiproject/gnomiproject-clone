
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
  }
};
