
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useAdminReportData } from '@/hooks/useAdminReportData';
import InsightsReportContent from '@/components/report/sections/InsightsReportContent';
import DeepDiveReportContent from '@/components/report/sections/DeepDiveReportContent';

const AdminReportViewer = () => {
  const { archetypeId = '' } = useParams();
  const navigate = useNavigate();
  const [reportType, setReportType] = useState<'insights' | 'deepdive'>(() => {
    // Determine report type from URL path
    const path = window.location.pathname;
    return path.includes('insights-report') ? 'insights' : 'deepdive';
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

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
      <div className="container mx-auto pb-12">
        {reportData ? (
          <>
            {reportType === 'insights' ? (
              <InsightsReportContent archetype={reportData} />
            ) : (
              <DeepDiveReportContent 
                archetype={reportData} 
                userData={adminUserData}
                averageData={defaultAverageData}
              />
            )}
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
