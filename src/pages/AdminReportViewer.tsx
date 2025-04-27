
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
import { ArchetypeDetailedData } from '@/types/archetype';

const AdminReportViewer = () => {
  const { archetypeId = '' } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [debugMode, setDebugMode] = useState(true); // Set debug mode on by default
  
  // Determine report type based on URL
  const searchParams = new URLSearchParams(location.search);
  const queryReportType = searchParams.get('type') || 'deepdive';
  const isInsightsReport = location.pathname.includes('insights-report') || queryReportType === 'insights';
  const reportType = isInsightsReport ? 'insights' : 'deepdive';
  
  console.log('AdminReportViewer: Initial render with params:', { 
    archetypeId, 
    path: location.pathname, 
    search: location.search,
    reportType,
    isInsightsReport
  });
  
  // Use the admin report data hook
  const { data: rawData, loading, error, dataSource, refreshData } = useAdminReportData({
    archetypeId,
    reportType,
    skipCache: false
  });

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

  // Log detailed information for debugging
  useEffect(() => {
    if (rawData) {
      console.log('AdminReportViewer: Raw data received:', {
        reportType,
        keys: Object.keys(rawData),
        dataSource,
        strengths: Array.isArray(rawData.strengths) ? `Array[${rawData.strengths.length}]` : typeof rawData.strengths,
        recommendations: Array.isArray(rawData.strategic_recommendations) ? 
          `Array[${rawData.strategic_recommendations.length}]` : typeof rawData.strategic_recommendations
      });
    }
  }, [rawData, dataSource, reportType]);

  // Prepare safe data for deep dive report
  const prepareDeepDiveData = (data: any): ArchetypeDetailedData => {
    if (!data) {
      return {
        id: archetypeId as any,
        name: `Archetype ${archetypeId.toUpperCase()} (No Data)`,
        familyId: 'a' as any,
        strengths: [],
        weaknesses: [],
        opportunities: [],
        threats: [],
        strategic_recommendations: []
      } as ArchetypeDetailedData;
    }
    
    console.log('AdminReportViewer: Preparing deep dive data with:', {
      hasStrengths: Array.isArray(data.strengths),
      strengthsCount: Array.isArray(data.strengths) ? data.strengths.length : 'not an array',
      hasRecommendations: Array.isArray(data.strategic_recommendations),
      recsCount: Array.isArray(data.strategic_recommendations) ? data.strategic_recommendations.length : 'not an array'
    });
    
    // Create a clean copy with required fields
    const safeData = {
      id: data.id || data.archetype_id || archetypeId,
      name: data.name || data.archetype_name || `Archetype ${archetypeId.toUpperCase()}`,
      familyId: data.family_id || 'a',
      family_id: data.family_id || 'a',
      long_description: data.long_description || data.executive_summary || 'No description available.',
      short_description: data.short_description || 'No description available.',
      strengths: Array.isArray(data.strengths) ? data.strengths : [],
      weaknesses: Array.isArray(data.weaknesses) ? data.weaknesses : [],
      opportunities: Array.isArray(data.opportunities) ? data.opportunities : [],
      threats: Array.isArray(data.threats) ? data.threats : [],
      strategic_recommendations: Array.isArray(data.strategic_recommendations) ? 
        data.strategic_recommendations : []
    };
    
    console.log('AdminReportViewer: Prepared deep dive data with:', {
      id: safeData.id,
      name: safeData.name,
      strengthsCount: safeData.strengths.length,
      recommendationsCount: safeData.strategic_recommendations.length
    });
    
    return safeData as ArchetypeDetailedData;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Debug toggle button */}
      <Button
        variant="outline"
        size="sm"
        onClick={toggleDebugMode}
        className="absolute top-4 right-4 flex items-center gap-2"
      >
        <Bug className="h-4 w-4" />
        {debugMode ? "Hide Debug Info" : "Show Debug Info"}
      </Button>
      
      {/* Debug information panel */}
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
            {rawData && (
              <div className="mt-4">
                <details>
                  <summary className="cursor-pointer font-medium">SWOT Data Details</summary>
                  <div className="mt-2 p-2 bg-white rounded text-xs">
                    <div><strong>Strengths:</strong> {Array.isArray(rawData.strengths) ? `Array[${rawData.strengths.length}]` : typeof rawData.strengths}</div>
                    <div><strong>Weaknesses:</strong> {Array.isArray(rawData.weaknesses) ? `Array[${rawData.weaknesses.length}]` : typeof rawData.weaknesses}</div>
                    <div><strong>Opportunities:</strong> {Array.isArray(rawData.opportunities) ? `Array[${rawData.opportunities.length}]` : typeof rawData.opportunities}</div>
                    <div><strong>Threats:</strong> {Array.isArray(rawData.threats) ? `Array[${rawData.threats.length}]` : typeof rawData.threats}</div>
                    <div><strong>Strategic Recommendations:</strong> {Array.isArray(rawData.strategic_recommendations) ? `Array[${rawData.strategic_recommendations.length}]` : typeof rawData.strategic_recommendations}</div>
                  </div>
                </details>
                <details className="mt-2">
                  <summary className="cursor-pointer font-medium">First 3 items of each array</summary>
                  <div className="mt-2 p-2 bg-white rounded text-xs space-y-2">
                    <div>
                      <strong>Strengths (first 3):</strong><br/>
                      {Array.isArray(rawData.strengths) 
                        ? rawData.strengths.slice(0, 3).map((s: string, i: number) => <div key={i}>{i+1}. {s}</div>)
                        : 'Not an array'}
                    </div>
                    <div>
                      <strong>Strategic Recommendations (first 3):</strong><br/>
                      {Array.isArray(rawData.strategic_recommendations) 
                        ? rawData.strategic_recommendations.slice(0, 3).map((r: any, i: number) => 
                            <div key={i}>{i+1}. {r.title || 'No title'}</div>)
                        : 'Not an array'}
                    </div>
                  </div>
                </details>
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
                        {rawData.code || rawData.archetype_id?.toUpperCase() || archetypeId.toUpperCase()}
                      </span>
                      {rawData.name || rawData.archetype_name || `Archetype ${archetypeId.toUpperCase()}`}
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
                    <InsightsReportContent archetype={rawData} />
                  </div>
                </div>
              ) : (
                <DeepDiveReport 
                  reportData={prepareDeepDiveData(rawData)} 
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
