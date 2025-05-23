
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
  private cacheKey = 'average-data-cache';
  private cacheTTL = 24 * 60 * 60 * 1000; // 24 hours
  private data: StandardizedAverageData | null = null;

  // Public method to get fallback average data
  public getDefaultAverageData(): StandardizedAverageData {
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
      "Util_Telehealth Adoption": 0.15,
      "Util_Percent of Members who are Non-Utilizers": 0.2,
      
      // Standardized field names
      averageAge: 40,
      averageFamilySize: 3.0,
      averageEmployees: 5000,
      averageMembers: 15000,
      averagePercentFemale: 0.51,
      averageSalary: 75000,
      averageStates: 10,
      averageRiskScore: 1.0,
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
      percentNonUtilizers: 0.2
    };
  }

  // Check if cache is valid
  private isCacheValid(): boolean {
    try {
      const cachedData = localStorage.getItem(this.cacheKey);
      if (!cachedData) return false;
      
      const { data, timestamp } = JSON.parse(cachedData);
      const now = Date.now();
      
      // Check if data exists and is not expired
      return !!data && (now - timestamp < this.cacheTTL);
    } catch (e) {
      console.error('Error checking average data cache:', e);
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
    } catch (e) {
      console.error('Error saving average data to cache:', e);
    }
  }

  // Load data from cache
  private loadFromCache(): StandardizedAverageData | null {
    try {
      const cachedData = localStorage.getItem(this.cacheKey);
      if (!cachedData) return null;
      
      const { data } = JSON.parse(cachedData);
      return data;
    } catch (e) {
      console.error('Error loading average data from cache:', e);
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
      console.log('[AverageDataService] Fetching average data from Supabase');
      
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
        console.warn('[AverageDataService] No average data found, using fallback');
        return this.getDefaultAverageData();
      }
      
      // Standardize field names for easier access
      return this.standardizeFieldNames(data);
    } catch (e) {
      console.error('[AverageDataService] Error in fetchAverageData:', e);
      return this.getDefaultAverageData();
    }
  }

  // Public method to get average data (from cache or fetch fresh)
  public async getAverageData(): Promise<StandardizedAverageData> {
    // Return existing data if we have it
    if (this.data) {
      return this.data;
    }
    
    // Try to get from cache first
    if (this.isCacheValid()) {
      const cachedData = this.loadFromCache();
      if (cachedData) {
        this.data = cachedData;
        return this.data;
      }
    }
    
    // If not in cache or cache invalid, fetch fresh data
    try {
      const freshData = await this.fetchAverageData();
      
      // Save to instance and cache
      this.data = freshData;
      this.saveToCache(freshData);
      
      return freshData;
    } catch (e) {
      console.error('[AverageDataService] Error getting average data:', e);
      const fallbackData = this.getDefaultAverageData();
      return fallbackData;
    }
  }

  // Clear cache and reset data
  public clearCache(): void {
    this.data = null;
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
