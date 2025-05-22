
import React, { useEffect } from 'react';
import { ArchetypeDetailedData } from '@/types/archetype';
import ReportContainer from './components/ReportContainer';
import DeepDiveReportContent from './DeepDiveReportContent';
import { ReportUserData } from '@/hooks/useReportUserData';
import BetaBadge from '@/components/shared/BetaBadge';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { processReportData } from '@/utils/reports/reportDataTransforms';

export interface DeepDiveReportProps {
  reportData: ArchetypeDetailedData;
  userData: ReportUserData | null;
  averageData?: any;
  isAdminView?: boolean;
  debugInfo?: any;
  isLoading?: boolean;
  error?: Error | null;
  onRefresh?: () => void;
}

const DeepDiveReport: React.FC<DeepDiveReportProps> = ({
  reportData,
  userData,
  averageData,
  isAdminView = false,
  debugInfo,
  isLoading = false,
  error = null,
  onRefresh
}) => {
  // Debug logging to track component rendering and data
  useEffect(() => {
    console.log('[DeepDiveReport] Rendering with data:', { 
      hasReportData: !!reportData, 
      hasUserData: !!userData,
      hasAverageData: !!averageData,
      isAdminView,
      reportName: reportData?.name || reportData?.archetype_name
    });
    
    if (reportData) {
      console.log('[DeepDiveReport] Cost data availability:', {
        "Cost_Avoidable ER Potential Savings PMPY": reportData["Cost_Avoidable ER Potential Savings PMPY"] !== undefined,
        "Cost_Specialty RX Allowed Amount PMPM": reportData["Cost_Specialty RX Allowed Amount PMPM"] !== undefined,
        "Cost_Medical & RX Paid Amount PMPY": reportData["Cost_Medical & RX Paid Amount PMPY"] !== undefined,
        costFieldsCount: Object.keys(reportData).filter(k => k.startsWith('Cost_')).length
      });
    }
  }, [reportData, userData, averageData, isAdminView]);

  // Enhance reportData with fallback values if needed
  useEffect(() => {
    if (reportData && !reportData["Cost_Avoidable ER Potential Savings PMPY"]) {
      console.warn('[DeepDiveReport] Missing critical field in reportData: Cost_Avoidable ER Potential Savings PMPY');
    }
  }, [reportData]);
  
  // Check data presence and structure
  useEffect(() => {
    console.log('[DeepDiveReport] Component mounted, checking data structure', {
      reportDataType: typeof reportData,
      reportDataStructure: reportData ? Object.keys(reportData) : 'No data',
      userDataPresent: !!userData,
      averageDataPresent: !!averageData,
      averageDataStructure: averageData ? Object.keys(averageData).filter(k => k.startsWith('Cost_')).slice(0, 5) : 'No data',
      betaBadgeModule: typeof BetaBadge
    });
  }, [reportData, userData, averageData]);

  if (!reportData) {
    console.warn('[DeepDiveReport] No report data available');
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>No report data available</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Beta badge with improved visibility - fixed position with high z-index */}
      <div className="fixed bottom-6 right-6 z-[9999] shadow-lg print:hidden">
        <BetaBadge sticky={true} />
      </div>
      
      <ErrorBoundary>
        <ReportContainer 
          reportData={reportData}
          userData={userData}
          averageData={averageData}
          isAdminView={isAdminView}
          debugInfo={debugInfo}
          onNavigate={undefined}
          hideNavbar={false} // Set to false to ensure the left navigation is visible
        >
          <DeepDiveReportContent 
            archetype={reportData} 
            userData={userData} 
            averageData={averageData}
          />
        </ReportContainer>
      </ErrorBoundary>
    </div>
  );
};

export default DeepDiveReport;
