
import { useState, useCallback, useEffect } from 'react';
import { ReportType } from '@/types/reports';
import { getDataSource } from '@/utils/reports/schemaMapping';
import { supabase } from '@/integrations/supabase/client';
import { getFromCache, setInCache, clearFromCache } from '@/utils/reports/reportCache';
import { processReportData, AverageData } from '@/utils/reports/reportDataTransforms';
import { toast } from "@/hooks/use-toast";
import { ArchetypeDetailedData } from '@/types/archetype';
import { fetchTokenAccess, fetchReportData } from './useFetchReportData';
import { useQuery } from '@tanstack/react-query';
import { staticDataQueryOptions, reportDataQueryOptions } from '@/utils/query/queryConfig';

// Local storage key for fallback report data
const FALLBACK_REPORT_KEY = 'report_data_fallback';

interface UseReportDataOptions {
  archetypeId?: string;
  token?: string;
  isInsightsReport: boolean;
  skipCache?: boolean;
}

interface UseReportDataResult {
  reportData: ArchetypeDetailedData | null;
  userData: any;
  averageData: AverageData;
  isLoading: boolean;
  isValidAccess: boolean;
  error: Error | null;
  dataSource: string;
  retry: () => void;
  refreshData: () => Promise<void>;
  isUsingFallbackData?: boolean;
}

