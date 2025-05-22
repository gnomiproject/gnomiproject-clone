
import { useMemo } from 'react';
import { formatNumber } from '@/utils/formatters';

/**
 * Hook for processing cost analysis data and metrics with improved error handling
 */
export const useCostAnalysis = (reportData: any, averageData: any) => {
  // Parse the cost analysis text
  const costAnalysisData = useMemo(() => {
    if (!reportData) return null;
    
    const rawData = reportData?.cost_analysis || "";
    
    try {
      if (typeof rawData === 'string' && (rawData.startsWith('{') || rawData.startsWith('['))) {
        return JSON.parse(rawData);
      }
    } catch (e) {
      console.error('[useCostAnalysis] Error parsing cost analysis data:', e);
    }
    
    return null;
  }, [reportData]);
  
  // Extract key cost metrics with safety checks
  const costMetrics = useMemo(() => {
    // If no reportData, return empty object with default values
    if (!reportData) {
      console.warn('[useCostAnalysis] No reportData available, using default metrics');
      return {
        totalCostPEPY: 0,
        medicalCostPEPY: 0,
        rxCostPEPY: 0,
        avoidableER: 0,
        specialtyRx: 0
      };
    }

    // Ensure average data is valid
    const validAverageData = averageData || {};
    
    // Log available fields for debugging
    console.log('[useCostAnalysis] Available cost fields:', {
      hasCostAvoidableER: "Cost_Avoidable ER Potential Savings PMPY" in reportData,
      hasSpecialtyRx: "Cost_Specialty RX Allowed Amount PMPM" in reportData,
      reportDataKeys: Object.keys(reportData).filter(k => k.startsWith('Cost_')).slice(0, 5),
      avoidableERValue: reportData["Cost_Avoidable ER Potential Savings PMPY"],
      averageAvoidableERValue: validAverageData["Cost_Avoidable ER Potential Savings PMPY"]
    });
    
    return {
      totalCostPEPY: reportData?.["Cost_Medical & RX Paid Amount PEPY"] || 0,
      medicalCostPEPY: reportData?.["Cost_Medical Paid Amount PEPY"] || 0,
      rxCostPEPY: reportData?.["Cost_RX Paid Amount PEPY"] || 0,
      avoidableER: reportData?.["Cost_Avoidable ER Potential Savings PMPY"] || 0,
      specialtyRx: reportData?.["Cost_Specialty RX Allowed Amount PMPM"] || 0
    };
  }, [reportData, averageData]);
  
  return {
    costAnalysisData,
    costMetrics,
    formatCurrency: (value: number) => formatNumber(value, 'currency', 0)
  };
};

export default useCostAnalysis;
