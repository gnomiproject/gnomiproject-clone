
import { useState, useEffect } from 'react';
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
          // For insights reports, first try to fetch from Supabase
          try {
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
              console.log('Found report data in Analysis_Archetype_Full_Reports');
              setReportData(data);
              setIsValidAccess(true);
              return;
            }
            
            // If no data in primary table, try level3_report_data
            console.log('No insights report found, falling back to level3_report_data');
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
              console.log('Found fallback data in level3_report_data');
              setUsingFallbackData(true);
              setReportData(fallbackData);
              setIsValidAccess(true);
              return;
            }
            
            // If still no data, use in-memory data
            throw new Error('No database report data found');
          }
          catch (dbError) {
            console.warn(`Database fetch failed: ${dbError}`);
            console.log('Using in-memory archetype data as final fallback');
            
            // Get in-memory data from context
            const localArchetypeData = getArchetypeDetailedById(archetypeId as ArchetypeId);
            
            if (localArchetypeData) {
              // Convert to expected report format
              const localReportData = {
                archetype_id: localArchetypeData.id,
                archetype_name: localArchetypeData.name,
                short_description: localArchetypeData.short_description,
                long_description: localArchetypeData.long_description,
                key_characteristics: localArchetypeData.key_characteristics,
                strengths: localArchetypeData.enhanced?.swot?.strengths || [],
                weaknesses: localArchetypeData.enhanced?.swot?.weaknesses || [],
                opportunities: localArchetypeData.enhanced?.swot?.opportunities || [],
                threats: localArchetypeData.enhanced?.swot?.threats || [],
                strategic_recommendations: localArchetypeData.enhanced?.strategicPriorities || []
              };
              
              setUsingFallbackData(true);
              setReportData(localReportData);
              setIsValidAccess(true);
            } else {
              // No data found at all
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
                setUsingFallbackData(true);
                setReportData(fallbackData);
                setUserData(requestData.assessment_result || null);
                setIsValidAccess(true);
              } else {
                // Try in-memory data as last resort
                const localArchetypeData = getArchetypeDetailedById(archetypeId as ArchetypeId);
                
                if (localArchetypeData) {
                  const localReportData = {
                    archetype_id: localArchetypeData.id,
                    archetype_name: localArchetypeData.name,
                    short_description: localArchetypeData.short_description,
                    long_description: localArchetypeData.long_description,
                    key_characteristics: localArchetypeData.key_characteristics,
                    strengths: localArchetypeData.enhanced?.swot?.strengths || [],
                    weaknesses: localArchetypeData.enhanced?.swot?.weaknesses || [],
                    opportunities: localArchetypeData.enhanced?.swot?.opportunities || [],
                    threats: localArchetypeData.enhanced?.swot?.threats || []
                  };
                  
                  setUsingFallbackData(true);
                  setReportData(localReportData);
                  setUserData(requestData.assessment_result || null);
                  setIsValidAccess(true);
                } else {
                  setError(new Error('No report data found for this archetype'));
                  setIsValidAccess(false);
                }
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
        setIsValidAccess(false);
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
