import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getReportSchema, getDataSource } from '@/utils/reports/schemaUtils';
import type { ReportType } from '@/utils/reports/schemaUtils';
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

  useEffect(() => {
    let isMounted = true;
    
    const loadReportData = async () => {
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

        // Get schema and data source based on report type
        const reportType: ReportType = isInsightsReport ? 'insight' : 'deepDive';
        const schema = getReportSchema(reportType);
        const mainSection = isInsightsReport ? 'overview' : 'archetypeProfile';
        const dataSourceTable = getDataSource(reportType, mainSection);

        if (!dataSourceTable) {
          throw new Error(`No data source found for report type: ${reportType}`);
        }
        
        // Validate token and fetch report data
        let accessData = null;
        let accessError = null;
        
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
        
        if (accessError) {
          console.error('Token validation error:', accessError);
        }
        
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
        
        // Fetch report data using schema-defined data source
        const { data: fetchedReportData, error: reportError } = await supabase
          .from(dataSourceTable)
          .select('*')
          .eq('archetype_id', archetypeId)
          .maybeSingle();
        
        if (reportError) {
          throw reportError;
        }
        
        if (!fetchedReportData) {
          // Try alternate data source as fallback
          const fallbackType: ReportType = isInsightsReport ? 'deepDive' : 'insight';
          const fallbackSchema = getReportSchema(fallbackType);
          const fallbackSection = isInsightsReport ? 'archetypeProfile' : 'overview';
          const fallbackDataSource = getDataSource(fallbackType, fallbackSection);
          
          if (!fallbackDataSource) {
            throw new Error('No fallback data source available');
          }

          const { data: fallbackData, error: fallbackError } = await supabase
            .from(fallbackDataSource)
            .select('*')
            .eq('archetype_id', archetypeId)
            .maybeSingle();
          
          if (fallbackError) throw fallbackError;
          
          if (!fallbackData) {
            console.warn(`No data found for archetype ${archetypeId} in either source`);
          } else if (isMounted) {
            setReportData(fallbackData);
            setDataSource(`${fallbackDataSource} (fallback)`);
          }
        } else if (isMounted) {
          setReportData(fetchedReportData);
          setDataSource(dataSourceTable);
        }
        
        // Create default average data
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
        
        // Cache successful results
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
    
    loadReportData();
    
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

export default useReportData;
