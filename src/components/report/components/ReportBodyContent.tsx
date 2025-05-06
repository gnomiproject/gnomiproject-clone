
import React, { Suspense, lazy } from 'react';

// Lazy load ReportBody to improve initial load time
const LazyReportBody = lazy(() => import('./ReportBody'));

// Loading placeholder
const LoadingFallback = () => (
  <div className="p-12 flex flex-col items-center justify-center space-y-4">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    <p className="text-gray-600">Loading report content...</p>
  </div>
);

interface ReportBodyContentProps {
  reportData: any;
  userData?: any;
  averageData?: any;
  isAdminView?: boolean;
  debugInfo?: any;
  showDebugData: boolean;
  showDiagnostics: boolean;
  setShowDebugData: (value: boolean) => void;
  setShowDiagnostics: (value: boolean) => void;
  handleRefreshData: () => void;
  isDebugMode: boolean;
}

const ReportBodyContent: React.FC<ReportBodyContentProps> = ({
  reportData,
  userData,
  averageData,
  isAdminView,
  debugInfo,
  showDebugData,
  showDiagnostics,
  setShowDebugData,
  setShowDiagnostics,
  handleRefreshData,
  isDebugMode
}) => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LazyReportBody
        reportData={reportData}
        userData={userData}
        averageData={averageData}
        isAdminView={isAdminView}
        debugInfo={debugInfo}
        showDebugData={showDebugData}
        showDiagnostics={showDiagnostics}
        setShowDebugData={setShowDebugData}
        setShowDiagnostics={setShowDiagnostics}
        handleRefreshData={handleRefreshData}
        isDebugMode={isDebugMode}
      />
    </Suspense>
  );
};

export default ReportBodyContent;
