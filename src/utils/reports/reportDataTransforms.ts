
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
  [key: string]: any; // Allow for additional metrics
}

// Interface for processed report data
export interface ProcessedReportData {
  reportData: ArchetypeDetailedData | null;
  averageData: AverageData;
}

// Create default average data for reports as a fallback
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
      console.log('[processReportData] Using database All_Average data');
      
      // Transform the data into our AverageData structure
      averageData = {
        archetype_id: avgData.archetype_id as string,
        archetype_name: avgData.archetype_name as string || 'Population Average',
        // Map all numeric fields from avgData to the AverageData format
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

  return {
    reportData: data,
    averageData
  };
};
