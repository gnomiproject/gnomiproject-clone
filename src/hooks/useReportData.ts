
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ArchetypeId } from '@/types/archetype';
import { toast } from 'sonner';
import { useArchetypes } from '@/hooks/useArchetypes';

interface UseReportDataProps {
  archetypeId: string;
  token: string;
  isInsightsReport: boolean;
}

export const useReportData = ({ archetypeId, token, isInsightsReport }: UseReportDataProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isValidAccess, setIsValidAccess] = useState<boolean | null>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [averageData, setAverageData] = useState<any>(null);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [dataSource, setDataSource] = useState<string>('');
  
  const { getArchetypeDetailedById } = useArchetypes();

  // This function consolidates our data fetching strategy
  const fetchArchetypeData = async (archetypeId: string) => {
    console.log(`Fetching archetype data for ${archetypeId}...`);
    
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
        return { data, source: 'Analysis_Archetype_Full_Reports' };
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
        return { data, source: 'level3_report_data' };
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
        return { data, source: 'level4_deepdive_report_data' };
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
      return { data: combinedData, source: 'Core tables' };
    } catch (e) {
      console.error('Exception accessing Core tables:', e);
    }
    
    return null;
  };

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log(`Fetching report data for archetype: ${archetypeId}, isInsightsReport: ${isInsightsReport}`);
        
        // Different approach based on whether it's an insights report or a deep dive report
        if (isInsightsReport) {
          // For insights reports, try fetching data with our consolidated function
          const result = await fetchArchetypeData(archetypeId);
          
          if (result?.data) {
            console.log(`Found report data in ${result.source}`);
            setReportData(result.data);
            setIsValidAccess(true);
            setUsingFallbackData(result.source !== 'Analysis_Archetype_Full_Reports');
          } else {
            console.warn('No database data found, using in-memory data');
            
            // Get in-memory data from context as last resort
            const localArchetypeData = getArchetypeDetailedById(archetypeId as ArchetypeId);
            
            if (localArchetypeData) {
              console.log('Using local archetype data');
              
              // Convert to expected report format
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
                strategic_recommendations: localArchetypeData.enhanced?.strategicPriorities || [],
                family_id: localArchetypeData.familyId,
                family_name: localArchetypeData.familyName
              };
              
              setDataSource('local data');
              setReportData(localReportData);
              setIsValidAccess(true);
              setUsingFallbackData(true);
            } else {
              console.error('No data found for archetype:', archetypeId);
              setError(new Error('No report data found for this archetype'));
              setIsValidAccess(false);
            }
          }
        } else {
          // For deep dive reports, check the token against report_requests table
          if (!token) {
            setIsValidAccess(false);
            setError(new Error('Access token required for deep dive reports'));
            return;
          }
          
          try {
            // Validate the token
            const { data: requestData, error: requestError } = await supabase
              .from('report_requests')
              .select('*')
              .eq('access_token', token)
              .eq('archetype_id', archetypeId)
              .maybeSingle();
              
            if (requestError) {
              console.error('Invalid access token or archetype:', requestError);
              setIsValidAccess(false);
              setError(new Error(`Access validation error: ${requestError.message}`));
              return;
            }
            
            if (!requestData) {
              setIsValidAccess(false);
              setError(new Error('Invalid access token'));
              return;
            }
            
            // Check if token is expired
            if (requestData.expires_at && new Date(requestData.expires_at) < new Date()) {
              console.log('Token expired:', requestData.expires_at);
              setIsValidAccess(false);
              setError(new Error('Access token has expired'));
              return;
            }
            
            // Token is valid, fetch report data using our consolidated function
            const result = await fetchArchetypeData(archetypeId);
            
            if (result?.data) {
              console.log(`Found report data in ${result.source} for deep dive report`);
              setReportData(result.data);
              setUserData(requestData.assessment_result || null);
              setIsValidAccess(true);
              setUsingFallbackData(result.source !== 'Analysis_Archetype_Full_Reports');
            } else {
              // Last resort - try local data
              const localArchetypeData = getArchetypeDetailedById(archetypeId as ArchetypeId);
              
              if (localArchetypeData) {
                console.log('Using local data for deep dive report');
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
                setReportData(localReportData);
                setUserData(requestData.assessment_result || null);
                setIsValidAccess(true);
                setUsingFallbackData(true);
              } else {
                console.error('No data found for deep dive report:', archetypeId);
                setError(new Error('No report data found for this archetype'));
                setIsValidAccess(false);
              }
            }
          } catch (tokenValidationError) {
            console.error('Error validating token:', tokenValidationError);
            setError(tokenValidationError as Error);
            setIsValidAccess(false);
          }
        }
      } catch (error) {
        console.error('Error in useReportData:', error);
        setError(error as Error);
        
        // Last resort - try to use local data even if there was an error
        const localArchetypeData = getArchetypeDetailedById(archetypeId as ArchetypeId);
        if (localArchetypeData) {
          console.log('Using local data after error as emergency fallback');
          const emergencyData = {
            archetype_id: localArchetypeData.id,
            archetype_name: localArchetypeData.name,
            short_description: localArchetypeData.short_description,
            long_description: localArchetypeData.long_description,
            key_characteristics: localArchetypeData.key_characteristics || [],
          };
          setReportData(emergencyData);
          setUsingFallbackData(true);
          setIsValidAccess(true);
        } else {
          setIsValidAccess(false);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReportData();
  }, [archetypeId, token, isInsightsReport, getArchetypeDetailedById]);

  return {
    isLoading,
    isValidAccess,
    reportData,
    userData,
    averageData,
    usingFallbackData,
    dataSource,
    error
  };
};
