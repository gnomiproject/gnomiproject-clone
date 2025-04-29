
import React from 'react';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import DeepDiveReport from '@/components/report/DeepDiveReport';
import ReportDebugTools from '@/components/report/ReportDebugTools';
import { ArchetypeDetailedData } from '@/types/archetype';

interface DeepDiveReportContainerProps {
  reportData: any;
  userData: any;
  averageData: any;
  isAdminView: boolean;
  showDebugData: boolean;
  toggleDebugData: () => void;
  showDiagnostics: boolean;
  toggleDiagnostics: () => void;
  refreshData: () => void;
}

const DeepDiveReportContainer: React.FC<DeepDiveReportContainerProps> = ({
  reportData,
  userData,
  averageData,
  isAdminView,
  showDebugData,
  toggleDebugData,
  showDiagnostics,
  toggleDiagnostics,
  refreshData
}) => {
  // Type conversion for the DeepDiveReport component
  const typedReportData = reportData as unknown as ArchetypeDetailedData;
  
  return (
    <div className="relative">
      <ReportDebugTools
        showDebugData={showDebugData}
        toggleDebugData={toggleDebugData}
        showDiagnostics={showDiagnostics}
        toggleDiagnostics={toggleDiagnostics}
        onRefreshData={refreshData}
        isAdminView={isAdminView}
      />
      
      <ErrorBoundary>
        <DeepDiveReport 
          reportData={typedReportData} 
          userData={userData} 
          averageData={averageData}
          isAdminView={isAdminView}
        />
      </ErrorBoundary>
    </div>
  );
};

export default DeepDiveReportContainer;
