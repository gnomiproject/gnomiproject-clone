
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import InsightsReportContent from '@/components/report/sections/InsightsReportContent';
import DeepDiveReportContent from '@/components/report/sections/DeepDiveReportContent';
import { useAdminReportData } from '@/hooks/useAdminReportData';
import ErrorBoundary from '@/components/shared/ErrorBoundary';

const AdminReportViewer = () => {
  const { archetypeId = '' } = useParams();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [reportType, setReportType] = useState<'insights' | 'deepdive'>(() => {
    const path = window.location.pathname;
    return path.includes('insights-report') ? 'insights' : 'deepdive';
  });
  
  const navigate = useNavigate();

  // Debug current route
  useEffect(() => {
    console.log('AdminReportViewer Path:', {
      pathname: window.location.pathname,
      reportType,
      archetypeId
    });
  }, [reportType, archetypeId]);

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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
      toast.success("Report data refreshed");
    } catch (err) {
      console.error("Refresh error:", err);
      toast.error("Failed to refresh data");
    } finally {
      setIsRefreshing(false);
    }
  };

  const toggleReportType = () => {
    const newType = reportType === 'insights' ? 'deepdive' : 'insights';
    setReportType(newType);
    const basePath = '/admin/';
    const path = newType === 'insights' ? 'insights-report' : 'report';
    navigate(`${basePath}${path}/${archetypeId}`);
  };

  // Safe way to get to debug data view
  const goToDebugView = () => {
    navigate(`/admin/debug/${archetypeId}`);
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

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Report</h2>
          <p className="text-red-600">{error.message}</p>
          <Button onClick={handleRefresh} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Admin control bar */}
      <div className="bg-gray-100 border-b border-gray-200 p-4 sticky top-0 z-10 print:hidden">
        <div className="container mx-auto flex justify-between items-center">
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
              onClick={goToDebugView}
            >
              Debug Data
            </Button>
          </div>
        </div>
      </div>

      {/* Report content using same components as user view */}
      <ErrorBoundary>
        <div className="container mx-auto py-8">
          {reportData && reportType === 'insights' ? (
            <InsightsReportContent archetype={reportData} />
          ) : reportData && reportType === 'deepdive' ? (
            <DeepDiveReportContent 
              archetype={reportData} 
              userData={{
                name: 'Admin View',
                organization: 'Admin Organization',
                created_at: new Date().toISOString()
              }}
              averageData={{}}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">No report data available</p>
            </div>
          )}
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default AdminReportViewer;
