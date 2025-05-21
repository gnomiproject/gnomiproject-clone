
import React, { useState } from 'react';
import ReportContainer from '@/components/report/components/ReportContainer';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';

interface ReportViewerProps {
  archetypeId: string;
  reportData: any;
  showDiagnostics: boolean;
  toggleDiagnostics: () => void;
  showDebugData: boolean;
  toggleDebugData: () => void;
  isInsightsReport?: boolean;
  isAdminView?: boolean;
}

const ReportViewer: React.FC<ReportViewerProps> = ({
  archetypeId,
  reportData,
  showDiagnostics,
  toggleDiagnostics,
  showDebugData,
  toggleDebugData,
  isInsightsReport = false,
  isAdminView = false,
}) => {
  const [refreshing, setRefreshing] = useState(false);

  // Add logging for debugging
  console.log('[ReportViewer] Rendering with data:', {
    hasData: !!reportData,
    archetypeId,
    isInsightsReport,
    isAdminView,
  });

  const handleRefresh = () => {
    setRefreshing(true);
    // Trigger data refresh here if needed
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (!reportData) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-gray-500">No report data available.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Debug Tools */}
      {!showDiagnostics && !showDebugData && (
        <div className="fixed right-6 top-24 z-50 flex gap-2 print:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleDebugData}
            className="bg-white shadow-md hover:bg-gray-100"
          >
            {showDebugData ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
            Debug
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleDiagnostics}
            className="bg-white shadow-md hover:bg-gray-100"
          >
            Diagnostics
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="bg-white shadow-md hover:bg-gray-100"
            disabled={refreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      )}

      {/* Main Report Container */}
      <ReportContainer 
        reportData={reportData}
        isAdminView={isAdminView}
      />
    </div>
  );
};

export default ReportViewer;
