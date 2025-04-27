
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
  
  const { getArchetypeDetailedById } = useArchetypes();

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log(`Fetching report data for archetype: ${archetypeId}, isInsightsReport: ${isInsightsReport}`);
        
        // Different approach based on whether it's an insights report or a deep dive report
        if (isInsightsReport) {
          // For insights reports, try fetching data with multiple fallback strategies
          try {
            console.log('Attempting to fetch from Analysis_Archetype_Full_Reports...');
            const { data, error } = await supabase
              .from('Analysis_Archetype_Full_Reports')
              .select('*')
              .eq('archetype_id', archetypeId)
              .maybeSingle();
            
            if (error) {
              console.error('Error fetching insights report:', error);
              throw new Error(`Database error: ${error.message}`);
            }
            
            if (data) {
              console.log('Found report data in Analysis_Archetype_Full_Reports:', data.archetype_id);
              setReportData(data);
              setIsValidAccess(true);
              return;
            } else {
              console.log('No data found in Analysis_Archetype_Full_Reports');
            }
            
            // If no data in primary table, try level3_report_data
            console.log('Falling back to level3_report_data...');
            const { data: fallbackData, error: fallbackError } = await supabase
              .from('level3_report_data')
              .select('*')
              .eq('archetype_id', archetypeId)
              .maybeSingle();
              
            if (fallbackError) {
              console.error('Error fetching fallback data:', fallbackError);
              throw new Error(`Fallback database error: ${fallbackError.message}`);
            }
            
            if (fallbackData) {
              console.log('Found fallback data in level3_report_data:', fallbackData.archetype_id);
              setUsingFallbackData(true);
              setReportData(fallbackData);
              setIsValidAccess(true);
              return;
            } else {
              console.log('No data found in level3_report_data');
            }
            
            // Try deepdive table as another fallback
            console.log('Trying level4_deepdive_report_data as additional fallback...');
            const { data: deepdiveData, error: deepdiveError } = await supabase
              .from('level4_deepdive_report_data')
              .select('*')
              .eq('archetype_id', archetypeId)
              .maybeSingle();
              
            if (deepdiveError) {
              console.error('Error fetching deepdive data:', deepdiveError);
            } else if (deepdiveData) {
              console.log('Found data in level4_deepdive_report_data:', deepdiveData.archetype_id);
              setUsingFallbackData(true);
              setReportData(deepdiveData);
              setIsValidAccess(true);
              return;
            } else {
              console.log('No data found in level4_deepdive_report_data');
            }
            
            // If all database attempts fail, use in-memory data
            throw new Error('No database report data found, trying local data');
          }
          catch (dbError) {
            console.warn(`Database fetch failed: ${dbError}`);
            console.log('Using in-memory archetype data as final fallback');
            
            // Get in-memory data from context
            const localArchetypeData = getArchetypeDetailedById(archetypeId as ArchetypeId);
            
            if (localArchetypeData) {
              console.log('Found local archetype data:', localArchetypeData.id);
              
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
              
              setUsingFallbackData(true);
              setReportData(localReportData);
              setIsValidAccess(true);
            } else {
              // No data found at all
              console.error('No local data found for archetype:', archetypeId);
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
            
            // Fetch the deep dive report data with proper error handling
            try {
              // Try multiple tables with fallbacks
              console.log('Trying to fetch deep dive report...');
              
              // First try full reports
              const { data: reportData, error: reportError } = await supabase
                .from('Analysis_Archetype_Full_Reports')
                .select('*')
                .eq('archetype_id', archetypeId)
                .maybeSingle();
                
              if (reportError) {
                console.error('Error fetching report data:', reportError);
                throw new Error(`Report data fetch error: ${reportError.message}`);
              }
              
              // If report found, use it
              if (reportData) {
                console.log('Found data in Analysis_Archetype_Full_Reports');
                setReportData(reportData);
                setUserData(requestData.assessment_result || null);
                setAverageData(null); // Could fetch average data in future if needed
                setIsValidAccess(true);
                return;
              }
              
              // If report not found, fallback to level4_deepdive_report_data
              console.log('No deep dive report found, falling back to level4_deepdive_report_data');
              const { data: fallbackData, error: fallbackError } = await supabase
                .from('level4_deepdive_report_data')
                .select('*')
                .eq('archetype_id', archetypeId)
                .maybeSingle();
                
              if (fallbackError) {
                console.error('Error fetching fallback data:', fallbackError);
                throw new Error(`Fallback data fetch error: ${fallbackError.message}`);
              }
              
              if (fallbackData) {
                console.log('Found data in level4_deepdive_report_data');
                setUsingFallbackData(true);
                setReportData(fallbackData);
                setUserData(requestData.assessment_result || null);
                setIsValidAccess(true);
                return;
              }
              
              // Try level3 data as another fallback
              console.log('Trying level3_report_data as additional fallback...');
              const { data: level3Data, error: level3Error } = await supabase
                .from('level3_report_data')
                .select('*')
                .eq('archetype_id', archetypeId)
                .maybeSingle();
                
              if (level3Error) {
                console.error('Error fetching level3 data:', level3Error);
              } else if (level3Data) {
                console.log('Found data in level3_report_data');
                setUsingFallbackData(true);
                setReportData(level3Data);
                setUserData(requestData.assessment_result || null);
                setIsValidAccess(true);
                return;
              }
                
              // Try in-memory data as last resort
              const localArchetypeData = getArchetypeDetailedById(archetypeId as ArchetypeId);
              
              if (localArchetypeData) {
                console.log('Using local archetype data as last resort');
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
                
                setUsingFallbackData(true);
                setReportData(localReportData);
                setUserData(requestData.assessment_result || null);
                setIsValidAccess(true);
              } else {
                console.error('No local data found for archetype:', archetypeId);
                setError(new Error('No report data found for this archetype'));
                setIsValidAccess(false);
              }
            } catch (reportFetchError) {
              console.error('Error in report data fetching:', reportFetchError);
              setError(reportFetchError as Error);
              setIsValidAccess(false);
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
    error
  };
};
