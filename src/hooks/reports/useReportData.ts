
import { useState, useCallback, useEffect } from 'react';
import { getDataSource } from '@/utils/reports/schemaMapping';
import { supabase } from '@/integrations/supabase/client';
import { ReportType } from '@/types/reports';
import { getFromCache, setInCache, clearFromCache } from '@/utils/reports/reportCache';
import { processReportData, AverageData } from '@/utils/reports/reportDataTransforms';
import { toast } from "@/hooks/use-toast";
import { ArchetypeDetailedData } from '@/types/archetype';
import { fetchTokenAccess, fetchReportData } from './useFetchReportData';

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
}

export const useReportData = ({ 
  archetypeId = '', 
  token = '', 
  isInsightsReport, 
  skipCache = false 
}: UseReportDataOptions): UseReportDataResult => {
  const [reportData, setReportData] = useState<ArchetypeDetailedData | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [averageData, setAverageData] = useState<AverageData>(processReportData(null).averageData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isValidAccess, setIsValidAccess] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [dataSource, setDataSource] = useState<string>('');

  const loadReportData = useCallback(async () => {
    if (!archetypeId) {
      setError(new Error('Missing archetype ID'));
      setIsLoading(false);
      setIsValidAccess(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const cacheKey = `report-${archetypeId}-${token}`;
      
      // Check cache first if not skipping
      if (!skipCache) {
        const cachedData = getFromCache(cacheKey);
        if (cachedData) {
          setReportData(cachedData.data.reportData);
          setUserData(cachedData.data.userData);
          setAverageData(cachedData.data.averageData);
          setIsValidAccess(true);
          setDataSource('cache');
          setIsLoading(false);
          return;
        }
      }

      // Determine report type and data source
      const reportType: ReportType = isInsightsReport ? 'insight' : 'deepDive';
      
      // Validate token access if provided
      if (token) {
        const { data: accessData, error: accessError } = await fetchTokenAccess(archetypeId, token);
        
        if (accessError) {
          console.error('Token validation error:', accessError);
        }
        
        if (!accessData) {
          setIsValidAccess(false);
          setError(new Error('Invalid or expired access token'));
          setIsLoading(false);
          return;
        }
        
        setIsValidAccess(true);
        setUserData(accessData);
      } else {
        setIsValidAccess(true);
      }

      // Fetch report data
      const fetchedData = await fetchReportData(archetypeId, reportType);
      
      if (fetchedData) {
        const processedData = processReportData(fetchedData);
        setReportData(processedData.reportData);
        setAverageData(processedData.averageData);
        setDataSource(getDataSource(reportType));

        // Cache successful results
        setInCache(cacheKey, {
          reportData: processedData.reportData,
          userData,
          averageData: processedData.averageData
        });
      }

    } catch (err) {
      console.error('Error loading report data:', err);
      setError(err instanceof Error ? err : new Error('Unknown error loading report'));
    } finally {
      setIsLoading(false);
    }
  }, [archetypeId, token, isInsightsReport, skipCache]);

  // Load data on mount and when dependencies change
  useEffect(() => {
    loadReportData();
  }, [loadReportData]);

  const retry = useCallback(() => {
    setIsLoading(true);
    setError(null);
    const cacheKey = `report-${archetypeId}-${token}`;
    clearFromCache(cacheKey);
  }, [archetypeId, token]);

  const refreshData = useCallback(async () => {
    toast({
      title: "Refreshing Report Data",
      description: "Fetching the latest information..."
    });
    
    const cacheKey = `report-${archetypeId}-${token}`;
    clearFromCache(cacheKey);
    
    try {
      await loadReportData();
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
  }, [archetypeId, token, loadReportData]);

  return {
    reportData,
    userData,
    averageData,
    isLoading,
    isValidAccess,
    error,
    dataSource,
    retry,
    refreshData
  };
};
