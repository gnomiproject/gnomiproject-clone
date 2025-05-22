
import React, { useEffect } from 'react';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import DeepDiveReport from '@/components/report/DeepDiveReport';
import ReportDebugTools from '@/components/report/ReportDebugTools';
import { ArchetypeDetailedData } from '@/types/archetype';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

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
  // Log data state for debugging purposes
  useEffect(() => {
    console.log('[DeepDiveReportContainer] Received data:', {
      hasReportData: !!reportData,
      reportDataKeys: reportData ? Object.keys(reportData).filter(k => k.startsWith('Cost_')).slice(0, 5) : [],
      hasAverageData: !!averageData,
      averageDataKeys: averageData ? Object.keys(averageData).filter(k => k.startsWith('Cost_')).slice(0, 5) : [],
      hasUserData: !!userData,
      isAdminView
    });
  }, [reportData, userData, averageData, isAdminView]);

  // Create safety checks for required data
  const hasRequiredData = reportData && 
    (reportData["Cost_Avoidable ER Potential Savings PMPY"] !== undefined ||
     reportData["Cost_Specialty RX Allowed Amount PMPM"] !== undefined);
  
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
      
      {!hasRequiredData && reportData && (
        <Alert variant="warning" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Some cost data may be missing or incomplete. The report will display available data.
          </AlertDescription>
        </Alert>
      )}
      
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
