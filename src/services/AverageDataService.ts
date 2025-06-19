
import { supabase } from '@/integrations/supabase/client';

// Standard interface for average data to ensure consistent field access
export interface StandardizedAverageData {
  [key: string]: number | string | null | undefined;
  // Core fields
  archetype_id?: string;
  archetype_name?: string;
  // Common metrics with standardized names
  averageAge?: number;
  averageFamilySize?: number;
  averageEmployees?: number;
  averageMembers?: number;
  averagePercentFemale?: number;
  averageSalary?: number;
  averageStates?: number;
  averageRiskScore?: number;
  medicalRxPaidAmountPMPY?: number;
  medicalRxPaidAmountPEPY?: number;
  medicalPaidAmountPMPY?: number;
  medicalPaidAmountPEPY?: number;
  rxPaidAmountPMPY?: number;
  rxPaidAmountPEPY?: number;
  avoidableERSavingsPMPY?: number;
  specialtyRxAllowedAmountPMPM?: number;
  emergencyVisitsPer1k?: number;
  pcpVisitsPer1k?: number;
  specialistVisitsPer1k?: number;
  urgentCareVisitsPer1k?: number;
  telehealthAdoption?: number;
  percentNonUtilizers?: number;
}

class AverageDataService {
  private cacheKey = 'average-data-cache-v3'; // Updated cache key version
  private cacheTTL = 24 * 60 * 60 * 1000; // 24 hours
  private data: StandardizedAverageData | null = null;
  private usingFallbackData: boolean = false;

  // Public method to get fallback average data
  public getDefaultAverageData(): StandardizedAverageData {
    console.log('[AverageDataService] Using fallback average data');
    this.usingFallbackData = true;
    
    return {
      archetype_id: 'All_Average',
      archetype_name: 'Population Average',
      // Standard fallback values
      "Demo_Average Age": 42,
      "Demo_Average Family Size": 2.8,
      "Demo_Average Employees": 4500,
      "Demo_Average Members": 12600,
      "Demo_Average Percent Female": 0.42,
      "Demo_Average Salary": 68000,
      "Demo_Average States": 8,
      "Risk_Average Risk Score": 0.95,
      "Cost_Medical & RX Paid Amount PMPY": 4800,
      "Cost_Medical & RX Paid Amount PEPY": 13440,
      "Cost_Medical Paid Amount PMPY": 3840,
      "Cost_Medical Paid Amount PEPY": 10752,
      "Cost_RX Paid Amount PMPY": 960,
      "Cost_RX Paid Amount PEPY": 2688,
      "Cost_Avoidable ER Potential Savings PMPY": 135,
      "Cost_Specialty RX Allowed Amount PMPM": 45,
      "Util_Emergency Visits per 1k Members": 135,
      "Util_PCP Visits per 1k Members": 2700,
      "Util_Specialist Visits per 1k Members": 2250,
      "Util_Urgent Care Visits per 1k Members": 180,
      "Util_Telehealth Adoption": 0.13,
      "Util_Percent of Members who are Non-Utilizers": 0.18,
      
      // Standardized field names
      averageAge: 42,
      averageFamilySize: 2.8,
      averageEmployees: 4500,
      averageMembers: 12600,
      averagePercentFemale: 0.42,
      averageSalary: 68000,
      averageStates: 8,
      averageRiskScore: 0.95,
      medicalRxPaidAmountPMPY: 4800,
      medicalRxPaidAmountPEPY: 13440,
      medicalPaidAmountPMPY: 3840,
      medicalPaidAmountPEPY: 10752,
      rxPaidAmountPMPY: 960,
      rxPaidAmountPEPY: 2688,
      avoidableERSavingsPMPY: 135,
      specialtyRxAllowedAmountPMPM: 45,
      emergencyVisitsPer1k: 135,
      pcpVisitsPer1k: 2700,
      specialistVisitsPer1k: 2250,
      urgentCareVisitsPer1k: 180,
      telehealthAdoption: 0.13,
      percentNonUtilizers: 0.18
    };
  }

