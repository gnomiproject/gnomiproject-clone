
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReportError from '@/components/report/ReportError';
import ArchetypeError from '@/components/insights/ArchetypeError';

interface ErrorHandlerProps {
  archetypeId?: string;
  rawArchetypeId?: string;
  isValidArchetype: boolean;
  isValidAccess: boolean;
  isAdminView: boolean;
  token?: string | null;
  userDataError: Error | null;
  reportError: Error | null;
  reportData: any;
  isUsingFallbackData: boolean;
  onRetry: () => void;
  onRequestNewToken: () => void;
  tokenStatus?: 'valid' | 'checking' | 'warning' | 'error' | 'grace-period';
}

const ErrorHandler: React.FC<ErrorHandlerProps> = ({
  archetypeId,
  rawArchetypeId,
  isValidArchetype,
  isValidAccess,
  isAdminView,
  token,
  userDataError,
  reportError,
  reportData,
  isUsingFallbackData,
  onRetry,
  onRequestNewToken,
  tokenStatus
}) => {
  const navigate = useNavigate();

  // 1. Handle invalid archetype ID
  if (!isValidArchetype && rawArchetypeId) {
    return (
      <ReportError
        title="Invalid Archetype ID"
        message={`The requested archetype ID "${rawArchetypeId}" is not valid.`}
        actionLabel="Take Assessment"
        onAction={() => navigate('/assessment')}
      />
    );
  }

  // 2. Handle connection errors - if there's a reportError with timeout
  if (reportError && reportError.message?.includes('timeout') && !isUsingFallbackData) {
    return (
      <ArchetypeError
        archetypeId={archetypeId || ''}
        onRetry={onRetry}
        onRetakeAssessment={() => navigate('/assessment')}
        isRetrying={false}
      />
    );
  }

  // 3. Handle access token errors - only for non-admin and non-insights reports
  if (!isAdminView && token && !isValidAccess && userDataError && !isUsingFallbackData) {
    let errorTitle = "Access Denied";
    let errorMessage = "Invalid or expired token for this report.";
    
    if (tokenStatus === "error") {
      errorMessage = "Your access token has expired.";
    } else if (tokenStatus === "grace-period") {
      errorMessage = "Your access token is in the grace period. It will expire soon.";
    }
    
    if (userDataError.message) {
      errorMessage = `${errorMessage} Error: ${userDataError.message}`;
    }
    
    return (
      <ReportError
        title={errorTitle}
        message={errorMessage}
        actionLabel="Request New Token"
        onAction={onRequestNewToken}
        secondaryActionLabel="Back to Home"
        secondaryAction={() => navigate('/')}
      />
    );
  }

  // 4. No data found - means report doesn't exist
  if (!reportData && !isUsingFallbackData && archetypeId && !reportError?.message?.includes('timeout')) {
    return (
      <ReportError
        title="Report Not Found"
        message={`We couldn't find a report for archetype "${archetypeId}". The report may not exist or you may not have access to it.`}
        actionLabel="Take Assessment"
        onAction={() => navigate('/assessment')}
      />
    );
  }

  // No error detected - return null
  return null;
};

export default ErrorHandler;
