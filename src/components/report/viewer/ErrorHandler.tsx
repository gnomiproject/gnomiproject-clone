
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReportError from '@/components/report/ReportError';

interface ErrorHandlerProps {
  archetypeId: string | undefined;
  rawArchetypeId: string | undefined;
  isValidArchetype: boolean;
  isValidAccess: boolean;
  isAdminView: boolean;
  token: string | undefined;
  userDataError: Error | null;
  reportError: Error | null;
  reportData: any;
  isUsingFallbackData: boolean;
  onRetry: () => void;
  onRequestNewToken: () => void;
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
  onRequestNewToken
}) => {
  const navigate = useNavigate();

  // Invalid archetype ID error
  if (!isValidArchetype) {
    return (
      <ReportError
        title="Invalid Archetype ID"
        message={`The requested archetype report (${rawArchetypeId}) could not be found.`}
        actionLabel="Return Home"
        onAction={() => navigate('/')}
        secondaryAction={() => window.location.reload()}
        secondaryActionLabel="Retry"
      />
    );
  }

  // Access error - but only if we're not using fallback data
  if (!isAdminView && token && !isValidAccess && !isUsingFallbackData) {
    console.error('[ReportViewer] Access error:', {
      token: token ? `${token.substring(0, 5)}...` : 'missing',
      error: userDataError?.message || 'Unknown validation error'
    });
    
    return (
      <ReportError
        title="Access Error"
        message={userDataError?.message || 'Invalid or expired access token.'}
        actionLabel="Return Home"
        onAction={() => navigate('/')}
        secondaryAction={onRequestNewToken}
        secondaryActionLabel="Request New Access Token"
      />
    );
  }

  // Data fetch error
  if (reportError && !isUsingFallbackData) {
    console.error('[ReportViewer] Data error:', reportError);
    
    return (
      <ReportError
        title="Error Loading Report"
        message={`${reportError.message} (Data source: level4_report_secure)`}
        actionLabel="Retry"
        onAction={onRetry}
        secondaryAction={() => navigate('/')}
        secondaryActionLabel="Return Home"
      />
    );
  }

  // Missing data error
  if (!reportData && !isUsingFallbackData) {
    console.error('[ReportViewer] No report data found for:', archetypeId);
    
    return (
      <ReportError
        title="Report Not Found"
        message={`Could not find report data for archetype: ${archetypeId} in level4_report_secure table.`}
        actionLabel="Return Home"
        onAction={() => navigate('/')}
      />
    );
  }

  // No errors to handle
  return null;
};

export default ErrorHandler;
