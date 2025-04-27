
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ArchetypeId } from '@/types/archetype';

interface UseReportDataOptions {
  archetypeId?: string;
  token?: string;
  isInsightsReport: boolean;
  skipCache?: boolean;
}

interface UseReportDataResult {
  reportData: any;
  userData: any;
  averageData: any;
  isLoading: boolean;
  isValidAccess: boolean;
  error: Error | null;
  dataSource: string;
  retry: () => void;
  refreshData: () => Promise<void>;
}

// Simple in-memory cache
const reportCache = new Map();

export const useReportData = ({ 
  archetypeId = '', 
  token = '', 
  isInsightsReport, 
  skipCache = false 
}: UseReportDataOptions): UseReportDataResult => {
  const [reportData, setReportData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [averageData, setAverageData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isValidAccess, setIsValidAccess] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [dataSource, setDataSource] = useState<string>('');

  // Load report data on mount - ensure this effect runs unconditionally
  useEffect(() => {
    let isMounted = true;
    
    const loadReportData = async () => {
      // Always reset states at the start of data loading
      if (isMounted) {
        setIsLoading(true);
        setError(null);
      }

      try {
        const cacheKey = `report-${archetypeId}-${token}`;
        
        // Check cache first if not skipping
        if (!skipCache && reportCache.has(cacheKey)) {
          const cachedData = reportCache.get(cacheKey);
          if (isMounted) {
            setReportData(cachedData.reportData);
            setUserData(cachedData.userData);
            setAverageData(cachedData.averageData);
            setIsValidAccess(true);
            setDataSource('cache');
            setIsLoading(false);
          }
          return;
        }
        
        // Check for valid archetypeId
        if (!archetypeId) {
          if (isMounted) {
            setError(new Error('Missing archetype ID'));
            setIsLoading(false);
            setIsValidAccess(false);
          }
          return;
        }
        
        // Validate token and fetch report data
        let accessData = null;
        let accessError = null;
        
        // Only validate token if one was provided
        if (token) {
          const accessResult = await supabase
            .from('report_requests')
            .select('id, archetype_id, name, organization, email, created_at')
            .eq('archetype_id', archetypeId)
            .eq('access_token', token)
            .gt('expires_at', new Date().toISOString())
            .maybeSingle();
            
          accessData = accessResult.data;
          accessError = accessResult.error;
        }
        
        // Handle validation errors but continue with fetching data
        if (accessError) {
          console.error('Token validation error:', accessError);
        }
        
        // If token validation fails, mark access as invalid but continue getting data
        if (token && !accessData) {
          if (isMounted) {
            setIsValidAccess(false);
            setError(new Error('Invalid or expired access token'));
          }
        } else {
          if (isMounted) {
            setIsValidAccess(true);
          }
        }
        
        // Fetch report data regardless of token validity
        const reportTable = isInsightsReport ? 'level3_report_data' : 'level4_deepdive_report_data';
        const { data: fetchedReportData, error: reportError } = await supabase
          .from(reportTable)
          .select('*')
          .eq('archetype_id', archetypeId)
          .maybeSingle();
        
        if (reportError) {
          throw reportError;
        }
        
        if (!fetchedReportData) {
          console.warn(`No report data found for archetype ${archetypeId}. Trying fallback...`);
          
          // Try alternate table as fallback
          const fallbackTable = isInsightsReport ? 'level4_deepdive_report_data' : 'level3_report_data';
          const { data: fallbackData, error: fallbackError } = await supabase
            .from(fallbackTable)
            .select('*')
            .eq('archetype_id', archetypeId)
            .maybeSingle();
          
          if (fallbackError) throw fallbackError;
          
          if (!fallbackData) {
            console.warn(`No fallback data found for archetype ${archetypeId}`);
          } else {
            if (isMounted) {
              setReportData(fallbackData);
              setDataSource(`${fallbackTable} (fallback)`);
            }
          }
        } else {
          if (isMounted) {
            setReportData(fetchedReportData);
            setDataSource(reportTable);
          }
        }
        
        // Create average data
        const defaultAverageData = {
          archetype_id: 'All_Average',
          archetype_name: 'Population Average',
          "Demo_Average Age": 40,
          "Demo_Average Family Size": 3.0,
          "Risk_Average Risk Score": 1.0,
          "Cost_Medical & RX Paid Amount PMPY": 5000
        };
        
        if (isMounted) {
          setAverageData(defaultAverageData);
          setUserData(accessData);
        }
        
        // Cache the result if we have data
        if (fetchedReportData) {
          reportCache.set(cacheKey, {
            reportData: fetchedReportData,
            userData: accessData,
            averageData: defaultAverageData
          });
        }
      } catch (err) {
        console.error('Error loading report data:', err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error loading report'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    // Call the function
    loadReportData();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [archetypeId, token, isInsightsReport, skipCache]);
  
  // Function to retry loading data
  const retry = () => {
    setIsLoading(true);
    setError(null);
    
    // Clear cache for this report
    const cacheKey = `report-${archetypeId}-${token}`;
    reportCache.delete(cacheKey);
  };
  
  // Function to refresh data and skip cache
  const refreshData = async () => {
    setIsLoading(true);
    setError(null);
    
    // Clear cache for this report
    const cacheKey = `report-${archetypeId}-${token}`;
    reportCache.delete(cacheKey);
    
    return Promise.resolve();
  };
  
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
