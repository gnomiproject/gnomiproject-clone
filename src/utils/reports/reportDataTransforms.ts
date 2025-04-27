
import { ArchetypeDetailedData } from '@/types/archetype';

// Interface for average data
export interface AverageData {
  archetype_id: string;
  archetype_name: string;
  "Demo_Average Age": number;
  "Demo_Average Family Size": number;
  "Risk_Average Risk Score": number;
  "Cost_Medical & RX Paid Amount PMPY": number;
  [key: string]: any; // Allow for additional metrics
}

// Interface for processed report data
export interface ProcessedReportData {
  reportData: ArchetypeDetailedData | null;
  averageData: AverageData;
}

// Create default average data for reports
export const createDefaultAverageData = (): AverageData => ({
  archetype_id: 'All_Average',
  archetype_name: 'Population Average',
  "Demo_Average Age": 40,
  "Demo_Average Family Size": 3.0,
  "Risk_Average Risk Score": 1.0,
  "Cost_Medical & RX Paid Amount PMPY": 5000
});

// Process report data into correct format
export const processReportData = (data: ArchetypeDetailedData | null): ProcessedReportData => {
  if (!data) {
    return {
      reportData: null,
      averageData: createDefaultAverageData()
    };
  }

  return {
    reportData: data,
    averageData: createDefaultAverageData()
  };
};
