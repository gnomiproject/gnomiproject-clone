
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { RefreshCw, Home } from 'lucide-react';
import InsightsReportContent from '@/components/report/sections/InsightsReportContent';
import ContactSection from '@/components/report/sections/ContactSection';
import ReportIntroduction from '@/components/report/sections/ReportIntroduction';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminReportViewer = () => {
  const { archetypeId = '' } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawData, setRawData] = useState<any | null>(null);
  const [dataSource, setDataSource] = useState<string>('');

  // Get report type from URL parameter
  const searchParams = new URLSearchParams(location.search);
  const reportType = searchParams.get('type') || 'deepdive';
  
  // Check if this is an insights report based on URL and parameter
  const isInsightsReport = location.pathname.includes('insights-report') || reportType === 'insights';

  // Fetch minimal data on mount
  useEffect(() => {
    const fetchMinimalData = async () => {
      if (!archetypeId) {
        setError('No archetype ID provided');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const primaryTable = isInsightsReport ? 'level3_report_data' : 'level4_deepdive_report_data';
        const fallbackTable = isInsightsReport ? 'level4_deepdive_report_data' : 'level3_report_data';
        
        console.log(`AdminReportViewer: Fetching ${reportType} data for ${archetypeId} from ${primaryTable}`);
        
        const { data, error } = await supabase
          .from(primaryTable)
          .select('archetype_id, archetype_name, short_description, long_description, family_id')
          .eq('archetype_id', archetypeId)
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          // Use uppercase archetype ID as the code
          const archetypeCode = archetypeId.toUpperCase();
          
          setRawData({
            ...data,
            code: archetypeCode,
            reportType: isInsightsReport ? 'Insights' : 'Deep Dive'
          });
          setDataSource(primaryTable);
          setLoading(false);
          return;
        }
        
        // If no data found in primary table, try fallback
        console.log(`AdminReportViewer: No data found in ${primaryTable}, trying ${fallbackTable}`);
        const { data: fallbackData, error: fallbackError } = await supabase
          .from(fallbackTable)
          .select('archetype_id, archetype_name, short_description, long_description, family_id')
          .eq('archetype_id', archetypeId)
          .maybeSingle();
          
        if (fallbackError) throw fallbackError;
        
        if (fallbackData) {
          // Use uppercase archetype ID as the code
          const archetypeCode = archetypeId.toUpperCase();
          
          setRawData({
            ...fallbackData,
            code: archetypeCode,
            reportType: isInsightsReport ? 'Insights' : 'Deep Dive'
          });
          setDataSource(`${fallbackTable} (fallback)`);
        } else {
          throw new Error('No data found for this archetype');
        }
      } catch (err: any) {
        console.error('Error fetching archetype data:', err);
        setError(err.message || 'Failed to load report data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMinimalData();
  }, [archetypeId, isInsightsReport, reportType]);

  return (
    <div className="container mx-auto py-8 px-4">
      {loading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-500">Loading admin report data...</p>
            </div>
          </CardContent>
        </Card>
      ) : error || !rawData ? (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Report</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6">{error || 'No data found for this archetype'}</p>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => window.location.reload()} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" /> Try Again
              </Button>
              <Button variant="outline" onClick={() => navigate('/admin')} className="flex items-center gap-2">
                <Home className="h-4 w-4" /> Back to Admin
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Header Section */}
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-gray-200 rounded text-sm">
                        {rawData.code}
                      </span>
                      {rawData.archetype_name}
                    </div>
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    {rawData.reportType} Report View
                  </p>
                  <div className="text-xs text-gray-400 mt-1">
                    Data source: {dataSource}
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-3 w-3" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Report Content */}
          <Tabs defaultValue="formatted" className="w-full">
            <TabsList>
              <TabsTrigger value="formatted">Formatted Report</TabsTrigger>
              <TabsTrigger value="raw">Raw Data</TabsTrigger>
            </TabsList>
            
            <TabsContent value="formatted" className="space-y-6">
              <ReportIntroduction 
                archetypeName={rawData.archetype_name}
                archetypeId={rawData.code}
                userData={null}
                isAdminView={true}
              />
              
              <InsightsReportContent archetype={rawData} />
              
              <ContactSection isAdminView={true} userData={{
                name: "Admin View",
                organization: "System Access",
                email: "admin@example.com",
                created_at: new Date().toISOString()
              }} />
            </TabsContent>
            
            <TabsContent value="raw">
              <Card>
                <CardHeader>
                  <CardTitle>Raw Data Explorer</CardTitle>
                  <p className="text-xs text-gray-500">Source: {dataSource}</p>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 rounded p-4 overflow-auto max-h-[800px]">
                    <pre className="text-xs whitespace-pre-wrap">
                      {JSON.stringify(rawData, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Back to Admin Dashboard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReportViewer;
