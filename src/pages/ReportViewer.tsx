
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import DeepDiveReport from '@/components/report/DeepDiveReport';
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
  // Add default values for all the metrics
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

// Default average values for metrics when API data is not available
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
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [averageData, setAverageData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [usingFallbackData, setUsingFallbackData] = useState(false);

  // Helper function to validate if a string is a valid ArchetypeId
  function isValidArchetypeId(id: string): boolean {
    const validIds: ArchetypeId[] = ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3'];
    return validIds.includes(id as ArchetypeId);
  }

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setIsLoading(true);
        
        // Step 1: Check if the token is valid and get user data
        const { data: userData, error: userError } = await supabase
          .from('report_requests')
          .select('*')
          .eq('access_token', token)
          .eq('archetype_id', archetypeId)
          .maybeSingle();

        if (userError) {
          console.error('Error fetching user data:', userError);
          setIsValidToken(false);
          setIsLoading(false);
          return;
        }

        if (!userData) {
          setIsValidToken(false);
          setIsLoading(false);
          return;
        }

        // Check if the report has expired
        const isExpired = userData.expires_at && new Date(userData.expires_at) < new Date();
        if (isExpired) {
          setIsValidToken(false);
          setIsLoading(false);
          toast.error('This report link has expired.');
          return;
        }

        setUserData(userData);
        setIsValidToken(true);

        // Step 2: Always fetch the average data first for proper comparisons
        const { data: avgData, error: avgError } = await supabase
          .from('level4_deepdive_report_data')
          .select('*')
          .eq('archetype_id', 'All_Average')
          .maybeSingle();

        if (avgError) {
          console.error('Error fetching average data:', avgError);
          toast.warning('Unable to load comparison data, using defaults.');
          setAverageData(defaultAverageData);
        } else if (avgData) {
          console.log('Average data loaded:', avgData);
          setAverageData(avgData);
        } else {
          console.log('No average data found, using defaults');
          setAverageData(defaultAverageData);
        }

        // Step 3: Fetch the archetype-specific report data
        const { data: archetypeData, error: archetypeError } = await supabase
          .from('level4_deepdive_report_data')
          .select('*')
          .eq('archetype_id', archetypeId)
          .maybeSingle();

        if (archetypeError) {
          console.error('Error fetching archetype data:', archetypeError);
          toast.warning('Using placeholder report data for demonstration purposes.');
          // Use default data if real data is not available
          setReportData({ ...defaultReportData, archetype_id: archetypeId });
          setUsingFallbackData(true);
          setIsLoading(false);
          return;
        }

        if (!archetypeData) {
          console.log('No archetype data found, using fallback data');
          // Use default data if real data is not available
          setReportData({ ...defaultReportData, archetype_id: archetypeId });
          setUsingFallbackData(true);
          setIsLoading(false);
          return;
        }

        setReportData(archetypeData);
        
      } catch (err) {
        console.error('Error fetching report:', err);
        setIsValidToken(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (token && archetypeId) {
      fetchReportData();
    }
  }, [token, archetypeId]);

  // Handle case where archetypeId is invalid
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
        <p className="text-gray-600">Please wait while we prepare your deep dive analysis...</p>
      </div>
    );
  }

  if (isValidToken === false) {
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

  // Show a banner if we're using fallback data
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

  return (
    <>
      {usingFallbackData && <FallbackBanner />}
      <DeepDiveReport reportData={reportData} userData={userData} averageData={averageData} />
    </>
  );
};

export default ReportViewer;