export const useReportData = ({ 
  archetypeId = '', 
  token = '', 
  isInsightsReport, 
  skipCache = false 
}: UseReportDataOptions): UseReportDataResult => {
  const [userData, setUserData] = useState<any>(null);
  const [averageData, setAverageData] = useState<AverageData>(processReportData(null).then(result => result.averageData));
  const [isValidAccess, setIsValidAccess] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [dataSource, setDataSource] = useState<string>('');
  const [isUsingFallbackData, setIsUsingFallbackData] = useState<boolean>(false);

  // Initialize report type and queryKey
  const reportType: ReportType = isInsightsReport ? 'insight' : 'deepDive';
  const queryKey = ['report', archetypeId, token, reportType];
  
  // Initialize averageData with default values
  useEffect(() => {
    const initializeAverageData = async () => {
      try {
        const defaultProcessed = await processReportData(null);
        setAverageData(defaultProcessed.averageData);
      } catch (err) {
        console.error("Error initializing average data:", err);
      }
    };
    
    initializeAverageData();
  }, []);
  
  // Function to validate token access
  const validateTokenAccess = useCallback(async () => {
    if (!archetypeId) {
      setError(new Error('Missing archetype ID'));
      setIsValidAccess(false);
      return false;
    }

    // If no token provided, consider it valid access for insights reports
    if (!token && isInsightsReport) {
      setIsValidAccess(true);
      return true;
    }

    // Validate token access if provided
    if (token) {
      try {
        const { data: accessData, error: accessError } = await fetchTokenAccess(archetypeId, token);
        
        if (accessError) {
          console.error('Token validation error:', accessError);
          setError(new Error(accessError.message || 'Invalid or expired access token'));
          setIsValidAccess(false);
          return false;
        }
        
        if (!accessData) {
          setIsValidAccess(false);
          return false;
        }
        
        setUserData(accessData);
        setIsValidAccess(true);
        return true;
      } catch (err) {
        console.error('Error validating token:', err);
        setError(err instanceof Error ? err : new Error('Unknown error validating token'));
        setIsValidAccess(false);
        return false;
      }
    }

    // No token and not insights report - not valid
    setIsValidAccess(false);
    return false;
  }, [archetypeId, token, isInsightsReport]);

  // Effect to validate token on mount or when dependencies change
  useEffect(() => {
    validateTokenAccess();
  }, [validateTokenAccess]);

  // Function to fetch report data
  const fetchReport = useCallback(async () => {
    if (!archetypeId) {
      throw new Error('Missing archetype ID');
    }

    // Cache key for the report data
    const cacheKey = `report-${archetypeId}-${token}`;
    
    // Check cache first if not skipping
    if (!skipCache) {
      const cachedData = getFromCache(cacheKey);
      if (cachedData) {
        console.log(`[useReportData] Using cached data for ${archetypeId}`);
        return {
          reportData: cachedData.data.reportData,
          averageData: cachedData.data.averageData
        };
      }
    }

    // Fetch the report data
    const reportData = await fetchReportData(archetypeId, reportType);
    
    if (!reportData) {
      throw new Error(`No report data found for ${archetypeId}`);
    }
    
    // Process the data asynchronously and await the result
    const processedData = await processReportData(reportData);
    
    // Save to cache
    setInCache(cacheKey, {
      reportData: processedData.reportData,
      userData,
      averageData: processedData.averageData
    });
    
    // Store as fallback data in localStorage
    try {
      localStorage.setItem(
        `${FALLBACK_REPORT_KEY}-${archetypeId}`, 
        JSON.stringify({
          reportData: processedData.reportData,
          averageData: processedData.averageData,
          timestamp: new Date().toISOString()
        })
      );
    } catch (e) {
      console.warn('Could not save fallback data to localStorage:', e);
    }
    
    return processedData;
  }, [archetypeId, token, userData, reportType, skipCache]);

  // Function to get fallback data from localStorage
  const getFallbackData = useCallback(() => {
    try {
      const fallbackData = localStorage.getItem(`${FALLBACK_REPORT_KEY}-${archetypeId}`);
      if (fallbackData) {
        const parsed = JSON.parse(fallbackData);
        console.log(`[useReportData] Using fallback data for ${archetypeId} from ${parsed.timestamp}`);
        setIsUsingFallbackData(true);
        return {
          reportData: parsed.reportData,
          averageData: parsed.averageData
        };
      }
    } catch (e) {
      console.error('Error loading fallback data:', e);
    }
    return null;
  }, [archetypeId]);

  // Use React Query for data fetching with the correct property names for v5
  const { 
    data: reportDataResult, 
    isLoading, 
    error: queryError,
    refetch 
  } = useQuery({
    queryKey,
    queryFn: fetchReport,
    ...reportDataQueryOptions,
    enabled: isValidAccess && !!archetypeId,
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching report data:', error);
        setError(error);
        
        // Try to use fallback data when an error occurs
        const fallbackData = getFallbackData();
        if (fallbackData) {
          // Set the result data directly
          setAverageData(fallbackData.averageData);
          toast({
            title: "Using cached report data",
            description: "The latest data couldn't be retrieved. Showing previously loaded data.",
            variant: "default"
          });
        } else {
          toast({
            title: "Error Loading Report",
            description: error.message,
            variant: "destructive"
          });
        }
      }
    }
  });

  // Update average data when report data changes
  useEffect(() => {
    if (reportDataResult) {
      setAverageData(reportDataResult.averageData);
      setDataSource(getDataSource(reportType));
      setIsUsingFallbackData(false);
    }
  }, [reportDataResult, reportType]);

  // Retry function
  const retry = useCallback(() => {
    setError(null);
    const cacheKey = `report-${archetypeId}-${token}`;
    clearFromCache(cacheKey);
    refetch();
  }, [archetypeId, token, refetch]);

  // Refresh data function
  const refreshData = useCallback(async () => {
    toast({
      title: "Refreshing Report Data",
      description: "Fetching the latest information..."
    });
    
    const cacheKey = `report-${archetypeId}-${token}`;
    clearFromCache(cacheKey);
    
    try {
      await refetch();
      toast({
        title: "Refresh Successful",
        description: "Report data has been updated."
      });
    } catch (e) {
      toast({
        title: "Refresh Failed",
        description: "Unable to update report data. Please try again.",
        variant: "destructive"
      });
    }
  }, [archetypeId, token, refetch]);

  return {
    reportData: reportDataResult?.reportData || null,
    userData,
    averageData,
    isLoading,
    isValidAccess,
    error: error || (queryError as Error) || null,
    dataSource,
    retry,
    refreshData,
    isUsingFallbackData
  };
};
