
import React, { useCallback } from 'react';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import FallbackBanner from '@/components/report/FallbackBanner';
import DeepDiveReport from '@/components/report/DeepDiveReport';
import TokenStatusBanner from './TokenStatusBanner';
import DebugButton from './DebugButton';

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
  onRequestNewToken
}) => {
  // Determine if debug mode is active
  const isDebugMode = isAdminView || window.location.search.includes('debug=true');

  return (
    <ErrorBoundary onError={onError} name="Report Viewer">
      <div className="min-h-screen bg-gray-50">
        {/* Token status banners */}
        <TokenStatusBanner 
          tokenStatus={tokenStatus} 
          onRequestNewToken={onRequestNewToken}
          isUsingFallbackData={isUsingFallbackData}
        />
        
        {/* Fallback data banner */}
        <FallbackBanner 
          show={isUsingFallbackData} 
          message="This report is showing previously cached data because the latest data could not be retrieved."
        />
        
        <DeepDiveReport
          reportData={reportData}
          userData={userData}
          averageData={averageData}
          isAdminView={isAdminView}
          debugInfo={combinedDebugInfo}
          isLoading={userDataLoading || reportLoading}
          error={reportError || userDataError}
        />
      </div>
      
      {/* Debug button */}
      <DebugButton
        isVisible={isDebugMode}
        sessionStartTime={sessionStartTime}
        tokenStatus={tokenStatus}
        lastStatusCheck={lastStatusCheck}
        userData={userData}
        isUsingFallbackData={isUsingFallbackData}
        reportData={reportData}
        debugInfo={combinedDebugInfo}
      />
    </ErrorBoundary>
  );
};

export default ReportViewerContent;
