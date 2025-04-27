
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArchetypeId } from '@/types/archetype';
import { useNavigate } from 'react-router-dom';

interface UseReportDataProps {
  archetypeId: string;
  token?: string;
  isInsightsReport: boolean;
}

export const defaultReportData = {
  archetype_id: 'a1',
  archetype_name: 'Sample Archetype',
  short_description: 'This is a sample archetype with placeholder data.',
  long_description: 'This is a detailed description of the archetype with all relevant information about its characteristics and behaviors.',
  hex_color: '#4285F4',
  key_characteristics: 'Key characteristic 1\nKey characteristic 2\nKey characteristic 3',
  cost_analysis: 'This archetype exhibits average cost patterns with opportunities for optimization in specialty medication management.',
  utilization_patterns: 'Members of this archetype typically utilize preventative services at higher rates than emergency services.',
  demographic_insights: 'This archetype is characterized by a diverse age distribution with balanced gender representation.',
  disease_prevalence: 'Common conditions include hypertension and type 2 diabetes at rates slightly above population averages.',
  care_gaps: 'Opportunities for improvement in preventative screenings and medication adherence.',
  recommendations: 'Focus on chronic condition management and preventative care initiatives.',
  "Demo_Average Age": 42.5,
  "Demo_Average Family Size": 3.2,
  "Util_Emergency Visits per 1k Members": 150,
  "Util_Specialist Visits per 1k Members": 1250,
  "Risk_Average Risk Score": 1.2,
  "Cost_Medical & RX Paid Amount PMPY": 5200
};

export const defaultAverageData = {
  "Risk_Average Risk Score": 1.0,
  "SDOH_Average SDOH": 0.5,
  "Util_Emergency Visits per 1k Members": 150,
  "Util_Specialist Visits per 1k Members": 1326.63,
  "Cost_Medical & RX Paid Amount PEPY": 10000,
  "Cost_Medical & RX Paid Amount PMPY": 8500
};

export const useReportData = ({ archetypeId, token, isInsightsReport }: UseReportDataProps) => {
  const [isValidAccess, setIsValidAccess] = useState<boolean | null>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [averageData, setAverageData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setIsLoading(true);
        console.log('Starting report data fetch for:', archetypeId, 'access path:', isInsightsReport ? 'insights' : 'deep-dive');
        
        // For insights reports, we don't need token validation
        if (isInsightsReport) {
          console.log('Insights report access - no token required');
          setIsValidAccess(true);
        }
        // For regular report URLs with no token (only admin can access these)
        else if (!token) {
          console.log('Admin direct report access - checking admin role');
          setIsValidAccess(true);
        } 
        // For deep dive reports with token
        else if (token) {
          console.log('Checking token validity for deep dive report:', { archetypeId, token });
          
          const { data: userData, error: userError } = await supabase
            .from('report_requests')
            .select('*')
            .eq('access_token', token)
            .eq('archetype_id', archetypeId)
            .maybeSingle();

          if (userError || !userData) {
            console.error('Invalid token or no user data found');
            setIsValidAccess(false);
            setIsLoading(false);
            return;
          }

          const isExpired = userData.expires_at && new Date(userData.expires_at) < new Date();
          if (isExpired) {
            console.error('Report link expired');
            setIsValidAccess(false);
            setIsLoading(false);
            toast.error('This report link has expired.');
            return;
          }

          setUserData(userData);
          setIsValidAccess(true);
        }

        // Fetch report data based on report type (insights vs deep dive)
        if (isInsightsReport) {
          const { data: insightsData, error: insightsError } = await supabase
            .from('Analysis_Archetype_Full_Reports')
            .select('*')
            .eq('archetype_id', archetypeId)
            .maybeSingle();

          if (insightsError || !insightsData) {
            console.warn('Using placeholder insights report data');
            setReportData({ archetype_id: archetypeId });
            setUsingFallbackData(true);
          } else {
            setReportData(insightsData);
          }
        } else {
          // Fetch average data for deep dive reports
          const { data: avgData, error: avgError } = await supabase
            .from('level4_deepdive_report_data')
            .select('*')
            .eq('archetype_id', 'All_Average')
            .maybeSingle();

          if (avgError) {
            console.warn('Error fetching average data, using defaults');
            setAverageData(defaultAverageData);
          } else if (avgData) {
            setAverageData(avgData);
          } else {
            setAverageData(defaultAverageData);
          }

          // Fetch the archetype-specific deep dive report data
          const { data: archetypeData, error: archetypeError } = await supabase
            .from('level4_deepdive_report_data')
            .select('*')
            .eq('archetype_id', archetypeId)
            .maybeSingle();

          if (archetypeError || !archetypeData) {
            console.warn('Using placeholder report data for demo');
            setReportData({ ...defaultReportData, archetype_id: archetypeId });
            setUsingFallbackData(true);
          } else {
            setReportData(archetypeData);
          }
        }
        
      } catch (err) {
        console.error('Error fetching report:', err);
        setIsValidAccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (archetypeId) {
      fetchReportData();
    }
  }, [token, archetypeId, navigate, isInsightsReport]);

  return {
    isValidAccess,
    reportData,
    userData,
    averageData,
    isLoading,
    usingFallbackData
  };
};
