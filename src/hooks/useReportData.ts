
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ArchetypeId } from '@/types/archetype';
import { toast } from 'sonner';

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

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setIsLoading(true);
        
        // Different approach based on whether it's an insights report or a deep dive report
        if (isInsightsReport) {
          // For insights reports, simply fetch the report from Analysis_Archetype_Full_Reports
          const { data, error } = await supabase
            .from('Analysis_Archetype_Full_Reports')
            .select('*')
            .eq('archetype_id', archetypeId)
            .maybeSingle();
          
          if (error) {
            console.error('Error fetching insights report:', error);
            toast.error('Failed to load report data');
            setIsValidAccess(false);
            return;
          }
          
          if (!data) {
            console.log('No insights report found, falling back to level3_report_data');
            const { data: fallbackData, error: fallbackError } = await supabase
              .from('level3_report_data')
              .select('*')
              .eq('archetype_id', archetypeId)
              .maybeSingle();
              
            if (fallbackError || !fallbackData) {
              console.error('Error fetching fallback data:', fallbackError);
              setIsValidAccess(false);
              return;
            }
            
            setUsingFallbackData(true);
            setReportData(fallbackData);
          } else {
            setReportData(data);
          }
          
          setIsValidAccess(true);
        } else {
          // For deep dive reports, check the token against report_requests table
          if (!token) {
            setIsValidAccess(false);
            return;
          }
          
          const { data: requestData, error: requestError } = await supabase
            .from('report_requests')
            .select('*')
            .eq('access_token', token)
            .eq('archetype_id', archetypeId)
            .maybeSingle();
            
          if (requestError || !requestData) {
            console.error('Invalid access token or archetype:', requestError);
            setIsValidAccess(false);
            return;
          }
          
          // Check if token is expired
          if (requestData.expires_at && new Date(requestData.expires_at) < new Date()) {
            console.log('Token expired:', requestData.expires_at);
            setIsValidAccess(false);
            return;
          }
          
          // Fetch the deep dive report data
          const { data: reportData, error: reportError } = await supabase
            .from('Analysis_Archetype_Full_Reports')
            .select('*')
            .eq('archetype_id', archetypeId)
            .maybeSingle();
            
          if (reportError) {
            console.error('Error fetching report data:', reportError);
            setIsValidAccess(false);
            return;
          }
          
          // If report not found, fallback to level4_deepdive_report_data
          if (!reportData) {
            const { data: fallbackData, error: fallbackError } = await supabase
              .from('level4_deepdive_report_data')
              .select('*')
              .eq('archetype_id', archetypeId)
              .maybeSingle();
              
            if (fallbackError || !fallbackData) {
              console.error('Error fetching fallback data:', fallbackError);
              setIsValidAccess(false);
              return;
            }
            
            setUsingFallbackData(true);
            setReportData(fallbackData);
          } else {
            setReportData(reportData);
          }
          
          setUserData(requestData.assessment_result || null);
          setAverageData(null); // Could fetch average data in future if needed
          setIsValidAccess(true);
        }
      } catch (error) {
        console.error('Error in useReportData:', error);
        setIsValidAccess(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReportData();
  }, [archetypeId, token, isInsightsReport]);

  return {
    isLoading,
    isValidAccess,
    reportData,
    userData,
    averageData,
    usingFallbackData
  };
};
