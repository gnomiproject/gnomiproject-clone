
import React from 'react';
import { ArchetypeDetailedData } from '@/types/archetype';
import ReportContainer from './components/ReportContainer';
import DeepDiveReportContent from './DeepDiveReportContent';
import { ReportUserData } from '@/hooks/useReportUserData';
import BetaBadge from '@/components/shared/BetaBadge';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

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
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>No report data available</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="fixed bottom-6 right-6 z-[9999] shadow-lg print:hidden">
        <BetaBadge sticky={true} />
      </div>
      
      <ErrorBoundary>
        <ReportContainer 
          reportData={reportData}
          userData={userData}
          averageData={averageData || {}}
          isAdminView={isAdminView}
          debugInfo={debugInfo}
          onNavigate={undefined}
          hideNavbar={false}
          hideDebugTools={true}
        >
          <DeepDiveReportContent 
            archetype={reportData} 
            userData={userData} 
            averageData={averageData || {}}
          />
        </ReportContainer>
      </ErrorBoundary>
    </div>
  );
};

export default DeepDiveReport;
