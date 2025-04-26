
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetArchetype } from '@/hooks/useGetArchetype';
import { supabase } from '@/integrations/supabase/client';
import DeepDiveReport from '@/components/report/DeepDiveReport';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

const ReportViewer = () => {
  const { archetypeId = '', token = '' } = useParams();
  const navigate = useNavigate();
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const { archetypeData, isLoading, error } = useGetArchetype(archetypeId);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const { data, error } = await supabase
          .from('report_requests')
          .select('status, expires_at')
          .eq('archetype_id', archetypeId)
          .eq('access_token', token)
          .single();

        if (error) throw error;

        const isValid = data && 
          data.status === 'active' && 
          (!data.expires_at || new Date(data.expires_at) > new Date());

        setIsValidToken(isValid);
      } catch (err) {
        console.error('Error validating token:', err);
        setIsValidToken(false);
      }
    };

    if (token && archetypeId) {
      validateToken();
    }
  }, [token, archetypeId]);

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

  if (isLoading) {
    return <DeepDiveReport archetypeData={null} loading={true} />;
  }

  if (error || !archetypeData) {
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

  return <DeepDiveReport archetypeData={archetypeData} />;
};

export default ReportViewer;
