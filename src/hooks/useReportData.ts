
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ArchetypeId } from '@/types/archetype';
import { toast } from 'sonner';
import { useArchetypes } from '@/hooks/useArchetypes';
import { useQuery } from '@tanstack/react-query';

interface UseReportDataProps {
  archetypeId: string;
  token: string;
  isInsightsReport: boolean;
}

export const useReportData = ({ archetypeId, token, isInsightsReport }: UseReportDataProps) => {
  const [isValidAccess, setIsValidAccess] = useState<boolean | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  const [dataSource, setDataSource] = useState<string>('');
  
  const { getArchetypeDetailedById } = useArchetypes();

  // This function consolidates our data fetching strategy
  const fetchArchetypeData = useCallback(async () => {
    console.log(`Fetching archetype data for ${archetypeId}...`);
    
    // For deep dive reports, check the token against report_requests table
    if (!isInsightsReport && token) {
      // Validate the token
      const { data: requestData, error: requestError } = await supabase
        .from('report_requests')
        .select('*')
        .eq('access_token', token)
        .eq('archetype_id', archetypeId)
        .maybeSingle();
        
      if (requestError) {
        throw new Error(`Access validation error: ${requestError.message}`);
      }
      
      if (!requestData) {
        throw new Error('Invalid access token');
      }
      
      // Check if token is expired
      if (requestData.expires_at && new Date(requestData.expires_at) < new Date()) {
        throw new Error('Access token has expired');
      }
      
      // Store user data
      setUserData(requestData.assessment_result || null);
      setIsValidAccess(true);
    }
    
    // Try fetching from Analysis_Archetype_Full_Reports first (most complete)
    try {
      const { data, error } = await supabase
        .from('Analysis_Archetype_Full_Reports')
        .select('*')
        .eq('archetype_id', archetypeId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching from Analysis_Archetype_Full_Reports:', error);
      } else if (data) {
        console.log('Found data in Analysis_Archetype_Full_Reports');
        setDataSource('Analysis_Archetype_Full_Reports');
        return data;
      }
    } catch (e) {
      console.error('Exception accessing Analysis_Archetype_Full_Reports:', e);
    }
    
    // Try level3_report_data next
    try {
      const { data, error } = await supabase
        .from('level3_report_data')
        .select('*')
        .eq('archetype_id', archetypeId)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching from level3_report_data:', error);
      } else if (data) {
        console.log('Found data in level3_report_data');
        setDataSource('level3_report_data');
        return data;
      }
    } catch (e) {
      console.error('Exception accessing level3_report_data:', e);
    }
    
    // Try level4_deepdive_report_data as another option
    try {
      const { data, error } = await supabase
        .from('level4_deepdive_report_data')
        .select('*')
        .eq('archetype_id', archetypeId)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching from level4_deepdive_report_data:', error);
      } else if (data) {
        console.log('Found data in level4_deepdive_report_data');
        setDataSource('level4_deepdive_report_data');
        return data;
      }
    } catch (e) {
      console.error('Exception accessing level4_deepdive_report_data:', e);
    }
    
    // As last resort, try Core tables
    try {
      // Get basic archetype info
      const { data: overviewData, error: overviewError } = await supabase
        .from('Core_Archetype_Overview')
        .select('*')
        .eq('id', archetypeId)
        .maybeSingle();
        
      if (overviewError) {
        console.error('Error fetching from Core_Archetype_Overview:', overviewError);
        return null;
      }
      
      if (!overviewData) {
        console.log('No data found in Core_Archetype_Overview');
        return null;
      }
      
      // Get metrics data
      const { data: metricsData, error: metricsError } = await supabase
        .from('Core_Archetypes_Metrics')
        .select('*')
        .eq('id', archetypeId)
        .maybeSingle();
        
      if (metricsError) {
        console.error('Error fetching from Core_Archetypes_Metrics:', metricsError);
      }
      
      // Combine data
      const combinedData = { 
        ...overviewData, 
        ...(metricsData || {}),
        archetype_id: overviewData.id,
        archetype_name: overviewData.name
      };
      
      console.log('Using combined Core tables data');
      setDataSource('Core tables');
      return combinedData;
    } catch (e) {
      console.error('Exception accessing Core tables:', e);
    }
    
    // Last resort - try local data
    const localArchetypeData = getArchetypeDetailedById(archetypeId as ArchetypeId);
    
    if (localArchetypeData) {
      console.log('Using local data for report');
      const localReportData = {
        archetype_id: localArchetypeData.id,
        archetype_name: localArchetypeData.name,
        short_description: localArchetypeData.short_description || '',
        long_description: localArchetypeData.long_description || '',
        key_characteristics: localArchetypeData.key_characteristics || [],
        strengths: localArchetypeData.enhanced?.swot?.strengths || [],
        weaknesses: localArchetypeData.enhanced?.swot?.weaknesses || [],
        opportunities: localArchetypeData.enhanced?.swot?.opportunities || [],
        threats: localArchetypeData.enhanced?.swot?.threats || [],
        family_id: localArchetypeData.familyId
      };
      
      setDataSource('local data');
      setUsingFallbackData(true);
      return localReportData;
    }
    
    return null;
  }, [archetypeId, token, isInsightsReport, getArchetypeDetailedById]);

  // Use React Query for data fetching with proper caching
  const { 
    data: reportData, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['reportData', archetypeId, token, isInsightsReport],
    queryFn: fetchArchetypeData,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    retry: 1, // Only retry once
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Handle retry functionality
  const retry = async () => {
    toast.loading("Retrying connection...");
    try {
      await refetch();
      toast.success("Connection successful!");
    } catch (e) {
      toast.error("Connection failed. Please try again.");
    }
  };

  // Create average data for comparison
  const averageData = {
    archetype_id: 'All_Average',
    archetype_name: 'Population Average',
    "Demo_Average Age": 40,
    "Demo_Average Family Size": 3.0,
    "Risk_Average Risk Score": 1.0,
    "Cost_Medical & RX Paid Amount PMPY": 5000
  };

  return {
    reportData,
    userData,
    averageData,
    isLoading,
    isValidAccess,
    error: error as Error | null,
    usingFallbackData,
    dataSource,
    retry
  };
};
