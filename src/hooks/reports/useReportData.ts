
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { ArchetypeDetailedData, ArchetypeId } from '@/types/archetype';
import { trackReportAccess } from '@/utils/reports/accessTracking';
import { getFromCache, setInCache, clearFromCache } from '@/utils/reports/reportCache';
import { processReportData, ProcessedReportData } from '@/utils/reports/reportDataTransforms';
import { averageDataService, StandardizedAverageData } from '@/services/AverageDataService';
import { percentageCalculatorService } from '@/services/PercentageCalculatorService';

interface UseReportDataResult {
  reportData: ArchetypeDetailedData | null;
  averageData: StandardizedAverageData;
  isLoading: boolean;
  error: Error | null;
  debugInfo: any;
  refreshData: () => void;
  isUsingFallbackData: boolean;
}

export const useReportData = (
  archetypeId: ArchetypeId,
  token?: string,
  isAdminView: boolean = false
): UseReportDataResult => {
  const [error, setError] = useState<Error | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [isUsingFallbackData, setIsUsingFallbackData] = useState(false);

  // Create a stable cache key
  const cacheKey = `report-data-${archetypeId}-${isAdminView ? 'admin' : 'user'}`;

  const {
    data: processedData,
    isLoading,
    error: queryError,
    refetch
  } = useQuery({
    queryKey: ['report-data', archetypeId, isAdminView],
    queryFn: async () => {
      console.log(`[useReportData] Fetching data for ${archetypeId}, admin: ${isAdminView}`);
      
      try {
        // Try to get from cache first
        const cachedData = getFromCache(cacheKey);
        if (cachedData) {
          console.log(`[useReportData] Using cached data for ${archetypeId}`);
          setIsUsingFallbackData(false);
          return cachedData;
        }

        // Determine which table to use based on admin status
        const tableName = isAdminView ? 'level4_report_secure' : 'level4_report_secure';
        
        console.log(`[useReportData] Fetching from ${tableName} for ${archetypeId}`);
        
        // Fetch the main report data
        const { data: reportData, error: reportError } = await supabase
          .from(tableName)
          .select('*')
          .eq('archetype_id', archetypeId)
          .single();

        if (reportError) {
          console.error(`[useReportData] Error fetching from ${tableName}:`, reportError);
          throw new Error(`Failed to fetch report data: ${reportError.message}`);
        }

        if (!reportData) {
          throw new Error('No report data found');
        }

        // Convert the database result to ArchetypeDetailedData format
        const typedReportData = reportData as unknown as ArchetypeDetailedData;

        // Process the data using the centralized service
        const processedReportData = await processReportData(typedReportData);
        
        // Cache the processed data
        setInCache(cacheKey, processedReportData);
        setIsUsingFallbackData(false);
        
        console.log(`[useReportData] Successfully processed data for ${archetypeId}`);
        return processedReportData;

      } catch (fetchError) {
        console.error(`[useReportData] Error in data fetching:`, fetchError);
        
        // Try to get fallback data from cache
        const fallbackData = getFromCache(`${cacheKey}-fallback`);
        if (fallbackData) {
          console.log(`[useReportData] Using fallback cached data for ${archetypeId}`);
          setIsUsingFallbackData(true);
          return fallbackData;
        }
        
        // As a last resort, create minimal data structure
        console.log(`[useReportData] Creating minimal fallback data for ${archetypeId}`);
        const fallbackProcessedData = await processReportData(null);
        setIsUsingFallbackData(true);
        return fallbackProcessedData;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  });

  // Track access when data is loaded (only for non-admin views with tokens)
  useEffect(() => {
    if (!isAdminView && token && archetypeId && processedData?.reportData) {
      trackReportAccess(archetypeId, token);
    }
  }, [archetypeId, token, isAdminView, processedData]);

  // Update error state
  useEffect(() => {
    if (queryError) {
      setError(queryError as Error);
    } else {
      setError(null);
    }
  }, [queryError]);

  // Update debug info
  useEffect(() => {
    setDebugInfo({
      dataSource: isAdminView ? 'level4_report_secure (admin)' : 'level4_report_secure',
      hasReportData: !!processedData?.reportData,
      hasAverageData: !!processedData?.averageData,
      isUsingFallbackData,
      cacheKey,
      timestamp: new Date().toISOString()
    });
  }, [processedData, isAdminView, isUsingFallbackData, cacheKey]);

  const refreshData = useCallback(() => {
    console.log(`[useReportData] Manual refresh requested for ${archetypeId}`);
    
    // Clear caches
    clearFromCache(cacheKey);
    averageDataService.clearCache();
    percentageCalculatorService.clearCache();
    
    // Refetch data
    refetch();
    
    toast.success('Data refreshed', {
      description: 'Report data has been updated from the server'
    });
  }, [cacheKey, refetch, archetypeId]);

  return {
    reportData: processedData?.reportData || null,
    averageData: processedData?.averageData || {},
    isLoading,
    error,
    debugInfo,
    refreshData,
    isUsingFallbackData
  };
};
