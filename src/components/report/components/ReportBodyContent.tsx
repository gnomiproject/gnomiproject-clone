
import React from 'react';
import ReportSections from '../sections/ReportSections';
import ReportDebugTools from '../ReportDebugTools';
import { DiagnosticsPage } from '@/pages/DiagnosticsPage';
import { ReportDebugInfo } from './ReportDebugInfo';

interface ReportBodyContentProps {
  reportData: any;
  userData?: any;
  averageData?: any;
  isAdminView?: boolean;
  debugInfo?: any;
  showDebugData: boolean;
  showDiagnostics: boolean;
  setShowDebugData: (show: boolean) => void;
  setShowDiagnostics: (show: boolean) => void;
  handleRefreshData: () => void;
  isDebugMode: boolean;
  hideDebugTools?: boolean;
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
  isDebugMode,
  hideDebugTools = false
}) => {
  // Toggle functions
  const toggleDebugData = () => setShowDebugData(!showDebugData);
  const toggleDiagnostics = () => setShowDiagnostics(!showDiagnostics);

  return (
    <>
      {/* Debug Tools - only show if not hidden */}
      {!hideDebugTools && (
        <ReportDebugTools
          showDebugData={showDebugData}
          toggleDebugData={toggleDebugData}
          showDiagnostics={showDiagnostics}
          toggleDiagnostics={toggleDiagnostics}
          onRefreshData={handleRefreshData}
          isAdminView={isAdminView}
          debugInfo={debugInfo}
        />
      )}

      {/* Conditional rendering based on current state */}
      {showDiagnostics ? (
        <DiagnosticsPage />
      ) : showDebugData ? (
        <ReportDebugInfo 
          reportData={reportData} 
          userData={userData} 
          averageData={averageData}
          debugInfo={debugInfo}
        />
      ) : (
        <ReportSections
          reportData={reportData}
          userData={userData}
          averageData={averageData}
        />
      )}
    </>
  );
};

export default ReportBodyContent;
