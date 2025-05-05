import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { ArchetypeId } from '@/types/archetype';
import { trackReportAccess } from '@/utils/reports/accessTracking';
import { getFromCache, setInCache, clearFromCache } from '@/utils/reports/reportCache';

interface UseReportDataProps {
  archetypeId: ArchetypeId;
  token: string;
  isInsightsReport?: boolean;
  skipCache?: boolean;
}

export const useReportData = ({ archetypeId, token, isInsightsReport = false, skipCache = false }: UseReportDataProps) => {
  const [isValidAccess, setIsValidAccess] = useState<boolean>(false);
  const [reportData, setReportData] = useState<any | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [averageData, setAverageData] = useState<any | null>(null);
  const [lastValidationTime, setLastValidationTime] = useState<number>(Date.now());
  const [validationHistory, setValidationHistory] = useState<{success: boolean, time: number, error?: string}[]>([]);
  
  // Create cache key
  const cacheKey = `report-${archetypeId}-${token}`;
  
  // Keep track of validation status over time
  const logValidationStatus = useCallback((success: boolean, error?: string) => {
    const now = Date.now();
    setLastValidationTime(now);
    
    setValidationHistory(prev => {
      const newHistory = [...prev, { success, time: now, error }];
      // Keep only the last 10 entries to avoid memory issues
      return newHistory.slice(-10);
    });
    
    // Log validation status for debugging
    console.log(`[useReportData] Token validation ${success ? 'succeeded' : 'failed'} at ${new Date().toISOString()}`);
    if (!success && error) {
      console.error(`[useReportData] Validation error: ${error}`);
    }
  }, []);

  const fetchReportData = async () => {
    // For insights report type, we don't need token validation
    if (isInsightsReport) {
      return null; 
    }
    
    // Admin view automatically passes validation
    if (token === 'admin-view') {
      setIsValidAccess(true);
      logValidationStatus(true);
      return null;
    }
    
    console.log(`[useReportData] Fetching report data for archetype ${archetypeId} with token ${token.substring(0, 5)}...`);
    
    try {
      // First validate the token
      const { data: validationData, error: validationError } = await supabase
        .from('report_requests')
        .select('id, name, organization, email, created_at, exact_employee_count, assessment_result, expires_at')
        .eq('archetype_id', archetypeId)
        .eq('access_token', token)
        .eq('status', 'active')
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();
        
      if (validationError) {
        console.error('[useReportData] Error validating report access:', validationError);
        logValidationStatus(false, `Database error: ${validationError.message}`);
        throw new Error(`Unable to validate report access: ${validationError.message}`);
      }
      
      if (!validationData) {
        setIsValidAccess(false);
        logValidationStatus(false, 'Invalid or expired access token');
        
        // Try to determine why the token is invalid
        const { data: tokenCheck } = await supabase
          .from('report_requests')
          .select('id, expires_at, status')
          .eq('archetype_id', archetypeId)
          .eq('access_token', token)
          .maybeSingle();
          
        if (tokenCheck) {
          // Token exists but might be expired or inactive
          const now = new Date();
          const expiry = new Date(tokenCheck.expires_at);
          const isExpired = expiry < now;
          const isInactive = tokenCheck.status !== 'active';
          
          let errorMsg = 'Access denied';
          if (isExpired) {
            errorMsg = `Token expired on ${expiry.toLocaleString()}`;
          } else if (isInactive) {
            errorMsg = `Token status is ${tokenCheck.status}`;
          }
          
          throw new Error(errorMsg);
        } else {
          throw new Error('Invalid or expired access token');
        }
      }
      
      console.log('[useReportData] Report access validated:', validationData);
      setIsValidAccess(true);
      logValidationStatus(true);
      
      // Check if token is nearing expiration (less than 3 days)
      const expiryDate = new Date(validationData.expires_at);
      const now = new Date();
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilExpiry < 3) {
        console.warn(`[useReportData] Token will expire in ${daysUntilExpiry} days on ${expiryDate.toLocaleString()}`);
      }
      
      // Track this report access
      trackReportAccess(archetypeId, token);
      
      // Set user data from the report request
      setUserData({
        name: validationData.name,
        organization: validationData.organization,
        email: validationData.email,
        created_at: validationData.created_at,
        exact_employee_count: validationData.exact_employee_count,
        assessment_result: validationData.assessment_result,
        token_expiry: validationData.expires_at
      });
      
      return validationData;
    } catch (error) {
      console.error('[useReportData] Error in report access validation:', error);
      setIsValidAccess(false);
      logValidationStatus(false, error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  };
  
  // Use React Query to handle the data fetching with improved configuration
  const { 
    data: validationData,
    isLoading: validationLoading,
    error: validationError,
    refetch: retryValidation
  } = useQuery({
    queryKey: ['report-validation', archetypeId, token],
    queryFn: fetchReportData,
    enabled: !!archetypeId && !!token && !isInsightsReport,
    retry: 2,
    retryDelay: (attempt) => Math.min(attempt * 1000, 3000), // Exponential backoff with max 3 second delay
    staleTime: skipCache ? 0 : 1000 * 60 * 30, // 30 minutes (up from 5 minutes)
    gcTime: 1000 * 60 * 60, // 60 minutes
    refetchOnWindowFocus: false, // Prevents refetches when window regains focus
    refetchOnReconnect: false, // Prevents refetches on network reconnection
    onError: (error) => {
      console.error('[useReportData] Query error:', error);
    }
  });
  
  // Fetch average data for comparisons
  useEffect(() => {
    const fetchAverageData = async () => {
      try {
        // First check cache
        const cacheKey = 'average-data';
        const cachedData = getFromCache(cacheKey);
        if (cachedData && !skipCache) {
          console.log('[useReportData] Using cached average data');
          setAverageData(cachedData.data.reportData);
          return;
        }
        
        // Use the secure view instead of direct table access
        const { data: avgData, error: avgError } = await supabase
          .from('level4_report_secure')
          .select('*')
          .eq('archetype_id', 'All_Average')
          .maybeSingle();
          
        if (avgError) {
          console.warn('[useReportData] Could not fetch average data:', avgError);
          return;
        }
        
        if (avgData) {
          setAverageData(avgData);
          setInCache(cacheKey, { reportData: avgData, userData: null, averageData: null });
          console.log('[useReportData] Average comparison data loaded and cached');
        }
      } catch (err) {
        console.error('[useReportData] Error loading average data:', err);
      }
    };
    
    fetchAverageData();
  }, [skipCache]);
  
  // Fetch full archetype report data with improved caching
  useEffect(() => {
    // Skip this step for insights reports or if validation failed
    if (isInsightsReport || (!isValidAccess && token !== 'admin-view')) {
      return;
    }
    
    const fetchArchetypeData = async () => {
      try {
        // First check cache if not skipping
        if (!skipCache) {
          const cachedReport = getFromCache(cacheKey);
          if (cachedReport) {
            console.log('[useReportData] Using cached report data');
            setReportData(cachedReport.data.reportData);
            if (!userData && cachedReport.data.userData) {
              setUserData(cachedReport.data.userData);
            }
            return;
          }
        }
        
        console.log(`[useReportData] Fetching detailed data for archetype ${archetypeId}`);
        
        // Fetch from level4 secure view first (most detailed)
        const { data: detailedData, error: detailedError } = await supabase
          .from('level4_report_secure')
          .select('*')
          .eq('archetype_id', archetypeId)
          .maybeSingle();
          
        if (detailedError) {
          console.warn('[useReportData] Could not fetch level4 data:', detailedError);
        }
        
        if (detailedData) {
          console.log('[useReportData] Got detailed report data from level4');
          setReportData(detailedData);
          
          // Cache the data
          setInCache(cacheKey, {
            reportData: detailedData,
            userData,
            averageData
          });
          
          return;
        }
        
        // Fallback to fetching from level3 secure view
        const { data: level3Data, error: level3Error } = await supabase
          .from('level3_report_secure')
          .select('*')
          .eq('archetype_id', archetypeId)
          .maybeSingle();
          
        if (level3Error) {
          console.warn('[useReportData] Could not fetch level3 data:', level3Error);
        }
        
        if (level3Data) {
          console.log('[useReportData] Got report data from level3');
          setReportData(level3Data);
          
          // Cache level3 data too
          setInCache(cacheKey, {
            reportData: level3Data,
            userData,
            averageData
          });
          
          return;
        }
        
        // Fallback to fetching from SWOT and strategic recommendations
        const { data: swotData, error: swotError } = await supabase
          .from('Analysis_Archetype_SWOT')
          .select('strengths, weaknesses, opportunities, threats')
          .eq('archetype_id', archetypeId)
          .maybeSingle();
          
        if (swotError) {
          console.warn('[useReportData] Could not fetch SWOT data:', swotError);
        }
        
        const { data: recData, error: recError } = await supabase
          .from('Analysis_Archetype_Strategic_Recommendations')
          .select('*')
          .eq('archetype_id', archetypeId)
          .order('recommendation_number', { ascending: true });
          
        if (recError) {
          console.warn('[useReportData] Could not fetch recommendation data:', recError);
        }
        
        // Fetch the core overview data
        const { data: coreData, error: coreError } = await supabase
          .from('Core_Archetype_Overview')
          .select('*')
          .eq('id', archetypeId)
          .maybeSingle();
          
        if (coreError) {
          console.warn('[useReportData] Could not fetch core data:', coreError);
        }
        
        if (coreData) {
          // Construct a full report data object
          const combinedData = {
            ...coreData,
            archetype_id: coreData.id,
            archetype_name: coreData.name,
            strengths: swotData?.strengths || [],
            weaknesses: swotData?.weaknesses || [],
            opportunities: swotData?.opportunities || [],
            threats: swotData?.threats || [],
            strategic_recommendations: recData || []
          };
          
          console.log('Constructed report data from multiple sources');
          setReportData(combinedData);
        }
      } catch (err) {
        console.error('[useReportData] Error loading report data:', err);
      }
    };
    
    fetchArchetypeData();
  }, [archetypeId, isValidAccess, isInsightsReport, token, userData, averageData, skipCache, cacheKey]);
  
  // Clear data when parameters change
  useEffect(() => {
    return () => {
      console.log('[useReportData] Component unmounting, clearing state');
      setReportData(null);
      setUserData(null);
    };
  }, [archetypeId, token]);
  
  // Add periodic token validation
  useEffect(() => {
    // Skip for insights reports or admin view
    if (isInsightsReport || token === 'admin-view') {
      return;
    }
    
    // Set up a validation check every 2 minutes
    const interval = setInterval(() => {
      // Only run validation check if we previously had valid access
      if (isValidAccess) {
        console.log('[useReportData] Running periodic token validation check');
        
        // Use the existing retryValidation function from React Query
        retryValidation().catch(err => {
          console.error('[useReportData] Periodic validation failed:', err);
          // Don't invalidate UI right away, just log the error
        });
      }
    }, 2 * 60 * 1000); // Every 2 minutes
    
    return () => {
      clearInterval(interval);
    };
  }, [isValidAccess, isInsightsReport, token, retryValidation]);
  
  const refreshData = () => {
    console.log('[useReportData] Manually refreshing data');
    setReportData(null);
    setUserData(null);
    clearFromCache(cacheKey);
    retryValidation();
  };
  
  return {
    reportData,
    userData,
    averageData,
    isValidAccess,
    isLoading: validationLoading,
    error: validationError,
    retry: retryValidation,
    refreshData,
    validationHistory,
    lastValidationTime
  };
};

export default useReportData;
