import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import DeepDiveReport from '@/components/report/DeepDiveReport';
import ArchetypeReport from '@/components/insights/ArchetypeReport'; // Import for insights reports
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { ArchetypeId } from '@/types/archetype';
import { toast } from 'sonner';

const defaultReportData = {
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

const defaultAverageData = {
  "Risk_Average Risk Score": 1.0,
  "SDOH_Average SDOH": 0.5,
  "Util_Emergency Visits per 1k Members": 150,
  "Util_Specialist Visits per 1k Members": 1326.63,
  "Cost_Medical & RX Paid Amount PEPY": 10000,
  "Cost_Medical & RX Paid Amount PMPY": 8500
};

const ReportViewer = () => {
  const { archetypeId = '', token = '' } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isValidAccess, setIsValidAccess] = useState<boolean | null>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [averageData, setAverageData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  
  // Check if we're accessing via insights route (no token needed)
  const isInsightsReport = location.pathname.startsWith('/insights/report');

  function isValidArchetypeId(id: string): boolean {
    const validIds: ArchetypeId[] = ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3'];
    return validIds.includes(id as ArchetypeId);
  }

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setIsLoading(true);
        console.log('Starting report data fetch for:', archetypeId, 'access path:', location.pathname);
        
        // For insights reports, we don't need token validation
        if (isInsightsReport) {
          console.log('Insights report access - no token required');
          setIsValidAccess(true);
        }
        // For regular report URLs with no token (only admin can access these)
        else if (!token && location.pathname.startsWith('/report/')) {
          console.log('Admin direct report access - checking admin role');
          // Admin check logic would go here - for now we'll just set to true
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

          console.log('Token check result:', { userData, userError });

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
          // Fetch insights report data
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
  }, [token, archetypeId, navigate, location.pathname, isInsightsReport]);

  if (!isValidArchetypeId(archetypeId)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Archetype ID</h2>
          <p className="text-gray-600 mb-6">
            The requested archetype ID is not valid. Please check the URL or request a new report.
          </p>
          <Button onClick={() => navigate('/assessment')}>
            Take Assessment
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
        <h2 className="text-xl font-semibold mb-2">Loading Your Report</h2>
        <p className="text-gray-600">Please wait while we prepare your report...</p>
      </div>
    );
  }

  if (isValidAccess === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Access</h2>
          <p className="text-gray-600 mb-6">
            This report link is either invalid or has expired. Please request a new report.
          </p>
          <Button onClick={() => navigate('/assessment')}>
            Take Assessment
          </Button>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Report</h2>
          <p className="text-gray-600 mb-6">
            There was an error loading the report data. Please try again later.
          </p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const FallbackBanner = () => {
    if (usingFallbackData) {
      return (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
          <p className="font-bold">Demo Mode</p>
          <p>This report is using placeholder data for demonstration purposes.</p>
        </div>
      );
    }
    return null;
  };

  // Render the appropriate report type based on the route
  return (
    <>
      {usingFallbackData && <FallbackBanner />}
      {isInsightsReport ? (
        <ArchetypeReport archetypeId={archetypeId as ArchetypeId} reportData={reportData} />
      ) : (
        <DeepDiveReport reportData={reportData} userData={userData} averageData={averageData} />
      )}
    </>
  );
};

export default ReportViewer;
