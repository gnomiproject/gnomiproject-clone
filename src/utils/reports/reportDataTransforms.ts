
import { ArchetypeDetailedData } from '@/types/archetype';
import { averageDataService, StandardizedAverageData } from '@/services/AverageDataService';

// Interface for processed report data
export interface ProcessedReportData {
  reportData: ArchetypeDetailedData | null;
  averageData: StandardizedAverageData;
}

// Re-export StandardizedAverageData for use in other files
export type AverageData = StandardizedAverageData;

// Create default average data for reports as a fallback - with extended fields
export const createDefaultAverageData = (): StandardizedAverageData => {
  // Use the public method to get fallback data
  return averageDataService.getDefaultAverageData();
};

// Process report data into correct format and fetch All_Average data using centralized service
export const processReportData = async (data: ArchetypeDetailedData | null): Promise<ProcessedReportData> => {
  console.log('[processReportData] Starting data processing with centralized services');
  
  // Fetch average data using the centralized service
  let averageData: StandardizedAverageData;

  try {
    averageData = await averageDataService.getAverageData();
    console.log('[processReportData] Successfully fetched average data from centralized service');
  } catch (err) {
    console.error('[processReportData] Error fetching average data from service:', err);
    averageData = createDefaultAverageData();
  }

  if (!data) {
    return {
      reportData: null,
      averageData
    };
  }

  // For the report data, ensure critical fields exist using the standardized data
  const safeReportData = { ...data };
  
  // Define critical fields that should exist for proper calculations
  const criticalFieldMappings = [
    // Cost fields
    { key: "Cost_Avoidable ER Potential Savings PMPY", avgValue: averageData.avoidableERSavingsPMPY },
    { key: "Cost_Specialty RX Allowed Amount PMPM", avgValue: averageData.specialtyRxAllowedAmountPMPM },
    { key: "Cost_Medical & RX Paid Amount PMPY", avgValue: averageData.medicalRxPaidAmountPMPY },
    { key: "Cost_Medical & RX Paid Amount PEPY", avgValue: averageData.medicalRxPaidAmountPEPY },
    { key: "Cost_Medical Paid Amount PMPY", avgValue: averageData.medicalPaidAmountPMPY },
    { key: "Cost_Medical Paid Amount PEPY", avgValue: averageData.medicalPaidAmountPEPY },
    { key: "Cost_RX Paid Amount PMPY", avgValue: averageData.rxPaidAmountPMPY },
    { key: "Cost_RX Paid Amount PEPY", avgValue: averageData.rxPaidAmountPEPY },
    
    // Demographic fields
    { key: "Demo_Average Age", avgValue: averageData.averageAge },
    { key: "Demo_Average Family Size", avgValue: averageData.averageFamilySize },
    { key: "Demo_Average Employees", avgValue: averageData.averageEmployees },
    { key: "Demo_Average Members", avgValue: averageData.averageMembers },
    { key: "Demo_Average Percent Female", avgValue: averageData.averagePercentFemale },
    { key: "Demo_Average Salary", avgValue: averageData.averageSalary },
    { key: "Demo_Average States", avgValue: averageData.averageStates },
    
    // Utilization fields
    { key: "Util_Emergency Visits per 1k Members", avgValue: averageData.emergencyVisitsPer1k },
    { key: "Util_PCP Visits per 1k Members", avgValue: averageData.pcpVisitsPer1k },
    { key: "Util_Specialist Visits per 1k Members", avgValue: averageData.specialistVisitsPer1k },
    { key: "Util_Urgent Care Visits per 1k Members", avgValue: averageData.urgentCareVisitsPer1k },
    { key: "Util_Telehealth Adoption", avgValue: averageData.telehealthAdoption },
    { key: "Util_Percent of Members who are Non-Utilizers", avgValue: averageData.percentNonUtilizers },
    
    // Risk fields
    { key: "Risk_Average Risk Score", avgValue: averageData.averageRiskScore }
  ];
  
  // Ensure all critical fields exist in the report data
  criticalFieldMappings.forEach(({ key, avgValue }) => {
    if (safeReportData[key] === undefined || safeReportData[key] === null) {
      console.warn(`[processReportData] Missing field in report data: ${key}, using average value: ${avgValue}`);
      safeReportData[key] = avgValue;
    }
  });

  console.log('[processReportData] Completed data processing with field validation');

  return {
    reportData: safeReportData as ArchetypeDetailedData,
    averageData
  };
};

/**
 * Legacy function for backward compatibility
 * Now uses the centralized service internally
 */
export const createDefaultAverageDataLegacy = () => {
  return {
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
  };
};
