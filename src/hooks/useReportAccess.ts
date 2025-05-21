
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { ArchetypeDetailedData, ArchetypeId, FamilyId } from '@/types/archetype';
import { getFromCache, setInCache, clearFromCache } from '@/utils/reports/reportCache';
import { processReportData } from '@/utils/reports/reportDataTransforms';
import { trackReportAccess } from '@/utils/reports/accessTracking';
import { ensureArray } from '@/utils/array/ensureArray';
import { ensureStringArray } from '@/utils/array/ensureStringArray';

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
  
  // Function to fetch report data from level4_report_secure
  const fetchReportData = useCallback(async () => {
    console.log(`[useReportAccess] Fetching report data for ${archetypeId}`);
    
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
        
        // Ensure key_characteristics is properly formatted in cached data
        if (cachedData.data?.reportData) {
          // Create a new object with properly typed key_characteristics first
          const keyCharacteristicsArray = ensureStringArray(cachedData.data.reportData?.key_characteristics) as string[];
          cachedData.data.reportData = {
            key_characteristics: keyCharacteristicsArray,
            ...cachedData.data.reportData
          };
        }
        
        return cachedData.data;
      }
    }
    
    // For admin view or valid token, fetch the data
    try {
      // Fetch from level4_report_secure table
      const { data, error } = await supabase
        .from('level4_report_secure')
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
      
      // Convert key_characteristics to string[] before creating mappedData
      const keyCharacteristicsArray = ensureStringArray(data.key_characteristics) as string[];
      
      // Then create the mappedData object with explicit typing
      const mappedData: ArchetypeDetailedData = {
        id: data.archetype_id as ArchetypeId,
        name: data.archetype_name,
        familyId: data.family_id as FamilyId || 'unknown' as FamilyId,
        key_characteristics: keyCharacteristicsArray, // Explicitly use the string array we prepared
        short_description: data.short_description,
        long_description: data.long_description,
        hexColor: data.hex_color,
        industries: data.industries,
        detailed_metrics: data.detailed_metrics,
        disease_prevalence: data.disease_prevalence,
        // Include any additional properties from the original data
        // but use the stringified array for key_characteristics
        ...Object.fromEntries(
          Object.entries(data).filter(([key]) => key !== 'key_characteristics')
        )
      };
      
      // Process the data with async now
      const processedData = await processReportData(mappedData);
      
      // Save to cache - include empty userData to match expected cache structure
      setInCache(cacheKey, {
        ...processedData,
        userData: {}
      });
      
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
  }, [archetypeId, token, skipCache]);
  
  // Function to get fallback data from localStorage
  const getFallbackData = useCallback(() => {
    try {
      const fallbackData = localStorage.getItem(`${FALLBACK_REPORT_KEY}-${archetypeId}`);
      if (fallbackData) {
        const parsed = JSON.parse(fallbackData);
        console.log(`[useReportAccess] Using fallback data for ${archetypeId} from ${parsed.timestamp}`);
        
        // Ensure key_characteristics is properly formatted in fallback data
        if (parsed.reportData) {
          // Create a new object with properly typed key_characteristics
          const keyCharacteristicsArray = ensureStringArray(parsed.reportData?.key_characteristics) as string[];
          parsed.reportData = {
            key_characteristics: keyCharacteristicsArray,
            ...parsed.reportData
          };
        }
        
        setIsUsingFallbackData(true);
        return parsed;
      }
    } catch (e) {
      console.error('Error loading fallback data:', e);
    }
    return null;
  }, [archetypeId]);
  
  // Use React Query for data fetching - using the meta property for error handling in v5
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
      // Use meta property instead of onError
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
  
  // Return the data and functions
  return {
    reportData: reportData?.reportData || (isUsingFallbackData ? getFallbackData()?.reportData : null),
    archetypeData: reportData?.reportData || (isUsingFallbackData ? getFallbackData()?.reportData : null),
    averageData: reportData?.averageData || (isUsingFallbackData ? getFallbackData()?.averageData : null),
    isLoading,
    error: error || (queryError as Error) || null,
    debugInfo: {
      ...debugInfo,
      isUsingFallbackData,
      queryKey,
      hasError: !!error || !!queryError
    },
    refreshData,
    isUsingFallbackData
  };
};
