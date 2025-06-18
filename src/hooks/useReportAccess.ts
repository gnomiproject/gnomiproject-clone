import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArchetypeDetailedData, ArchetypeId } from '@/types/archetype';
import { getFromCache, setInCache, clearFromCache } from '@/utils/reports/reportCache';
import { AverageDataService, StandardizedAverageData } from '@/services/AverageDataService';

interface UseReportAccessParams {
  archetypeId: ArchetypeId;
  token?: string;
  isAdminView?: boolean;
  skipCache?: boolean;
}

interface UseReportAccessResult {
  reportData: any | null;
  archetypeData: any | null;
  averageData: StandardizedAverageData;
  isLoading: boolean;
  error: Error | null;
  debugInfo: any;
  refreshData: () => void;
  isUsingFallbackData: boolean;
}

export const useReportAccess = ({
  archetypeId,
  token,
  isAdminView = false,
  skipCache = false
}: UseReportAccessParams): UseReportAccessResult => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [isUsingFallbackData, setIsUsingFallbackData] = useState(false);
  const queryClient = useQueryClient();

  // Create stable query key
  const queryKey = ['report-access', archetypeId, token, isAdminView];

  const {
    data: result,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey,
    queryFn: async () => {
      console.log(`[useReportAccess] Fetching report data for ${archetypeId}`);
      
      // Check cache first unless explicitly skipping
      const cacheKey = `report-access-${archetypeId}-${token}`;
      if (!skipCache) {
        const cachedResult = getFromCache(cacheKey);
        if (cachedResult) {
          console.log(`[useReportAccess] Using cached data for ${archetypeId}`);
          setIsUsingFallbackData(false);
          return cachedResult;
        }
      }

      try {
        // Determine the correct table
        const tableName = isAdminView ? 'level4_deepdive_report_data' : 'level4_report_secure';
        console.log(`[useReportAccess] Fetching from ${tableName} for ${archetypeId}`);

        // Fetch report data with timeout
        const fetchPromise = supabase
          .from(tableName)
          .select('*')
          .eq('archetype_id', archetypeId)
          .single();

        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Report query timeout')), 15000);
        });

        const { data: reportData, error: reportError } = await Promise.race([
          fetchPromise, 
          timeoutPromise
        ]) as any;

        if (reportError || !reportData) {
          // Try fallback cache
          const fallbackCacheKey = `${cacheKey}-fallback`;
          const fallbackData = getFromCache(fallbackCacheKey);
          if (fallbackData) {
            console.log(`[useReportAccess] Using fallback cached data for ${archetypeId}`);
            setIsUsingFallbackData(true);
            return fallbackData;
          }
          throw new Error(reportError?.message || 'No report data found');
        }

        // Get average data from service (with its own caching and fallback)
        const averageDataService = new AverageDataService();
        const averageData = await averageDataService.getAverageData();

        const result = {
          reportData,
          archetypeData: reportData,
          averageData,
          isUsingFallbackData: averageDataService.isUsingFallbackData()
        };

        // Cache the successful result
        setInCache(cacheKey, result);
        setIsUsingFallbackData(averageDataService.isUsingFallbackData());

        console.log(`[useReportAccess] Successfully fetched data for ${archetypeId}`);
        return result;

      } catch (fetchError) {
        console.error(`[useReportAccess] Error fetching data:`, fetchError);
        
        // Try any available cache as last resort
        const fallbackCacheKey = `${cacheKey}-fallback`;
        const fallbackData = getFromCache(fallbackCacheKey);
        if (fallbackData) {
          console.log(`[useReportAccess] Using emergency fallback cache`);
          setIsUsingFallbackData(true);
          return fallbackData;
        }

        throw fetchError;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry timeout errors immediately
      if (error.message.includes('timeout')) {
        return failureCount < 1;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false
  });

  // Update debug info
  useEffect(() => {
    setDebugInfo({
      dataSource: isAdminView ? 'level4_deepdive_report_data' : 'level4_report_secure',
      hasReportData: !!result?.reportData,
      hasAverageData: !!result?.averageData,
      isUsingFallbackData,
      timestamp: new Date().toISOString(),
      queryKey: queryKey.join('-')
    });
  }, [result, isAdminView, isUsingFallbackData, queryKey]);

  const refreshData = useCallback(() => {
    console.log(`[useReportAccess] Manual refresh for ${archetypeId}`);
    
    // Clear related caches
    const cacheKey = `report-access-${archetypeId}-${token}`;
    clearFromCache(cacheKey);
    clearFromCache(`${cacheKey}-fallback`);
    
    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey });
    refetch();
  }, [archetypeId, token, queryClient, refetch, queryKey]);

  return {
    reportData: result?.reportData || null,
    archetypeData: result?.archetypeData || null,
    averageData: result?.averageData || {},
    isLoading,
    error: error as Error | null,
    debugInfo,
    refreshData,
    isUsingFallbackData: result?.isUsingFallbackData || isUsingFallbackData
  };
};
