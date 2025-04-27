
import { ReportSchema } from "@/types/reports";

export const insightReportSchema: ReportSchema = {
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
  }
};
