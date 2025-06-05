
import { ArchetypeDetailedData } from '@/types/archetype';

// Interface for processed report data - simplified to match production
export interface ProcessedReportData {
  reportData: ArchetypeDetailedData | null;
  averageData: any;
}

// Static average data updated to use "Archetype Average" terminology
export const createDefaultAverageData = () => {
  return {
    archetype_id: 'All_Average',
    archetype_name: 'Archetype Average',
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
    "Util_Telehealth Adoption": 0.15,
    "Util_Percent of Members who are Non-Utilizers": 0.2
  };
};

// Enhanced process function to ensure distinctive metrics are properly parsed
export const processReportData = async (data: ArchetypeDetailedData | null): Promise<ProcessedReportData> => {
  console.log('[processReportData] Processing data with enhanced distinctive metrics handling');
  
  const averageData = createDefaultAverageData();

  if (!data) {
    return {
      reportData: null,
      averageData
    };
  }

  // Process distinctive metrics with more robust handling
  let processedDistinctiveMetrics = data.distinctive_metrics;
  
  if (data.distinctive_metrics) {
    console.log('[processReportData] Processing distinctive_metrics:', {
      type: typeof data.distinctive_metrics,
      isArray: Array.isArray(data.distinctive_metrics),
      raw: data.distinctive_metrics
    });

    if (typeof data.distinctive_metrics === 'string') {
      try {
        processedDistinctiveMetrics = JSON.parse(data.distinctive_metrics);
        console.log('[processReportData] Parsed distinctive_metrics from string:', processedDistinctiveMetrics);
      } catch (error) {
        console.error('[processReportData] Error parsing distinctive_metrics:', error);
        processedDistinctiveMetrics = [];
      }
    } else if (Array.isArray(data.distinctive_metrics)) {
      console.log('[processReportData] distinctive_metrics is already an array');
      processedDistinctiveMetrics = data.distinctive_metrics;
    }
  }

  // Process top_distinctive_metrics similarly
  let processedTopDistinctiveMetrics = data.top_distinctive_metrics;
  
  if (data.top_distinctive_metrics && typeof data.top_distinctive_metrics === 'string') {
    try {
      processedTopDistinctiveMetrics = JSON.parse(data.top_distinctive_metrics);
      console.log('[processReportData] Parsed top_distinctive_metrics from string');
    } catch (error) {
      console.error('[processReportData] Error parsing top_distinctive_metrics:', error);
    }
  }

  // Return data with processed distinctive metrics
  const processedData = {
    ...data,
    distinctive_metrics: processedDistinctiveMetrics,
    top_distinctive_metrics: processedTopDistinctiveMetrics
  };

  console.log('[processReportData] Final processed data:', {
    hasDistinctiveMetrics: !!(processedData.distinctive_metrics),
    hasTopDistinctiveMetrics: !!(processedData.top_distinctive_metrics),
    distinctiveMetricsType: typeof processedData.distinctive_metrics,
    distinctiveMetricsLength: Array.isArray(processedData.distinctive_metrics) ? processedData.distinctive_metrics.length : 'N/A'
  });

  return {
    reportData: processedData,
    averageData
  };
};

// Legacy function for backward compatibility
export const createDefaultAverageDataLegacy = createDefaultAverageData;

// Re-export for compatibility
export type AverageData = any;
