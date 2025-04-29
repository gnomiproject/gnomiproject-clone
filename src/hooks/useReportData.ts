
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { ArchetypeId } from '@/types/archetype';
import { trackReportAccess } from '@/utils/reports/accessTracking';

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
  
  const fetchReportData = async () => {
    // For insights report type, we don't need token validation
    if (isInsightsReport) {
      return null; 
    }
    
    // Admin view automatically passes validation
    if (token === 'admin-view') {
      setIsValidAccess(true);
      return null;
    }
    
    console.log(`Fetching report data for archetype ${archetypeId} with token ${token}`);
    
    try {
      // First validate the token
      const { data: validationData, error: validationError } = await supabase
        .from('report_requests')
        .select('id, name, organization, email, created_at, exact_employee_count, assessment_result')
        .eq('archetype_id', archetypeId)
        .eq('access_token', token)
        .eq('status', 'active')
        .maybeSingle();
        
      if (validationError) {
        console.error('Error validating report access:', validationError);
        throw new Error('Unable to validate report access');
      }
      
      if (!validationData) {
        setIsValidAccess(false);
        throw new Error('Invalid or expired access token');
      }
      
      console.log('Report access validated:', validationData);
      setIsValidAccess(true);
      
      // Track this report access
      trackReportAccess(archetypeId, token);
      
      // Set user data from the report request
      setUserData({
        name: validationData.name,
        organization: validationData.organization,
        email: validationData.email,
        created_at: validationData.created_at,
        exact_employee_count: validationData.exact_employee_count,
        assessment_result: validationData.assessment_result
      });
      
      return validationData;
    } catch (error) {
      console.error('Error in report access validation:', error);
      setIsValidAccess(false);
      throw error;
    }
  };
  
  // Use React Query to handle the data fetching
  const { 
    data: validationData,
    isLoading: validationLoading,
    error: validationError,
    refetch: retryValidation
  } = useQuery({
    queryKey: ['report-validation', archetypeId, token],
    queryFn: fetchReportData,
    enabled: !!archetypeId && !!token && !isInsightsReport,
    retry: 1,
    staleTime: skipCache ? 0 : 1000 * 60 * 5  // 5 minutes
  });
  
  // Fetch average data for comparisons
  useEffect(() => {
    const fetchAverageData = async () => {
      try {
        // Use the secure view instead of direct table access
        const { data: avgData, error: avgError } = await supabase
          .from('level4_report_secure')
          .select('*')
          .eq('archetype_id', 'All_Average')
          .maybeSingle();
          
        if (avgError) {
          console.warn('Could not fetch average data:', avgError);
          return;
        }
        
        if (avgData) {
          setAverageData(avgData);
          console.log('Average comparison data loaded');
        }
      } catch (err) {
        console.error('Error loading average data:', err);
      }
    };
    
    fetchAverageData();
  }, []);
  
  // Fetch full archetype report data 
  useEffect(() => {
    // Skip this step for insights reports or if validation failed
    if (isInsightsReport || (!isValidAccess && token !== 'admin-view')) {
      return;
    }
    
    const fetchArchetypeData = async () => {
      try {
        console.log(`Fetching detailed data for archetype ${archetypeId}`);
        
        // Fetch from level4 secure view first (most detailed)
        const { data: detailedData, error: detailedError } = await supabase
          .from('level4_report_secure')
          .select('*')
          .eq('archetype_id', archetypeId)
          .maybeSingle();
          
        if (detailedError) {
          console.warn('Could not fetch level4 data:', detailedError);
        }
        
        if (detailedData) {
          console.log('Got detailed report data from level4');
          setReportData(detailedData);
          return;
        }
        
        // Fallback to fetching from level3 secure view
        const { data: level3Data, error: level3Error } = await supabase
          .from('level3_report_secure')
          .select('*')
          .eq('archetype_id', archetypeId)
          .maybeSingle();
          
        if (level3Error) {
          console.warn('Could not fetch level3 data:', level3Error);
        }
        
        if (level3Data) {
          console.log('Got report data from level3');
          setReportData(level3Data);
          return;
        }
        
        // Fallback to fetching from SWOT and strategic recommendations
        const { data: swotData, error: swotError } = await supabase
          .from('Analysis_Archetype_SWOT')
          .select('strengths, weaknesses, opportunities, threats')
          .eq('archetype_id', archetypeId)
          .maybeSingle();
          
        if (swotError) {
          console.warn('Could not fetch SWOT data:', swotError);
        }
        
        const { data: recData, error: recError } = await supabase
          .from('Analysis_Archetype_Strategic_Recommendations')
          .select('*')
          .eq('archetype_id', archetypeId)
          .order('recommendation_number', { ascending: true });
          
        if (recError) {
          console.warn('Could not fetch recommendation data:', recError);
        }
        
        // Fetch the core overview data
        const { data: coreData, error: coreError } = await supabase
          .from('Core_Archetype_Overview')
          .select('*')
          .eq('id', archetypeId)
          .maybeSingle();
          
        if (coreError) {
          console.warn('Could not fetch core data:', coreError);
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
        console.error('Error loading report data:', err);
      }
    };
    
    fetchArchetypeData();
  }, [archetypeId, isValidAccess, isInsightsReport, token]);
  
  // Clear data when parameters change
  useEffect(() => {
    return () => {
      setReportData(null);
      setUserData(null);
    };
  }, [archetypeId, token]);
  
  const refreshData = () => {
    setReportData(null);
    setUserData(null);
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
    refreshData
  };
};

export default useReportData;