  // Validate that the data has required structure (not exact values)
  private validateAverageData(data: any): boolean {
    if (!data) return false;
    
    // Check for required fields structure, not exact values
    const requiredFields = [
      "Cost_Medical & RX Paid Amount PEPY",
      "Risk_Average Risk Score",
      "Util_Emergency Visits per 1k Members",
      "Util_Specialist Visits per 1k Members"
    ];
    
    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === null || typeof data[field] !== 'number') {
        console.warn(`[AverageDataService] Missing or invalid field: ${field}`);
        return false;
      }
    }
    
    return true;
  }

  // Check if cache is valid
  private isCacheValid(): boolean {
    try {
      const cachedData = localStorage.getItem(this.cacheKey);
      if (!cachedData) return false;
      
      const { data, timestamp } = JSON.parse(cachedData);
      const now = Date.now();
      
      // Check if data exists, is not expired, and has valid structure
      const isTimeValid = data && (now - timestamp < this.cacheTTL);
      const isDataValid = isTimeValid && this.validateAverageData(data);
      
      if (!isDataValid && isTimeValid) {
        console.warn('[AverageDataService] Cache has invalid structure, clearing');
        localStorage.removeItem(this.cacheKey);
        return false;
      }
      
      return isDataValid;
    } catch (e) {
      console.error('[AverageDataService] Error checking cache:', e);
      localStorage.removeItem(this.cacheKey);
      return false;
    }
  }

  // Save data to cache
  private saveToCache(data: StandardizedAverageData): void {
    try {
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
      console.log('[AverageDataService] Data cached successfully');
    } catch (e) {
      console.error('[AverageDataService] Error saving to cache:', e);
    }
  }

  // Load data from cache
  private loadFromCache(): StandardizedAverageData | null {
    try {
      const cachedData = localStorage.getItem(this.cacheKey);
      if (!cachedData) return null;
      
      const { data } = JSON.parse(cachedData);
      console.log('[AverageDataService] Using cached data');
      return data;
    } catch (e) {
      console.error('[AverageDataService] Error loading from cache:', e);
      return null;
    }
  }

  // Standardize field names for more consistent access
  private standardizeFieldNames(rawData: any): StandardizedAverageData {
    const result: StandardizedAverageData = { ...rawData };
    
    // Map raw field names to standardized names for easier access
    if (rawData["Demo_Average Age"]) result.averageAge = rawData["Demo_Average Age"];
    if (rawData["Demo_Average Family Size"]) result.averageFamilySize = rawData["Demo_Average Family Size"];
    if (rawData["Demo_Average Employees"]) result.averageEmployees = rawData["Demo_Average Employees"];
    if (rawData["Demo_Average Members"]) result.averageMembers = rawData["Demo_Average Members"];
    if (rawData["Demo_Average Percent Female"]) result.averagePercentFemale = rawData["Demo_Average Percent Female"];
    if (rawData["Demo_Average Salary"]) result.averageSalary = rawData["Demo_Average Salary"];
    if (rawData["Demo_Average States"]) result.averageStates = rawData["Demo_Average States"];
    if (rawData["Risk_Average Risk Score"]) result.averageRiskScore = rawData["Risk_Average Risk Score"];
    
    // Cost metrics
    if (rawData["Cost_Medical & RX Paid Amount PMPY"]) result.medicalRxPaidAmountPMPY = rawData["Cost_Medical & RX Paid Amount PMPY"];
    if (rawData["Cost_Medical & RX Paid Amount PEPY"]) result.medicalRxPaidAmountPEPY = rawData["Cost_Medical & RX Paid Amount PEPY"];
    if (rawData["Cost_Medical Paid Amount PMPY"]) result.medicalPaidAmountPMPY = rawData["Cost_Medical Paid Amount PMPY"];
    if (rawData["Cost_Medical Paid Amount PEPY"]) result.medicalPaidAmountPEPY = rawData["Cost_Medical Paid Amount PEPY"];
    if (rawData["Cost_RX Paid Amount PMPY"]) result.rxPaidAmountPMPY = rawData["Cost_RX Paid Amount PMPY"];
    if (rawData["Cost_RX Paid Amount PEPY"]) result.rxPaidAmountPEPY = rawData["Cost_RX Paid Amount PEPY"];
    if (rawData["Cost_Avoidable ER Potential Savings PMPY"]) result.avoidableERSavingsPMPY = rawData["Cost_Avoidable ER Potential Savings PMPY"];
    if (rawData["Cost_Specialty RX Allowed Amount PMPM"]) result.specialtyRxAllowedAmountPMPM = rawData["Cost_Specialty RX Allowed Amount PMPM"];
    
    // Utilization metrics
    if (rawData["Util_Emergency Visits per 1k Members"]) result.emergencyVisitsPer1k = rawData["Util_Emergency Visits per 1k Members"];
    if (rawData["Util_PCP Visits per 1k Members"]) result.pcpVisitsPer1k = rawData["Util_PCP Visits per 1k Members"];
    if (rawData["Util_Specialist Visits per 1k Members"]) result.specialistVisitsPer1k = rawData["Util_Specialist Visits per 1k Members"];
    if (rawData["Util_Urgent Care Visits per 1k Members"]) result.urgentCareVisitsPer1k = rawData["Util_Urgent Care Visits per 1k Members"];
    if (rawData["Util_Telehealth Adoption"]) result.telehealthAdoption = rawData["Util_Telehealth Adoption"];
    if (rawData["Util_Percent of Members who are Non-Utilizers"]) result.percentNonUtilizers = rawData["Util_Percent of Members who are Non-Utilizers"];
    
    return result;
  }

  // Fetch average data from Supabase
  private async fetchAverageData(): Promise<StandardizedAverageData> {
    try {
      console.log('[AverageDataService] Fetching average data from database');
      
      const { data, error } = await supabase
        .from('level4_deepdive_report_data')
        .select('*')
        .eq('archetype_id', 'All_Average')
        .single();
      
      if (error) {
        console.error('[AverageDataService] Database error:', error);
        console.log('[AverageDataService] Falling back to default data');
        return this.getDefaultAverageData();
      }
      
      if (!data) {
        console.warn('[AverageDataService] No All_Average record found in database');
        console.log('[AverageDataService] Falling back to default data');
        return this.getDefaultAverageData();
      }
      
      // Validate the fetched data structure
      if (!this.validateAverageData(data)) {
        console.error('[AverageDataService] Database data failed structure validation, using fallback');
        return this.getDefaultAverageData();
      }
      
      console.log('[AverageDataService] ✅ Successfully fetched and validated data from database');
      
      // Reset fallback flag since we got valid real data
      this.usingFallbackData = false;
      
      // Standardize field names for easier access
      return this.standardizeFieldNames(data);
    } catch (e) {
      console.error('[AverageDataService] Unexpected error in fetchAverageData:', e);
      console.log('[AverageDataService] Falling back to default data');
      return this.getDefaultAverageData();
    }
  }

  // Public method to get average data
  public async getAverageData(): Promise<StandardizedAverageData> {
    // Check cache first
    if (this.isCacheValid()) {
      const cachedData = this.loadFromCache();
      if (cachedData) {
        this.data = cachedData;
        this.usingFallbackData = false;
        return cachedData;
      }
    }

    try {
      const freshData = await this.fetchAverageData();
      
      // Save to instance
      this.data = freshData;
      
      // Only cache if it's real data and passes validation
      if (!this.usingFallbackData && this.validateAverageData(freshData)) {
        this.saveToCache(freshData);
      }
      
      return freshData;
    } catch (e) {
      console.error('[AverageDataService] Error getting average data:', e);
      const fallbackData = this.getDefaultAverageData();
      return fallbackData;
    }
  }

  // Public method to check if using fallback data
  public isUsingFallbackData(): boolean {
    return this.usingFallbackData;
  }

  // Clear cache and reset data
  public clearCache(): void {
    this.data = null;
    this.usingFallbackData = false;
    try {
      localStorage.removeItem(this.cacheKey);
      console.log('[AverageDataService] Cache cleared');
    } catch (e) {
      console.error('[AverageDataService] Error clearing cache:', e);
    }
  }
}

// Create a singleton instance
export const averageDataService = new AverageDataService();
