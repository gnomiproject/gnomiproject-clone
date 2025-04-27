
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Home, Bug } from 'lucide-react';
import InsightsReportContent from '@/components/report/sections/InsightsReportContent';
import ContactSection from '@/components/report/sections/ContactSection';
import DeepDiveReport from '@/components/report/DeepDiveReport';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminReportData } from '@/hooks/useAdminReportData';
import { toast } from '@/components/ui/use-toast';

const AdminReportViewer = () => {
  const { archetypeId = '' } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [debugMode, setDebugMode] = useState(true); // Set debug mode on by default
  
  // Console log for initial mount
  console.log('AdminReportViewer: Initial render with params:', { archetypeId, path: location.pathname, search: location.search });
  
  // Determine report type based on URL and parameters
  const searchParams = new URLSearchParams(location.search);
  const queryReportType = searchParams.get('type') || 'deepdive';
  const isInsightsReport = location.pathname.includes('insights-report') || queryReportType === 'insights';
  const reportType = isInsightsReport ? 'insights' : 'deepdive';
  
  console.log('AdminReportViewer: Report type determined:', { reportType, isInsightsReport, queryReportType });
  
  // Use the custom hook for data fetching with explicit parameters
  const { data: rawData, loading, error, dataSource, refreshData } = useAdminReportData({
    archetypeId,
    reportType,
    skipCache: false
  });

  useEffect(() => {
    // Log debugging information when component mounts or parameters change
    console.log('AdminReportViewer: Effect triggered:', {
      archetypeId,
      reportType,
      isInsightsReport,
      hasData: !!rawData,
      dataSource,
      rawDataKeys: rawData ? Object.keys(rawData) : [],
      error: error?.message || 'none'
    });
    
    return () => {
      console.log('AdminReportViewer: Unmounting component');
    };
  }, [archetypeId, reportType, rawData, dataSource, error]);

  // Mock user data for admin view
  const mockUserData = {
    name: "Admin View",
    organization: "Sample Organization",
    email: "admin@example.com",
    created_at: new Date().toISOString()
  };

  // Default average data for comparisons
  const defaultAverageData = {
    archetype_id: 'All_Average',
    archetype_name: 'Population Average',
    "Demo_Average Age": 40,
    "Demo_Average Family Size": 3.0,
    "Risk_Average Risk Score": 1.0,
    "Cost_Medical & RX Paid Amount PMPY": 5000
  };

  const handleRefresh = () => {
    console.log('AdminReportViewer: Refreshing data');
    refreshData();
    toast({
      title: "Refreshing report data",
      description: "Fetching latest data for this archetype",
    });
  };

  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
    toast({
      title: debugMode ? "Debug mode disabled" : "Debug mode enabled",
      description: debugMode ? "Hiding detailed debug information" : "Showing detailed debug information",
    });
  };

  console.log('AdminReportViewer: Rendering with state:', { loading, error: error?.message, hasData: !!rawData });

  // Return the component content based on various conditions
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Debug toggle button (visible in all environments temporarily) */}
      <Button
        variant="outline"
        size="sm"
        onClick={toggleDebugMode}
        className="absolute top-4 right-4 flex items-center gap-2"
      >
        <Bug className="h-4 w-4" />
        {debugMode ? "Hide Debug Info" : "Show Debug Info"}
      </Button>
      
      {/* Debug information panel (when debug mode is enabled) */}
      {debugMode && (
        <Card className="mb-6 border-amber-300 bg-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-800">Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><strong>Archetype ID:</strong></div>
              <div>{archetypeId || 'Not set'}</div>
              <div><strong>Report Type:</strong></div>
              <div>{reportType} (isInsightsReport: {String(isInsightsReport)})</div>
              <div><strong>URL Path:</strong></div>
              <div>{location.pathname}</div>
              <div><strong>Query String:</strong></div>
              <div>{location.search}</div>
              <div><strong>Data Source:</strong></div>
              <div>{dataSource || 'None'}</div>
              <div><strong>Loading:</strong></div>
              <div>{String(loading)}</div>
              <div><strong>Has Error:</strong></div>
              <div>{String(!!error)}</div>
              <div><strong>Has Data:</strong></div>
              <div>{String(!!rawData)}</div>
              <div><strong>Raw Data Keys:</strong></div>
              <div>{rawData ? Object.keys(rawData).join(', ') : 'No data'}</div>
            </div>
            {error && (
              <div className="mt-4 p-2 bg-red-100 text-red-800 rounded">
                <strong>Error:</strong> {error.message}
              </div>
            )}
          </CardContent>
        </Card>
      )}

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
            <p className="mb-6">{error?.message || 'No data found for this archetype'}</p>
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
                        {rawData.code || rawData.archetype_id?.toUpperCase()}
                      </span>
                      {rawData.name || rawData.archetype_name}
                    </div>
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    {rawData.reportType || (isInsightsReport ? 'Insights' : 'Deep Dive')} Report View
                  </p>
                  <div className="text-xs text-gray-400 mt-1">
                    Data source: {dataSource || 'Unknown'}
                  </div>
                </div>
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
          </Card>

          {/* Report Content */}
          <Tabs defaultValue="formatted" className="w-full">
            <TabsList>
              <TabsTrigger value="formatted">Formatted Report</TabsTrigger>
              <TabsTrigger value="raw">Raw Data</TabsTrigger>
            </TabsList>
            
            <TabsContent value="formatted" className="space-y-6">
              {isInsightsReport ? (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow overflow-hidden mb-12">
                    {console.log('AdminReportViewer: About to render InsightsReportContent with:', rawData)}
                    <InsightsReportContent archetype={rawData} />
                  </div>
                </div>
              ) : (
                <DeepDiveReport 
                  reportData={rawData} 
                  userData={mockUserData}
                  averageData={defaultAverageData}
                  isAdminView={true}
                />
              )}
              
              <ContactSection 
                isAdminView={true} 
                userData={mockUserData} 
              />
            </TabsContent>
            
            <TabsContent value="raw">
              <Card>
                <CardHeader>
                  <CardTitle>Raw Data Explorer</CardTitle>
                  <p className="text-xs text-gray-500">Source: {dataSource || 'Unknown'}</p>
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
