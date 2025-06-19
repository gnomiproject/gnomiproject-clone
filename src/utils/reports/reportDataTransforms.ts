
import { ArchetypeDetailedData } from '@/types/archetype';
import { averageDataService } from '@/services/AverageDataService';

// Interface for processed report data - simplified to match production
export interface ProcessedReportData {
  reportData: ArchetypeDetailedData | null;
  averageData: any;
}

// SIMPLIFIED process function - now uses AverageDataService for consistency
export const processReportData = async (data: ArchetypeDetailedData | null): Promise<ProcessedReportData> => {
  console.log('[processReportData] Processing data with improved average data handling');
  
  // Get average data from the centralized service
  const averageData = await averageDataService.getAverageData();
  
  // Log if we're using fallback data
  if (averageDataService.isUsingFallbackData()) {
    console.warn('[processReportData] Using fallback average data - database may be unavailable');
  } else {
    console.log('[processReportData] Using database average data');
  }

  // Validate average data consistency
  console.log('[processReportData] Average data validation:', {
    percentFemale: averageData["Demo_Average Percent Female"],
    age: averageData["Demo_Average Age"],
    familySize: averageData["Demo_Average Family Size"],
    dataSource: averageDataService.isUsingFallbackData() ? 'fallback' : 'database'
  });

  if (!data) {
    return {
      reportData: null,
      averageData
    };
  }

  // Process distinctive metrics - simplified since database uses consistent property names
  let processedDistinctiveMetrics = [];
  
  console.log('[processReportData] Raw distinctive_metrics:', data.distinctive_metrics);

  // Directly use distinctive_metrics since it should have correct property names (value/average)
  if (data.distinctive_metrics) {
    if (Array.isArray(data.distinctive_metrics)) {
      processedDistinctiveMetrics = data.distinctive_metrics;
      console.log('[processReportData] Using distinctive_metrics array directly');
    } else if (typeof data.distinctive_metrics === 'string') {
      try {
        processedDistinctiveMetrics = JSON.parse(data.distinctive_metrics);
        console.log('[processReportData] Parsed distinctive_metrics from string');
      } catch (error) {
        console.error('[processReportData] Error parsing distinctive_metrics:', error);
      }
    }
  }

  // Return data with processed distinctive metrics
  const processedData = {
    ...data,
    distinctive_metrics: processedDistinctiveMetrics
  };

  console.log('[processReportData] Final processed data with consistent averages:', {
    hasDistinctiveMetrics: processedDistinctiveMetrics.length > 0,
    averageDataSource: averageDataService.isUsingFallbackData() ? 'fallback' : 'database',
    percentFemaleAverage: averageData["Demo_Average Percent Female"]
  });

  return {
    reportData: processedData,
    averageData
  };
};

// Legacy function for backward compatibility - now uses AverageDataService
export const createDefaultAverageData = async () => {
  const averageData = await averageDataService.getAverageData();
  
  if (averageDataService.isUsingFallbackData()) {
    console.warn('[createDefaultAverageData] Returning fallback average data');
  }
  
  return averageData;
};

// Legacy function for backward compatibility
export const createDefaultAverageDataLegacy = createDefaultAverageData;

// Re-export for compatibility
export type AverageData = any;
