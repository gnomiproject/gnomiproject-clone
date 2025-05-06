
import React from 'react';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import ReportContainer from '@/components/report/components/ReportContainer';
import DeepDiveReport from '@/components/report/DeepDiveReport';
import FixedHeader from '@/components/layout/FixedHeader';

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
  hideNavbar?: boolean;
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
  hideNavbar = false
}) => {
  // Add debug logging to track what's being rendered
  console.log('[ReportViewerContent] Rendering with:', {
    hasReportData: !!reportData,
    hasUserData: !!userData,
    hideNavbar,
    tokenStatus
  });
  
  return (
    <ErrorBoundary onError={onError} name="Report Viewer Content">
      {/* Always show FixedHeader, but hide nav links if hideNavbar is true */}
      <FixedHeader hideNavLinks={hideNavbar} />
      
      {/* Add padding to the top to account for the fixed header */}
      <div className="pt-16">
        <DeepDiveReport
          reportData={reportData}
          userData={userData}
          averageData={averageData}
          isAdminView={isAdminView}
          debugInfo={combinedDebugInfo}
        />
      </div>
    </ErrorBoundary>
  );
};

export default ReportViewerContent;
