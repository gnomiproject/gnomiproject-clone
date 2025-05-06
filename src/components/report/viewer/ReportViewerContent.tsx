
import React from 'react';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import ReportContainer from '@/components/report/components/ReportContainer';

interface ReportViewerContentProps {
  tokenStatus: 'valid' | 'checking' | 'warning' | 'error' | 'grace-period';
  isAdminView: boolean;
  reportData: any;
  userData: any;
  averageData: any;
  combinedDebugInfo: any;
  userDataLoading: boolean;
  reportLoading: boolean;
  reportError: Error | null;
  userDataError: Error | null;
  isUsingFallbackData: boolean;
  sessionStartTime: number;
  lastStatusCheck: number;
  onError: (error: Error, errorInfo: React.ErrorInfo) => void;
  onRequestNewToken: () => void;
  hideNavbar?: boolean; // Add this prop
}

const ReportViewerContent: React.FC<ReportViewerContentProps> = ({
  tokenStatus,
  isAdminView,
  reportData,
  userData,
  averageData,
  combinedDebugInfo,
  userDataLoading,
  reportLoading,
  reportError,
  userDataError,
  isUsingFallbackData,
  sessionStartTime,
  lastStatusCheck,
  onError,
  onRequestNewToken,
  hideNavbar = false // Default to false for backward compatibility
}) => {
  return (
    <ErrorBoundary onError={onError} name="Report Viewer Content">
      <ReportContainer
        reportData={reportData}
        userData={userData}
        averageData={averageData}
        isAdminView={isAdminView}
        debugInfo={combinedDebugInfo}
        hideNavbar={hideNavbar} // Pass the hideNavbar prop to ReportContainer
      />
    </ErrorBoundary>
  );
};

export default ReportViewerContent;
