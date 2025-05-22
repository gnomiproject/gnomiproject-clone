
import { ArchetypeDetailedData } from '@/types/archetype';
import { supabase } from '@/integrations/supabase/client';

// Interface for average data
export interface AverageData {
  archetype_id: string;
  archetype_name: string;
  "Demo_Average Age": number;
  "Demo_Average Family Size": number;
  "Demo_Average Employees": number;
  "Demo_Average Members": number;
  "Demo_Average Percent Female": number;
  "Demo_Average Salary": number;
  "Demo_Average States": number;
  "Risk_Average Risk Score": number;
  "Cost_Medical & RX Paid Amount PMPY": number;
  "Cost_Avoidable ER Potential Savings PMPY": number;
  "Cost_Medical Paid Amount PEPY": number;
  "Cost_RX Paid Amount PEPY": number;
  "Cost_Specialty RX Allowed Amount PMPM": number;
  [key: string]: any; // Allow for additional metrics
}

// Interface for processed report data
export interface ProcessedReportData {
  reportData: ArchetypeDetailedData | null;
  averageData: AverageData;
}

// Create default average data for reports as a fallback - with extended fields
export const createDefaultAverageData = (): AverageData => ({
  archetype_id: 'All_Average',
  archetype_name: 'Population Average',
  "Demo_Average Age": 40,
  "Demo_Average Family Size": 3.0,
  "Demo_Average Employees": 5000,
  "Demo_Average Members": 15000,
  "Demo_Average Percent Female": 0.51,
  "Demo_Average Salary": 75000,
  "Demo_Average States": 10,
  "Risk_Average Risk Score": 1.0,
  "Cost_Medical & RX Paid Amount PMPY": 5000,
  "Cost_Medical & RX Paid Amount PEPY": 15000,
  "Cost_Medical Paid Amount PMPY": 4000,
  "Cost_Medical Paid Amount PEPY": 12000,
  "Cost_RX Paid Amount PMPY": 1000,
  "Cost_RX Paid Amount PEPY": 3000,
  "Cost_Avoidable ER Potential Savings PMPY": 150,
  "Cost_Specialty RX Allowed Amount PMPM": 50,
  "Util_Emergency Visits per 1k Members": 150,
  "Util_PCP Visits per 1k Members": 3000,
  "Util_Specialist Visits per 1k Members": 2500,
  "Util_Urgent Care Visits per 1k Members": 200,
  "Util_Telehealth Adoption": 0.15
});

// Process report data into correct format and fetch All_Average data
export const processReportData = async (data: ArchetypeDetailedData | null): Promise<ProcessedReportData> => {
  // Fetch the All_Average data from the database
  let averageData: AverageData;

  try {
    console.log('[processReportData] Fetching All_Average data from level4_report_secure table');
    
    const { data: avgData, error } = await supabase
      .from('level4_report_secure')
      .select('*')
      .eq('archetype_id', 'All_Average')
      .single();
    
    if (error) {
      console.error('[processReportData] Error fetching All_Average data:', error);
      throw error;
    }
    
    if (!avgData) {
      console.warn('[processReportData] No All_Average data found, using defaults');
      averageData = createDefaultAverageData();
    } else {
      console.log('[processReportData] Using database All_Average data', {
        hasCostAvoidableER: "Cost_Avoidable ER Potential Savings PMPY" in avgData,
        hasSpecialtyRx: "Cost_Specialty RX Allowed Amount PMPM" in avgData,
        costKeys: Object.keys(avgData).filter(k => k.startsWith('Cost_')).slice(0, 5)
      });
      
      // Transform the data into our AverageData structure by creating a complete object first
      // Start with our default data structure to ensure all fields are present
      averageData = {
        ...createDefaultAverageData(), // Create a base with all required fields
        archetype_id: avgData.archetype_id as string,
        archetype_name: avgData.archetype_name as string || 'Population Average',
        // Then override with actual values from the database
        ...Object.fromEntries(
          Object.entries(avgData)
            .filter(([key, value]) => 
              typeof value === 'number' && 
              !key.startsWith('id') && 
              key !== 'archetype_id' && 
              key !== 'archetype_name'
            )
        )
      };
      
      // Double check critical fields
      if (!averageData["Cost_Avoidable ER Potential Savings PMPY"]) {
        console.warn('[processReportData] Missing critical field: Cost_Avoidable ER Potential Savings PMPY');
        averageData["Cost_Avoidable ER Potential Savings PMPY"] = createDefaultAverageData()["Cost_Avoidable ER Potential Savings PMPY"];
      }
      
      if (!averageData["Cost_Specialty RX Allowed Amount PMPM"]) {
        console.warn('[processReportData] Missing critical field: Cost_Specialty RX Allowed Amount PMPM');
        averageData["Cost_Specialty RX Allowed Amount PMPM"] = createDefaultAverageData()["Cost_Specialty RX Allowed Amount PMPM"];
      }
    }
  } catch (err) {
    console.error('[processReportData] Error in All_Average data fetch, using defaults:', err);
    averageData = createDefaultAverageData();
  }

  if (!data) {
    return {
      reportData: null,
      averageData
    };
  }

  // For the report data, ensure critical fields exist
  const safeReportData = { ...data };
  
  // Make sure all critical cost fields exist
  const criticalFields = [
    "Cost_Avoidable ER Potential Savings PMPY",
    "Cost_Specialty RX Allowed Amount PMPM",
    "Cost_Medical & RX Paid Amount PMPY",
    "Cost_Medical & RX Paid Amount PEPY",
    "Cost_Medical Paid Amount PMPY",
    "Cost_Medical Paid Amount PEPY",
    "Cost_RX Paid Amount PMPY",
    "Cost_RX Paid Amount PEPY"
  ];
  
  criticalFields.forEach(field => {
    if (safeReportData[field] === undefined) {
      console.warn(`[processReportData] Missing field in report data: ${field}, using default value`);
      safeReportData[field] = averageData[field] || 0;
    }
  });

  return {
    reportData: safeReportData as ArchetypeDetailedData,
    averageData
  };
};
