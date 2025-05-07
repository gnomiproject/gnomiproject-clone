
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
  const [diagnosticMode, setDiagnosticMode] = useState<'view' | 'lookup'>('view');
  const [lookupToken, setLookupToken] = useState('');
  const [lookupArchetypeId, setLookupArchetypeId] = useState('');

  useEffect(() => {
    // Only fetch when in view mode and we have parameters
    if (diagnosticMode === 'view' && (archetypeId || token)) {
      fetchReportData(archetypeId, token);
    } else {
      // If no parameters, switch to lookup mode automatically
      setDiagnosticMode('lookup');
      setLoading(false);
    }
  }, [archetypeId, token, diagnosticMode]);

  const fetchReportData = async (id: string, accessToken?: string) => {
    console.log('Report Diagnostic - URL Parameters:', {
      archetypeId: id,
      token: accessToken ? `${accessToken.substring(0, 5)}...` : 'missing'
    });

    if (!accessToken || !id) {
      setError('Missing token or archetypeId in URL');
      setLoading(false);
      return;
    }

    try {
      // Validate token against report_requests
      const { data: reportRequest, error: tokenError } = await supabase
        .from('report_requests')
        .select('*')
        .eq('access_token', accessToken)
        .eq('archetype_id', id)
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
        .eq('archetype_id', id)
        .maybeSingle();

      if (archetypeError) {
        console.error('Diagnostic - Archetype data error:', archetypeError);
        setError(`Archetype data error: ${archetypeError.message}`);
        setLoading(false);
        return;
      }

      if (!archetypeData) {
        console.error('Diagnostic - No archetype data found');
        setError(`No data found for archetype: ${id}`);
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

  const handleLookup = () => {
    if (lookupArchetypeId && lookupToken) {
      fetchReportData(lookupArchetypeId, lookupToken);
      setDiagnosticMode('view');
    } else {
      setError('Please enter both Archetype ID and Token');
    }
  };

  return (
    <Card className="p-6 m-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Report Diagnostic Tool</h2>
      
      {diagnosticMode === 'lookup' ? (
        <div className="mb-6 space-y-4">
          <p className="text-gray-600">Enter report information to diagnose:</p>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Archetype ID</label>
              <input 
                type="text" 
                className="w-full p-2 border border-gray-300 rounded"
                value={lookupArchetypeId}
                onChange={(e) => setLookupArchetypeId(e.target.value)}
                placeholder="e.g., a1, b2, c3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Access Token</label>
              <input 
                type="text" 
                className="w-full p-2 border border-gray-300 rounded"
                value={lookupToken}
                onChange={(e) => setLookupToken(e.target.value)}
                placeholder="Enter access token"
              />
            </div>
            <Button onClick={handleLookup} className="w-full">
              Lookup Report
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">URL Parameters</h3>
            <div className="bg-gray-100 p-3 rounded">
              <p><span className="font-medium">Archetype ID:</span> {archetypeId || lookupArchetypeId || 'Missing'}</p>
              <p><span className="font-medium">Token:</span> {token ? `${token.substring(0, 5)}...` : 
                     lookupToken ? `${lookupToken.substring(0, 5)}...` : 'Missing'}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setDiagnosticMode('lookup')}
              className="mt-2"
            >
              Change Report
            </Button>
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
        </div>
      )}
    </Card>
  );
};

export default ReportDiagnosticTool;
