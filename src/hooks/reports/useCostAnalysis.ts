
import { useMemo } from 'react';
import { formatNumber } from '@/utils/formatters';

/**
 * Hook for processing cost analysis data and metrics
 */
export const useCostAnalysis = (reportData: any, averageData: any) => {
  // Parse the cost analysis text
  const costAnalysisData = useMemo(() => {
    const rawData = reportData?.cost_analysis || "";
    
    try {
      if (typeof rawData === 'string' && (rawData.startsWith('{') || rawData.startsWith('['))) {
        return JSON.parse(rawData);
      }
    } catch (e) {
      console.error('Error parsing cost analysis data:', e);
    }
    
    return null;
  }, [reportData]);
  
  // Extract key cost metrics
  const costMetrics = useMemo(() => {
    return {
      totalCostPEPY: reportData?.["Cost_Medical & RX Paid Amount PEPY"] || 0,
      medicalCostPEPY: reportData?.["Cost_Medical Paid Amount PEPY"] || 0,
      rxCostPEPY: reportData?.["Cost_RX Paid Amount PEPY"] || 0,
      totalCostPMPY: reportData?.["Cost_Medical & RX Paid Amount PMPY"] || 0,
      medicalCostPMPY: reportData?.["Cost_Medical Paid Amount PMPY"] || 0,
      rxCostPMPY: reportData?.["Cost_RX Paid Amount PMPY"] || 0,
      avoidableER: reportData?.["Cost_Avoidable ER Potential Savings PMPY"] || 0,
      specialtyRx: reportData?.["Cost_Specialty RX Allowed Amount PMPM"] || 0
    };
  }, [reportData]);
  
  // Calculate specialty Rx percentage
  const specialtyRxPercentage = useMemo(() => {
    if (!costMetrics.specialtyRx || !costMetrics.rxCostPMPY) {
      return 0;
    }
    return (costMetrics.specialtyRx * 12 / costMetrics.rxCostPMPY) * 100;
  }, [costMetrics]);
  
  return {
    costAnalysisData,
    costMetrics,
    specialtyRxPercentage,
    formatCurrency: (value: number) => formatNumber(value, 'currency', 0)
  };
};

export default useCostAnalysis;
