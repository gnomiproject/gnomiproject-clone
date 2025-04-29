
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ReportDiagnosticTool: React.FC = () => {
  const { archetypeId = '', token } = useParams();
  const [reportData, setReportData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRawData, setShowRawData] = useState(false);

  useEffect(() => {
    const fetchReportData = async () => {
      console.log('Report Diagnostic - URL Parameters:', {
        archetypeId,
        token: token ? `${token.substring(0, 5)}...` : 'missing'
      });

      if (!token || !archetypeId) {
        setError('Missing token or archetypeId in URL');
        setLoading(false);
        return;
      }

      try {
        // Validate token against report_requests
        const { data: reportRequest, error: tokenError } = await supabase
          .from('report_requests')
          .select('*')
          .eq('access_token', token)
          .eq('archetype_id', archetypeId)
          .eq('status', 'active')
          .maybeSingle();

        if (tokenError) {
          console.error('Diagnostic - Token validation error:', tokenError);
          setError(`Token validation failed: ${tokenError.message}`);
          setLoading(false);
          return;
        }

        if (!reportRequest) {
          console.error('Diagnostic - No report request found for token');
          setError('No valid report found with this token');
          setLoading(false);
          return;
        }

        console.log('Diagnostic - Report request found:', {
          id: reportRequest.id,
          created: reportRequest.created_at,
          expires: reportRequest.expires_at || 'none',
          hasAssessmentResult: !!reportRequest.assessment_result
        });

        // Fetch archetype data
        const { data: archetypeData, error: archetypeError } = await supabase
          .from('level4_deepdive_report_data')
          .select('*')
          .eq('archetype_id', archetypeId)
          .maybeSingle();

        if (archetypeError) {
          console.error('Diagnostic - Archetype data error:', archetypeError);
          setError(`Archetype data error: ${archetypeError.message}`);
          setLoading(false);
          return;
        }

        if (!archetypeData) {
          console.error('Diagnostic - No archetype data found');
          setError(`No data found for archetype: ${archetypeId}`);
          setLoading(false);
          return;
        }

        console.log('Diagnostic - Archetype data found:', {
          name: archetypeData.archetype_name || 'Unknown',
          hasStrengths: archetypeData.strategic_recommendations ? 
            (Array.isArray(archetypeData.strategic_recommendations) ? 
              archetypeData.strategic_recommendations.length : 'N/A') : 'N/A'
        });

        setReportData({
          reportRequest,
          archetypeData
        });
      } catch (err) {
        console.error('Diagnostic - Unexpected error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [archetypeId, token]);

  return (
    <Card className="p-6 m-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Report Diagnostic Tool</h2>
      
      <div className="mb-4">
        <h3 className="font-semibold mb-2">URL Parameters</h3>
        <div className="bg-gray-100 p-3 rounded">
          <p><span className="font-medium">Archetype ID:</span> {archetypeId || 'Missing'}</p>
          <p><span className="font-medium">Token:</span> {token ? `${token.substring(0, 5)}...` : 'Missing'}</p>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading report data...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded mb-4">
          <h3 className="font-semibold text-red-800 mb-2">Error</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {reportData && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 p-4 rounded">
            <h3 className="font-semibold text-green-800">Report Data Loaded Successfully</h3>
            <p className="mt-2">
              <span className="font-medium">Report for:</span> {reportData.archetypeData.archetype_name || 'Unnamed Archetype'}
            </p>
            <p>
              <span className="font-medium">Requested by:</span> {reportData.reportRequest.name} ({reportData.reportRequest.email})
            </p>
            <p>
              <span className="font-medium">Organization:</span> {reportData.reportRequest.organization}
            </p>
          </div>
          
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              onClick={() => setShowRawData(!showRawData)}
              size="sm"
            >
              {showRawData ? 'Hide Raw Data' : 'Show Raw Data'}
            </Button>
          </div>
          
          {showRawData && (
            <div className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
              <h4 className="font-medium mb-2">Report Request Data</h4>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(reportData.reportRequest, null, 2)}
              </pre>
              
              <h4 className="font-medium mt-4 mb-2">Archetype Data Sample</h4>
              <pre className="text-xs overflow-auto">
                {JSON.stringify({
                  archetype_id: reportData.archetypeData.archetype_id,
                  archetype_name: reportData.archetypeData.archetype_name,
                  short_description: reportData.archetypeData.short_description,
                  strategic_recommendations: reportData.archetypeData.strategic_recommendations?.slice(0, 2)
                }, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default ReportDiagnosticTool;
