
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw } from 'lucide-react';
import { useAdminReportData } from '@/hooks/useAdminReportData';
import InsightsReportContent from '@/components/report/sections/InsightsReportContent';
import DeepDiveReportContent from '@/components/report/sections/DeepDiveReportContent';
import { getReportSchema, ReportType } from '@/utils/reports/schemaUtils';
import { OverviewTab } from '@/components/admin/report-sections/OverviewTab';
import { SwotTab } from '@/components/admin/report-sections/SwotTab';
import { MetricsTab } from '@/components/admin/report-sections/MetricsTab';
import { RecommendationsTab } from '@/components/admin/report-sections/RecommendationsTab';

const AdminReportViewer = () => {
  const { archetypeId = '' } = useParams();
  const navigate = useNavigate();
  const [reportType, setReportType] = useState<'insights' | 'deepdive'>(() => {
    // Determine report type from URL path
    const path = window.location.pathname;
    return path.includes('insights-report') ? 'insights' : 'deepdive';
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Get the schema for the current report type
  const schemaType: ReportType = reportType === 'insights' ? 'insight' : 'deepDive';
  const reportSchema = getReportSchema(schemaType);

  // Get report data from the admin hook
  const {
    data: reportData,
    loading,
    error,
    dataSource,
    refreshData
  } = useAdminReportData({
    archetypeId,
    reportType,
    skipCache: isRefreshing
  });

  useEffect(() => {
    if (error) {
      toast.error(`Error loading report: ${error.message}`);
    }
  }, [error]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
      toast.success("Report data refreshed");
    } catch (err) {
      console.error("Refresh error:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const toggleReportType = () => {
    const newType = reportType === 'insights' ? 'deepdive' : 'insights';
    setReportType(newType);
    
    // Update URL to match the new report type
    const basePath = '/admin/';
    const path = newType === 'insights' ? 'insights-report' : 'report';
    navigate(`${basePath}${path}/${archetypeId}`);
  };

  // Create a default user data for admin view
  const adminUserData = {
    name: 'Admin Viewer',
    organization: 'Admin Organization',
    email: 'admin@example.com',
    created_at: new Date().toISOString()
  };

  // Default average data
  const defaultAverageData = {
    "Demo_Average Age": 40,
    "Demo_Average Family Size": 3.0,
    "Risk_Average Risk Score": 1.0,
    "Cost_Medical & RX Paid Amount PMPY": 5000
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading {reportType} report...</p>
        </div>
      </div>
    );
  }

  const renderAdminTabs = () => {
    if (!reportData) return null;

    return (
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="swot">SWOT Analysis</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <OverviewTab report={reportData} />
        </TabsContent>
        
        <TabsContent value="swot">
          <SwotTab report={reportData} />
        </TabsContent>
        
        <TabsContent value="metrics">
          <MetricsTab report={reportData} />
        </TabsContent>
        
        <TabsContent value="recommendations">
          <RecommendationsTab report={reportData} />
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <div className="bg-white">
      {/* Admin control bar */}
      <div className="bg-gray-100 border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold">
              Admin View: {reportType === 'insights' ? 'Insights Report' : 'Deep Dive Report'}
            </h2>
            <span className="text-xs bg-gray-200 px-2 py-1 rounded">
              {archetypeId}
            </span>
            <span className="text-xs text-gray-500">
              Source: {dataSource || 'unknown'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              size="sm"
              variant="outline"
              onClick={toggleReportType}
            >
              Switch to {reportType === 'insights' ? 'Deep Dive' : 'Insights'} Report
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh Data
                </>
              )}
            </Button>
            <Button 
              size="sm"
              variant="secondary"
              onClick={() => navigate(`/admin/debug/${archetypeId}`)}
            >
              Debug Data
            </Button>
          </div>
        </div>
      </div>

      {/* Report content */}
      <div className="container mx-auto py-8">
        {reportData ? (
          <>
            {/* Admin tabbed view for detailed sections */}
            <div className="mb-8">
              {renderAdminTabs()}
            </div>
            
            {/* Full report preview */}
            <div className="mt-12 border-t pt-8">
              <h2 className="text-xl font-semibold mb-4">Full Report Preview</h2>
              {reportType === 'insights' ? (
                <InsightsReportContent archetype={reportData} />
              ) : (
                <DeepDiveReportContent 
                  archetype={reportData} 
                  userData={adminUserData}
                  averageData={defaultAverageData}
                />
              )}
            </div>
          </>
        ) : (
          <div className="py-12 text-center">
            <h2 className="text-xl font-semibold text-red-600">Report Data Unavailable</h2>
            <p className="mt-2">Could not load report data for archetype {archetypeId}</p>
            <Button 
              className="mt-4"
              onClick={() => navigate(`/admin`)}
            >
              Back to Admin
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReportViewer;
