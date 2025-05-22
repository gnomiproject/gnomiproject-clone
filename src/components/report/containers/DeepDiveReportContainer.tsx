
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
    
    // Log demographic data specifically to debug average calculations
    console.log('[DeepDiveReportContainer] Demographic averages:', {
      age: averageData ? averageData["Demo_Average Age"] : 'missing',
      familySize: averageData ? averageData["Demo_Average Family Size"] : 'missing',
      employees: averageData ? averageData["Demo_Average Employees"] : 'missing',
      members: averageData ? averageData["Demo_Average Members"] : 'missing',
      percentFemale: averageData ? averageData["Demo_Average Percent Female"] : 'missing',
      salary: averageData ? averageData["Demo_Average Salary"] : 'missing',
      states: averageData ? averageData["Demo_Average States"] : 'missing',
    });
    
    // Check for key demographic fields in report data
    if (reportData) {
      console.log('[DeepDiveReportContainer] Report demographic data:', {
        age: reportData["Demo_Average Age"],
        familySize: reportData["Demo_Average Family Size"],
        employees: reportData["Demo_Average Employees"],
        percentFemale: reportData["Demo_Average Percent Female"]
      });
    }
  }, [reportData, userData, averageData, isAdminView]);

  // Create safety checks for required data
  const hasRequiredData = reportData && 
    (reportData["Cost_Avoidable ER Potential Savings PMPY"] !== undefined ||
     reportData["Cost_Specialty RX Allowed Amount PMPM"] !== undefined);
  
  // Check for valid average data
  const hasValidAverageData = averageData && 
    averageData["Demo_Average Age"] > 0 &&
    averageData["Demo_Average Family Size"] > 0 &&
    averageData["Demo_Average Employees"] > 0;
  
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
        <Alert className="mb-4 bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-800" />
          <AlertDescription className="text-yellow-800">
            Some cost data may be missing or incomplete. The report will display available data.
          </AlertDescription>
        </Alert>
      )}
      
      {!hasValidAverageData && reportData && (
        <Alert className="mb-4 bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-800" />
          <AlertDescription className="text-blue-800">
            Some average data may be missing or incorrect. Comparisons may not be accurate.
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
