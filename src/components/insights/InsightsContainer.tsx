import React from 'react';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import InsightsReportContent from '@/components/report/sections/InsightsReportContent';
import ReportDebugTools from '@/components/report/ReportDebugTools';

interface InsightsReportContainerProps {
  reportData: any;
  showDebugData: boolean;
  toggleDebugData: () => void;
  showDiagnostics: boolean;
  toggleDiagnostics: () => void;
  refreshArchetypeData: () => Promise<void>;
}

const InsightsReportContainer: React.FC<InsightsReportContainerProps> = ({
  reportData,
  showDebugData,
  toggleDebugData,
  showDiagnostics,
  toggleDiagnostics,
  refreshArchetypeData
}) => {
  return (
    <div className="relative">
      <ReportDebugTools
        showDebugData={showDebugData}
        toggleDebugData={toggleDebugData}
        showDiagnostics={showDiagnostics}
        toggleDiagnostics={toggleDiagnostics}
        onRefreshData={refreshArchetypeData}
      />
      
      <ErrorBoundary>
        <div className="container mx-auto">
          <InsightsReportContent archetype={reportData} />
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default InsightsReportContainer;
