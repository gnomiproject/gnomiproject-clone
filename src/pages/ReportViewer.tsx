
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import DeepDiveReport from '@/components/report/DeepDiveReport';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { ArchetypeId } from '@/types/archetype';
import { toast } from 'sonner';

const ReportViewer = () => {
  const { archetypeId = '', token = '' } = useParams();
  const navigate = useNavigate();
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [averageData, setAverageData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

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

        // Step 2: Fetch the archetype-specific report data
        const { data: archetypeData, error: archetypeError } = await supabase
          .from('level4_deepdive_report_data')
          .select('*')
          .eq('archetype_id', archetypeId)
          .maybeSingle();

        if (archetypeError) {
          console.error('Error fetching archetype data:', archetypeError);
          toast.error('Error loading report data. Please try again later.');
          setIsLoading(false);
          return;
        }

        // Step 3: Fetch the average data for comparisons
        const { data: averageData, error: averageError } = await supabase
          .from('level4_deepdive_report_data')
          .select('*')
          .eq('archetype_id', 'All_Average')
          .maybeSingle();

        if (averageError) {
          console.error('Error fetching average data:', averageError);
          toast.error('Error loading comparison data. Some charts may not display correctly.');
        }

        setReportData(archetypeData);
        setAverageData(averageData);
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

  return <DeepDiveReport reportData={reportData} userData={userData} averageData={averageData} />;
};

export default ReportViewer;
