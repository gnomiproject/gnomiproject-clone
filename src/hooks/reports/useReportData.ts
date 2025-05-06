
import { useState, useCallback, useEffect } from 'react';
import { ReportType } from '@/types/reports';
import { getDataSource } from '@/utils/reports/schemaMapping';
import { supabase } from '@/integrations/supabase/client';
import { getFromCache, setInCache, clearFromCache } from '@/utils/reports/reportCache';
import { processReportData, AverageData, createDefaultAverageData } from '@/utils/reports/reportDataTransforms';
import { toast } from "@/hooks/use-toast";
import { ArchetypeDetailedData } from '@/types/archetype';
import { fetchTokenAccess, fetchReportData } from './useFetchReportData';
import { useQuery } from '@tanstack/react-query';

// Local storage key for fallback report data
const FALLBACK_REPORT_KEY = 'report_data_fallback';
// Cache TTL - 24 hours
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

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

/**
 * Enhanced hook for fetching and managing report data with persistent caching
 * - Uses Infinity staleTime to prevent unnecessary refetches
 * - Implements persistent localStorage cache with 24-hour TTL
 * - Provides graceful fallback when network or validation fails
 * - Simplifies error handling with detailed logging
 */
export const useReportData = ({ 
  archetypeId = '', 
  token = '', 
  isInsightsReport, 
  skipCache = false 
}: UseReportDataOptions): UseReportDataResult => {
  const [userData, setUserData] = useState<any>(null);
  // Start with default average data
  const [averageData, setAverageData] = useState<AverageData>(createDefaultAverageData());
  const [isValidAccess, setIsValidAccess] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [dataSource, setDataSource] = useState<string>('');
  const [isUsingFallbackData, setIsUsingFallbackData] = useState<boolean>(false);

  // Initialize report type and queryKey
  const reportType: ReportType = isInsightsReport ? 'insight' : 'deepDive';
  const queryKey = ['report', archetypeId, token, reportType];
  
  // Initialize averageData with values from database when component mounts
  useEffect(() => {
    const initializeAverageData = async () => {
      try {
        const defaultProcessed = await processReportData(null);
        setAverageData(defaultProcessed.averageData);
      } catch (err) {
        console.error("Error initializing average data:", err);
        // We already have default values from createDefaultAverageData()
      }
    };
    
    initializeAverageData();
  }, []);
  
  // Function to validate token access
  const validateTokenAccess = useCallback(async () => {
    console.log(`[useReportData] Validating token access for ${archetypeId}, token: ${token?.substring(0, 5) || 'none'}`);
    
    if (!archetypeId) {
      setError(new Error('Missing archetype ID'));
      setIsValidAccess(false);
      return false;
    }

    // If no token provided, consider it valid access for insights reports
    if (!token && isInsightsReport) {
      console.log('[useReportData] No token for insights report - considering valid');
      setIsValidAccess(true);
      return true;
    }

    // Special case for admin-view token
    if (token === 'admin-view') {
      console.log('[useReportData] Admin view token - always valid');
      setIsValidAccess(true);
      return true;
    }

    // Validate token access if provided
    if (token) {
      try {
        // Try to load from session storage first for faster response
        const sessionKey = `token-validation-${archetypeId}-${token}`;
        const cachedValidation = sessionStorage.getItem(sessionKey);
        
        if (cachedValidation) {
          try {
            const parsedValidation = JSON.parse(cachedValidation);
            const validUntil = parsedValidation.validUntil || 0;
            
            // If validation cache is still valid (10 minutes), use it
            if (validUntil > Date.now()) {
              console.log('[useReportData] Using cached token validation from session storage');
              setUserData(parsedValidation.userData || null);
              setIsValidAccess(parsedValidation.isValid || false);
              return parsedValidation.isValid || false;
            }
          } catch (e) {
            console.warn('Error parsing cached token validation:', e);
          }
        }
        
        const { data: accessData, error: accessError } = await fetchTokenAccess(archetypeId, token);
        
        // Cache the validation result in session storage for 10 minutes
        try {
          sessionStorage.setItem(sessionKey, JSON.stringify({
            isValid: !accessError && !!accessData,
            userData: accessData,
            validUntil: Date.now() + (10 * 60 * 1000) // 10 minutes
          }));
        } catch (e) {
          console.warn('Error saving token validation to session storage:', e);
        }
        
        if (accessError) {
          console.error('[useReportData] Token validation error:', accessError);
          setError(new Error(accessError.message || 'Invalid or expired access token'));
          setIsValidAccess(false);
          return false;
        }
        
        if (!accessData) {
          console.warn('[useReportData] No access data returned for token');
          setIsValidAccess(false);
          return false;
        }
        
        console.log('[useReportData] Token validated successfully');
        setUserData(accessData);
        setIsValidAccess(true);
        return true;
      } catch (err) {
        console.error('[useReportData] Error validating token:', err);
        setError(err instanceof Error ? err : new Error('Unknown error validating token'));
        setIsValidAccess(false);
        return false;
      }
    }

    // No token and not insights report - not valid
    console.warn('[useReportData] No token for non-insights report - invalid access');
    setIsValidAccess(false);
    return false;
  }, [archetypeId, token, isInsightsReport]);

  // Effect to validate token on mount or when dependencies change
  useEffect(() => {
    validateTokenAccess();
  }, [validateTokenAccess]);

  // Function to fetch report data
  const fetchReport = useCallback(async () => {
    console.log(`[useReportData] Fetching report for ${archetypeId}`);
    
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
    console.log(`[useReportData] Fetching from database for ${archetypeId}`);
    const reportData = await fetchReportData(archetypeId, reportType);
    
    if (!reportData) {
      throw new Error(`No report data found for ${archetypeId}`);
    }
    
    // Process the data asynchronously and await the result
    const processedData = await processReportData(reportData);
    
    // Save to cache with 24-hour TTL
    setInCache(cacheKey, {
      reportData: processedData.reportData,
      userData,
      averageData: processedData.averageData
    });
    
    // Store as fallback data in localStorage with extended TTL
    try {
      localStorage.setItem(
        `${FALLBACK_REPORT_KEY}-${archetypeId}`, 
        JSON.stringify({
          reportData: processedData.reportData,
          averageData: processedData.averageData,
          timestamp: Date.now(),
          expires: Date.now() + CACHE_TTL_MS
        })
      );
      console.log(`[useReportData] Saved fallback data to localStorage for ${archetypeId}`);
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
        const now = Date.now();
        const isExpired = parsed.expires && parsed.expires < now;
        
        if (isExpired) {
          console.warn(`[useReportData] Fallback data expired for ${archetypeId}, expired at ${new Date(parsed.expires).toLocaleString()}`);
          return null;
        }
        
        console.log(`[useReportData] Using fallback data for ${archetypeId} from ${new Date(parsed.timestamp).toLocaleString()}`);
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

  // Use React Query for data fetching with optimized config
  const { 
    data: reportDataResult, 
    isLoading, 
    error: queryError,
    refetch 
  } = useQuery({
    queryKey,
    queryFn: fetchReport,
    staleTime: Infinity, // Never consider data stale
    gcTime: Infinity,    // Never garbage collect
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 1,
    retryDelay: 3000,
    enabled: !!archetypeId,
    meta: {
      onError: (error: Error) => {
        console.error('[useReportData] Error fetching report data:', error);
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
    console.log('[useReportData] Retrying data fetch');
    setError(null);
    const cacheKey = `report-${archetypeId}-${token}`;
    clearFromCache(cacheKey);
    refetch();
  }, [archetypeId, token, refetch]);

  // Refresh data function
  const refreshData = useCallback(async () => {
    console.log('[useReportData] Refreshing data');
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
      console.error('[useReportData] Refresh failed:', e);
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
