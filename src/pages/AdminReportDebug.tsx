
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAdminReportData } from '@/hooks/useAdminReportData';

const AdminReportDebug = () => {
  const { archetypeId = '' } = useParams();
  const [reportType, setReportType] = useState<'insights' | 'deepdive'>('deepdive');
  const [rawLevel3Data, setRawLevel3Data] = useState<any>(null);
  const [rawLevel4Data, setRawLevel4Data] = useState<any>(null);
  
  // Use our hook to get processed data
  const { data: processedData, loading, error } = useAdminReportData({
    archetypeId,
    reportType,
    skipCache: false
  });
  
  // Fetch raw data directly from both tables
  useEffect(() => {
    const fetchRawData = async () => {
      if (!archetypeId) return;
      
      // Fetch from level3
      const { data: level3Data } = await supabase
        .from('level3_report_data')
        .select('*')
        .eq('archetype_id', archetypeId)
        .maybeSingle();
        
      setRawLevel3Data(level3Data);
      
      // Fetch from level4
      const { data: level4Data } = await supabase
        .from('level4_deepdive_report_data')
        .select('*')
        .eq('archetype_id', archetypeId)
        .maybeSingle();
        
      setRawLevel4Data(level4Data);
    };
    
    fetchRawData();
  }, [archetypeId]);
  
  // Toggle report type
  const toggleReportType = () => {
    setReportType(reportType === 'insights' ? 'deepdive' : 'insights');
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div>Report Debug for Archetype: {archetypeId}</div>
            <Button onClick={toggleReportType} variant="outline">
              Switch to {reportType === 'insights' ? 'Deep Dive' : 'Insights'} Report
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="font-semibold">Current Report Type: {reportType}</p>
            <p className="text-sm text-gray-500">
              This page helps diagnose data processing issues between raw database data and 
              the processed data used in reports.
            </p>
          </div>
        </CardContent>
      </Card>
      
      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Loading data...</p>
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-800">Error Loading Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error.message}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Level 3 Data */}
          <Card>
            <CardHeader>
              <CardTitle>Raw Level3 Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm mb-2">
                {rawLevel3Data ? (
                  <div>
                    <p>Data found in level3_report_data</p>
                    <div className="mt-2 p-2 bg-gray-50 rounded">
                      <p><strong>SWOT:</strong></p>
                      <p>Strengths: {Array.isArray(rawLevel3Data.strengths) ? `Array[${rawLevel3Data.strengths.length}]` : typeof rawLevel3Data.strengths}</p>
                      <p>Recommendations: {Array.isArray(rawLevel3Data.strategic_recommendations) ? `Array[${rawLevel3Data.strategic_recommendations.length}]` : typeof rawLevel3Data.strategic_recommendations}</p>
                    </div>
                  </div>
                ) : (
                  <p>No data found in level3_report_data</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Level 4 Data */}
          <Card>
            <CardHeader>
              <CardTitle>Raw Level4 Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm mb-2">
                {rawLevel4Data ? (
                  <div>
                    <p>Data found in level4_deepdive_report_data</p>
                    <div className="mt-2 p-2 bg-gray-50 rounded">
                      <p><strong>SWOT:</strong></p>
                      <p>SWOT analysis: {rawLevel4Data.swot_analysis ? `${typeof rawLevel4Data.swot_analysis}` : 'None'}</p>
                      <p>strengths field: {Array.isArray(rawLevel4Data.strengths) ? `Array[${rawLevel4Data.strengths.length}]` : typeof rawLevel4Data.strengths}</p>
                      <p>Recommendations: {Array.isArray(rawLevel4Data.strategic_recommendations) ? `Array[${rawLevel4Data.strategic_recommendations.length}]` : typeof rawLevel4Data.strategic_recommendations}</p>
                    </div>
                  </div>
                ) : (
                  <p>No data found in level4_deepdive_report_data</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Processed Data */}
          <Card>
            <CardHeader>
              <CardTitle>Processed {reportType} Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm mb-2">
                {processedData ? (
                  <div>
                    <p>Data processed by useAdminReportData hook</p>
                    <div className="mt-2 p-2 bg-gray-50 rounded">
                      <p><strong>SWOT:</strong></p>
                      <p>Strengths: {Array.isArray(processedData.strengths) ? `Array[${processedData.strengths.length}]` : typeof processedData.strengths}</p>
                      <p>Recommendations: {Array.isArray(processedData.strategic_recommendations) ? `Array[${processedData.strategic_recommendations.length}]` : typeof processedData.strategic_recommendations}</p>
                    </div>
                  </div>
                ) : (
                  <p>No processed data available</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Raw Data Details */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Full Data Inspection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Level3 Keys</h3>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-[300px]">
                    {rawLevel3Data ? Object.keys(rawLevel3Data).join('\n') : 'No data'}
                  </pre>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Level4 Keys</h3>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-[300px]">
                    {rawLevel4Data ? Object.keys(rawLevel4Data).join('\n') : 'No data'}
                  </pre>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Processed Data Keys</h3>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-[300px]">
                    {processedData ? Object.keys(processedData).join('\n') : 'No data'}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminReportDebug;
