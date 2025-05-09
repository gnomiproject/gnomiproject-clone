
import React, { useEffect } from 'react';
import { ArchetypeDetailedData } from '@/types/archetype';
import ReportContainer from './components/ReportContainer';
import DeepDiveReportContent from './DeepDiveReportContent';
import { ReportUserData } from '@/hooks/useReportUserData';
import BetaBadge from '@/components/shared/BetaBadge';

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
  console.log('[DeepDiveReport] Rendering with data:', { 
    hasReportData: !!reportData, 
    hasUserData: !!userData,
    isAdminView,
    reportName: reportData?.name || reportData?.archetype_name
  });
  
  // Check data presence and structure
  useEffect(() => {
    console.log('[DeepDiveReport] Component mounted, checking data structure', {
      reportDataType: typeof reportData,
      reportDataStructure: reportData ? Object.keys(reportData) : 'No data',
      userDataPresent: !!userData,
      betaBadgeModule: typeof BetaBadge
    });
  }, [reportData, userData]);

  if (!reportData) {
    console.warn('[DeepDiveReport] No report data available');
    return (
      <div className="p-4">
        <h2>No report data available</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Beta badge with improved visibility - fixed position with high z-index */}
      <div className="fixed bottom-6 right-6 z-[9999] shadow-lg print:hidden">
        <BetaBadge sticky={true} />
      </div>
      
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
    </div>
  );
};

export default DeepDiveReport;
