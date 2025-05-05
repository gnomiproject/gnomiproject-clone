
import React from 'react';
import { ArchetypeDetailedData } from '@/types/archetype';
import ReportContainer from './components/ReportContainer';
import DeepDiveReportContent from './sections/DeepDiveReportContent';
import { ReportUserData } from '@/hooks/useReportUserData';

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
  if (!reportData) {
    return (
      <div className="p-4">
        <h2>No report data available</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ReportContainer 
        reportData={reportData}
        userData={userData}
        averageData={averageData}
        isAdminView={isAdminView}
        debugInfo={debugInfo}
        onNavigate={undefined}
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
