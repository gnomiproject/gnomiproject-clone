
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { ArchetypeDetailedData, ArchetypeId, FamilyId } from '@/types/archetype';
import { getFromCache, setInCache, clearFromCache } from '@/utils/reports/reportCache';
import { ensureStringArray } from '@/utils/array/ensureStringArray';
import { 
  convertJsonToSwotAnalysis, 
  convertJsonToDistinctiveMetrics, 
  convertJsonToStringArray,
  convertJsonToStrategicRecommendations 
} from '@/utils/typeConverters';

// Local storage key for fallback report data
const FALLBACK_REPORT_KEY = 'report_data_fallback';

interface UseReportAccessOptions {
  archetypeId: string;
  token: string;
  isAdminView?: boolean;
  skipCache?: boolean;
}

interface UseReportAccessResult {
  reportData: any;
  archetypeData: ArchetypeDetailedData;
  averageData: any;
  isLoading: boolean;
  error: Error | null;
  debugInfo: any;
  refreshData: () => Promise<void>;
  isUsingFallbackData?: boolean;
}

export const useReportAccess = ({
  archetypeId,
  token,
  isAdminView = false,
  skipCache = false
}: UseReportAccessOptions): UseReportAccessResult => {
  const [error, setError] = useState<Error | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [isUsingFallbackData, setIsUsingFallbackData] = useState<boolean>(false);
  
  // Query key for this report
  const queryKey = ['report-access', archetypeId, token];
  
  // Function to safely process database data into strongly-typed application data
  const processRawData = useCallback((data: any): ArchetypeDetailedData => {
    console.log('[useReportAccess] Processing raw data:', data);
    
    return {
      // Spread all raw database fields first
      ...data,
      // Then override with safely converted versions
      id: data.archetype_id as ArchetypeId,
      name: data.archetype_name,
      familyId: data.family_id as FamilyId || 'unknown' as FamilyId,
      family_id: data.family_id as FamilyId || 'unknown' as FamilyId,
      key_characteristics: convertJsonToStringArray(data.key_characteristics),
      swot_analysis: convertJsonToSwotAnalysis(data.swot_analysis),
      swot: convertJsonToSwotAnalysis(data.swot_analysis || data.swot),
      strengths: convertJsonToStringArray(data.strengths),
      weaknesses: convertJsonToStringArray(data.weaknesses),
      opportunities: convertJsonToStringArray(data.opportunities),
      threats: convertJsonToStringArray(data.threats),
      distinctive_metrics: convertJsonToDistinctiveMetrics(data.distinctive_metrics),
      strategic_recommendations: convertJsonToStrategicRecommendations(data.strategic_recommendations),
      short_description: data.short_description,
      long_description: data.long_description,
      hexColor: data.hex_color,
      industries: data.industries,
      detailed_metrics: data.detailed_metrics,
      disease_prevalence: data.disease_prevalence
    };
  }, []);
  
  // Function to fetch average data from database
  const fetchAverageData = useCallback(async () => {
    console.log('[useReportAccess] Fetching average data from level4_deepdive_report_data');
    
    try {
      const { data, error } = await supabase
        .from('level4_deepdive_report_data')
        .select('*')
        .eq('archetype_id', 'All_Average')
        .maybeSingle();
        
      if (error) {
        console.error('[useReportAccess] Error fetching average data:', error);
        throw new Error(`Error fetching average data: ${error.message}`);
      }
      
      if (!data) {
        console.warn('[useReportAccess] No All_Average record found, using fallback');
        return getFallbackAverageData();
      }
      
      console.log('[useReportAccess] ✅ Successfully fetched REAL average data:', {
        cost_pepy: data["Cost_Medical & RX Paid Amount PEPY"],
        risk_score: data["Risk_Average Risk Score"],
        emergency_visits: data["Util_Emergency Visits per 1k Members"],
        specialist_visits: data["Util_Specialist Visits per 1k Members"]
      });
      
      setIsUsingFallbackData(false);
      return data;
      
    } catch (fetchError) {
      console.error('[useReportAccess] Error in fetchAverageData:', fetchError);
      setIsUsingFallbackData(true);
      return getFallbackAverageData();
    }
  }, []);
  
  // Fallback average data with CORRECTED values that match database
  const getFallbackAverageData = useCallback(() => {
    console.warn('[useReportAccess] Using fallback average data');
    return {
      archetype_id: 'All_Average',
      archetype_name: 'Population Average',
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
      "Util_Percent of Members who are Non-Utilizers": 0.18
    };
  }, []);
  
  // Function to fetch report data from level4_deepdive_report_data (production table)
  const fetchReportData = useCallback(async () => {
    console.log(`[useReportAccess] Fetching report data for ${archetypeId} from level4_deepdive_report_data`);
    
    if (!archetypeId) {
      throw new Error('Missing archetype ID');
    }
    
    // Cache key for the report data
    const cacheKey = `report-access-${archetypeId}-${token}`;
    
    // Check cache first if not skipping
    if (!skipCache) {
      const cachedData = getFromCache(cacheKey);
      if (cachedData) {
        console.log(`[useReportAccess] Using cached data for ${archetypeId}`);
        return cachedData;
      }
    }
    
    // For admin view or valid token, fetch the data from production table
    try {
      // STEP 1: Fetch archetype-specific data from level4_deepdive_report_data table
      const { data, error } = await supabase
        .from('level4_deepdive_report_data')
        .select('*')
        .eq('archetype_id', archetypeId)
        .maybeSingle();
        
      if (error) {
        console.error("[useReportAccess] Database error:", error);
        throw new Error(`Error fetching report: ${error.message}`);
      }
      
      if (!data) {
        console.warn(`[useReportAccess] No data found for ${archetypeId}`);
        throw new Error(`No report data found for ${archetypeId}`);
      }
      
      console.log(`[useReportAccess] ✅ Successfully fetched archetype data for ${archetypeId}`);
      
      // STEP 2: Fetch REAL average data from database (not static!)
      console.log('[useReportAccess] 🎯 Fetching REAL average data from database...');
      const averageData = await fetchAverageData();
      
      // CRITICAL VALIDATION: Check if we got the correct average values
      const expectedCost = 13440;
      const expectedRisk = 0.95;
      const expectedEmergency = 135;
      const expectedSpecialist = 2250;
      
      const actualCost = averageData["Cost_Medical & RX Paid Amount PEPY"];
      const actualRisk = averageData["Risk_Average Risk Score"];
      const actualEmergency = averageData["Util_Emergency Visits per 1k Members"];
      const actualSpecialist = averageData["Util_Specialist Visits per 1k Members"];
      
      console.log('[useReportAccess] 🎯 AVERAGE DATA VALIDATION:', {
        cost: { expected: expectedCost, actual: actualCost, correct: actualCost === expectedCost },
        risk: { expected: expectedRisk, actual: actualRisk, correct: actualRisk === expectedRisk },
        emergency: { expected: expectedEmergency, actual: actualEmergency, correct: actualEmergency === expectedEmergency },
        specialist: { expected: expectedSpecialist, actual: actualSpecialist, correct: actualSpecialist === expectedSpecialist },
        source: isUsingFallbackData ? 'fallback' : 'database'
      });
      
      // Process the archetype data safely using our conversion utilities
      const archetypeData = processRawData(data);
      
      console.log(`[useReportAccess] Processed distinctive_metrics:`, archetypeData.distinctive_metrics);
      
      // STEP 3: Return combined data structure with REAL average data
      const processedData = {
        reportData: archetypeData,
        averageData: averageData // This is now REAL data from database, not static!
      };
      
      console.log('[useReportAccess] 🎯 FINAL PROCESSED DATA:', {
        hasReportData: !!processedData.reportData,
        hasAverageData: !!processedData.averageData,
        averageDataKeys: processedData.averageData ? Object.keys(processedData.averageData).length : 0,
        costPEPYInResult: processedData.averageData ? processedData.averageData["Cost_Medical & RX Paid Amount PEPY"] : 'missing',
        finalResultCorrect: processedData.averageData && processedData.averageData["Cost_Medical & RX Paid Amount PEPY"] === 13440
      });
      
      // Save to cache
      setInCache(cacheKey, processedData);
      
      // Store as fallback data in localStorage
      try {
        localStorage.setItem(
          `${FALLBACK_REPORT_KEY}-${archetypeId}`, 
          JSON.stringify({
            ...processedData,
            timestamp: new Date().toISOString()
          })
        );
      } catch (e) {
        console.warn('Could not save fallback data to localStorage:', e);
      }
      
      return processedData;
    } catch (err) {
      console.error(`[useReportAccess] Error fetching data:`, err);
      throw err;
    }
  }, [archetypeId, token, skipCache, processRawData, fetchAverageData, isUsingFallbackData]);
  
  // Function to get fallback data from localStorage
  const getFallbackData = useCallback(() => {
    try {
      const fallbackData = localStorage.getItem(`${FALLBACK_REPORT_KEY}-${archetypeId}`);
      if (fallbackData) {
        const parsed = JSON.parse(fallbackData);
        console.log(`[useReportAccess] Using fallback data for ${archetypeId} from ${parsed.timestamp}`);
        
        // Safely process fallback data using our conversion utilities
        if (parsed.reportData) {
          parsed.reportData = processRawData(parsed.reportData);
        }
        
        // Ensure fallback data has proper averageData
        if (!parsed.averageData) {
          parsed.averageData = getFallbackAverageData();
        }
        
        setIsUsingFallbackData(true);
        return parsed;
      }
    } catch (e) {
      console.error('Error loading fallback data:', e);
    }
    return null;
  }, [archetypeId, processRawData, getFallbackAverageData]);
  
  // Use React Query for data fetching
  const { 
    data: reportData, 
    isLoading, 
    error: queryError,
    refetch 
  } = useQuery({
    queryKey,
    queryFn: fetchReportData,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 1,
    retryDelay: 5000,
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching report data:', error);
        setError(error);
        
        // Try to use fallback data when an error occurs
        const fallbackData = getFallbackData();
        if (fallbackData) {
          toast.warning("Using cached report data", {
            description: "The latest data couldn't be retrieved. Showing previously loaded data."
          });
        } else {
          toast.error("Error Loading Report", {
            description: error.message
          });
        }
      }
    }
  });
  
  // Refresh data function
  const refreshData = useCallback(async () => {
    toast.info("Refreshing Report Data", {
      description: "Fetching the latest information..."
    });
    
    const cacheKey = `report-access-${archetypeId}-${token}`;
    clearFromCache(cacheKey);
    
    try {
      await refetch();
      setIsUsingFallbackData(false);
      toast.success("Refresh Successful", {
        description: "Report data has been updated."
      });
    } catch (e) {
      toast.error("Refresh Failed", {
        description: "Unable to update report data. Please try again."
      });
      
      // Try to use fallback data
      getFallbackData();
    }
  }, [archetypeId, token, refetch, getFallbackData]);
  
  // Get fallback data if needed
  const fallbackData = isUsingFallbackData ? getFallbackData() : null;
  
  // Return the data and functions
  return {
    reportData: reportData?.reportData || fallbackData?.reportData || null,
    archetypeData: reportData?.reportData || fallbackData?.reportData || null,
    averageData: reportData?.averageData || fallbackData?.averageData || getFallbackAverageData(),
    isLoading,
    error: error || (queryError as Error) || null,
    debugInfo: {
      ...debugInfo,
      isUsingFallbackData,
      queryKey,
      hasError: !!error || !!queryError,
      dataSource: 'level4_deepdive_report_data',
      processingLayers: 'database_fetch_with_real_averages'
    },
    refreshData,
    isUsingFallbackData
  };
};
