import { supabase } from '@/integrations/supabase/client';

export interface StandardizedAverageData {
  // Demographic averages
  averageAge: number;
  averageFamilySize: number;
  averageEmployees: number;
  averageMembers: number;
  averagePercentFemale: number;
  averageSalary: number;
  averageStates: number;
  
  // Cost averages
  medicalRxPaidAmountPMPY: number;
  medicalRxPaidAmountPEPY: number;
  medicalPaidAmountPMPY: number;
  medicalPaidAmountPEPY: number;
  rxPaidAmountPMPY: number;
  rxPaidAmountPEPY: number;
  avoidableERSavingsPMPY: number;
  specialtyRxAllowedAmountPMPM: number;
  
  // Utilization averages
  emergencyVisitsPer1k: number;
  pcpVisitsPer1k: number;
  specialistVisitsPer1k: number;
  urgentCareVisitsPer1k: number;
  telehealthAdoption: number;
  percentNonUtilizers: number;
  
  // Risk averages
  averageRiskScore: number;
  
  // Raw data for additional fields
  rawData: Record<string, any>;
}

class AverageDataService {
  private cachedData: StandardizedAverageData | null = null;
  private lastFetch: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async getAverageData(): Promise<StandardizedAverageData> {
    // Check if we have valid cached data
    if (this.cachedData && (Date.now() - this.lastFetch) < this.CACHE_DURATION) {
      console.log('[AverageDataService] Using cached average data');
      return this.cachedData;
    }

    console.log('[AverageDataService] Fetching fresh average data');

    try {
      // Fetch from the level4_report_secure table for consistency
      const { data, error } = await supabase
        .from('level4_report_secure')
        .select('*')
        .eq('archetype_id', 'All_Average')
        .single();

      if (error) {
        console.error('[AverageDataService] Error fetching average data:', error);
        throw new Error(`Failed to fetch average data: ${error.message}`);
      }

      if (!data) {
        console.error('[AverageDataService] No All_Average data found');
        throw new Error('No average data available');
      }

      // Standardize the data structure
      const standardizedData: StandardizedAverageData = {
        // Demographic averages with validation
        averageAge: this.validateNumber(data["Demo_Average Age"], 40, 'Demo_Average Age'),
        averageFamilySize: this.validateNumber(data["Demo_Average Family Size"], 3.0, 'Demo_Average Family Size'),
        averageEmployees: this.validateNumber(data["Demo_Average Employees"], 5000, 'Demo_Average Employees'),
        averageMembers: this.validateNumber(data["Demo_Average Members"], 15000, 'Demo_Average Members'),
        averagePercentFemale: this.validateNumber(data["Demo_Average Percent Female"], 0.51, 'Demo_Average Percent Female'),
        averageSalary: this.validateNumber(data["Demo_Average Salary"], 75000, 'Demo_Average Salary'),
        averageStates: this.validateNumber(data["Demo_Average States"], 10, 'Demo_Average States'),
        
        // Cost averages with validation
        medicalRxPaidAmountPMPY: this.validateNumber(data["Cost_Medical & RX Paid Amount PMPY"], 5000, 'Cost_Medical & RX Paid Amount PMPY'),
        medicalRxPaidAmountPEPY: this.validateNumber(data["Cost_Medical & RX Paid Amount PEPY"], 15000, 'Cost_Medical & RX Paid Amount PEPY'),
        medicalPaidAmountPMPY: this.validateNumber(data["Cost_Medical Paid Amount PMPY"], 4000, 'Cost_Medical Paid Amount PMPY'),
        medicalPaidAmountPEPY: this.validateNumber(data["Cost_Medical Paid Amount PEPY"], 12000, 'Cost_Medical Paid Amount PEPY'),
        rxPaidAmountPMPY: this.validateNumber(data["Cost_RX Paid Amount PMPY"], 1000, 'Cost_RX Paid Amount PMPY'),
        rxPaidAmountPEPY: this.validateNumber(data["Cost_RX Paid Amount PEPY"], 3000, 'Cost_RX Paid Amount PEPY'),
        avoidableERSavingsPMPY: this.validateNumber(data["Cost_Avoidable ER Potential Savings PMPY"], 150, 'Cost_Avoidable ER Potential Savings PMPY'),
        specialtyRxAllowedAmountPMPM: this.validateNumber(data["Cost_Specialty RX Allowed Amount PMPM"], 50, 'Cost_Specialty RX Allowed Amount PMPM'),
        
        // Utilization averages with validation
        emergencyVisitsPer1k: this.validateNumber(data["Util_Emergency Visits per 1k Members"], 150, 'Util_Emergency Visits per 1k Members'),
        pcpVisitsPer1k: this.validateNumber(data["Util_PCP Visits per 1k Members"], 3000, 'Util_PCP Visits per 1k Members'),
        specialistVisitsPer1k: this.validateNumber(data["Util_Specialist Visits per 1k Members"], 2500, 'Util_Specialist Visits per 1k Members'),
        urgentCareVisitsPer1k: this.validateNumber(data["Util_Urgent Care Visits per 1k Members"], 200, 'Util_Urgent Care Visits per 1k Members'),
        telehealthAdoption: this.validateNumber(data["Util_Telehealth Adoption"], 0.15, 'Util_Telehealth Adoption'),
        percentNonUtilizers: this.validateNumber(data["Util_Percent of Members who are Non-Utilizers"], 0.20, 'Util_Percent of Members who are Non-Utilizers'),
        
        // Risk averages with validation
        averageRiskScore: this.validateNumber(data["Risk_Average Risk Score"], 1.0, 'Risk_Average Risk Score'),
        
        // Keep raw data for any additional fields that might be needed
        rawData: data
      };

      // Cache the data
      this.cachedData = standardizedData;
      this.lastFetch = Date.now();

      console.log('[AverageDataService] Successfully fetched and standardized average data');
      return standardizedData;

    } catch (error) {
      console.error('[AverageDataService] Failed to fetch average data:', error);
      
      // Return fallback data if fetch fails
      console.warn('[AverageDataService] Using fallback average data');
      return this.getFallbackAverageData();
    }
  }

  private validateNumber(value: any, fallback: number, fieldName: string): number {
    const numValue = Number(value);
    if (isNaN(numValue) || numValue === 0) {
      console.warn(`[AverageDataService] Invalid value for ${fieldName}: ${value}, using fallback: ${fallback}`);
      return fallback;
    }
    return numValue;
  }

  private getFallbackAverageData(): StandardizedAverageData {
    return {
      averageAge: 40,
      averageFamilySize: 3.0,
      averageEmployees: 5000,
      averageMembers: 15000,
      averagePercentFemale: 0.51,
      averageSalary: 75000,
      averageStates: 10,
      medicalRxPaidAmountPMPY: 5000,
      medicalRxPaidAmountPEPY: 15000,
      medicalPaidAmountPMPY: 4000,
      medicalPaidAmountPEPY: 12000,
      rxPaidAmountPMPY: 1000,
      rxPaidAmountPEPY: 3000,
      avoidableERSavingsPMPY: 150,
      specialtyRxAllowedAmountPMPM: 50,
      emergencyVisitsPer1k: 150,
      pcpVisitsPer1k: 3000,
      specialistVisitsPer1k: 2500,
      urgentCareVisitsPer1k: 200,
      telehealthAdoption: 0.15,
      percentNonUtilizers: 0.20,
      averageRiskScore: 1.0,
      rawData: {}
    };
  }

  clearCache(): void {
    this.cachedData = null;
    this.lastFetch = 0;
  }
}

// Export singleton instance
export const averageDataService = new AverageDataService();
