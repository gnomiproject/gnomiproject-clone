
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { RefreshCw, Home } from 'lucide-react';

// Simplified admin-only report viewer with minimal processing
const AdminReportViewer = () => {
  const { archetypeId = '' } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawData, setRawData] = useState<any | null>(null);
  const [dataSource, setDataSource] = useState<string>('');
  
  // Check if this is an insights report or deep dive based on URL
  const isInsightsReport = location.pathname.includes('insights-report');

  // Fetch minimal data on mount
  useEffect(() => {
    const fetchMinimalData = async () => {
      setLoading(true);
      try {
        // Try to get basic data with minimal fields
        const { data, error } = await supabase
          .from(isInsightsReport ? 'level3_report_data' : 'level4_deepdive_report_data')
          .select('archetype_id, archetype_name, short_description, long_description, family_id')
          .eq('archetype_id', archetypeId)
          .maybeSingle();

        if (error) throw error;
        
        if (!data) {
          // Fallback to other table if no data found
          const { data: fallbackData, error: fallbackError } = await supabase
            .from(isInsightsReport ? 'level4_deepdive_report_data' : 'level3_report_data')
            .select('archetype_id, archetype_name, short_description, long_description, family_id')
            .eq('archetype_id', archetypeId)
            .maybeSingle();
            
          if (fallbackError) throw fallbackError;
          
          if (fallbackData) {
            setRawData(fallbackData);
            setDataSource(isInsightsReport ? 'level4_deepdive_report_data' : 'level3_report_data');
          } else {
            throw new Error('No data found for this archetype');
          }
        } else {
          setRawData(data);
          setDataSource(isInsightsReport ? 'level3_report_data' : 'level4_deepdive_report_data');
        }
      } catch (err: any) {
        console.error('Error fetching archetype data:', err);
        setError(err.message || 'Failed to load report data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMinimalData();
  }, [archetypeId, isInsightsReport]);

  // Simple refresh function
  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => window.location.reload(), 100);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-500">Loading admin report data...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !rawData) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Report</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6">{error || 'No data found for this archetype'}</p>
            <div className="flex flex-wrap gap-4">
              <Button onClick={handleRefresh} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" /> Try Again
              </Button>
              <Button variant="outline" onClick={() => navigate('/admin')} className="flex items-center gap-2">
                <Home className="h-4 w-4" /> Back to Admin
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>{rawData.archetype_name || `Archetype ${archetypeId}`}</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-3 w-3" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-sm text-gray-500">
            <strong>Source:</strong> {dataSource} | <strong>Admin View Mode:</strong> {isInsightsReport ? 'Insights Report' : 'Deep Dive Report'}
          </div>
          
          {/* Basic Archetype Information */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="mb-4">{rawData.short_description || 'No description available'}</p>
            
            {rawData.long_description && (
              <>
                <h3 className="text-md font-medium mb-1">Full Description</h3>
                <p className="text-sm">{rawData.long_description}</p>
              </>
            )}
          </div>
          
          {/* Raw Data Explorer */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Raw Data Explorer</h2>
            <p className="text-xs text-gray-500 mb-2">For debugging only. This represents the raw data from the database.</p>
            <div className="bg-gray-100 rounded p-4 overflow-auto max-h-96">
              <pre className="text-xs">{JSON.stringify(rawData, null, 2)}</pre>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
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
  );
};

export default AdminReportViewer;
