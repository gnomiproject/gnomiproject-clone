
import React from 'react';
import ReportError from '@/components/report/ReportError';

interface ErrorHandlerProps {
  archetypeId?: string;
  rawArchetypeId?: string;
  isValidArchetype?: boolean;
  isValidAccess?: boolean;
  isAdminView?: boolean;
  token?: string;
  userDataError?: Error | null;
  reportError?: Error | null;
  reportData?: any;
  isUsingFallbackData?: boolean;
  onRetry?: () => void;
  onRequestNewToken?: () => void;
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
  // Case 1: Invalid archetype ID
  if (!isValidArchetype) {
    return (
      <ReportError
        title="Invalid Archetype"
        message={`"${rawArchetypeId}" is not a valid archetype identifier. Please check the URL and try again.`}
        actionLabel="Go to Home"
        onAction={() => window.location.href = '/'}
      />
    );
  }

  // Case 2: Invalid access token (not admin and token validation failed)
  if (!isAdminView && !isValidAccess && reportError?.message?.includes('token')) {
    return (
      <ReportError
        title="Invalid Access Token"
        message={`Your access token for "${archetypeId}" appears to be invalid or expired. Please request a new access token to view this report.`}
        actionLabel="Request New Token"
        onAction={onRequestNewToken || (() => window.location.href = '/')}
        secondaryAction={() => window.location.href = '/'}
        secondaryActionLabel="Return Home"
      />
    );
  }

  // Case 3: No report data found
  if (!reportData && reportError && !isUsingFallbackData) {
    return (
      <ReportError
        title="Report Not Found"
        message={`We couldn't find a report for "${archetypeId}". The report may not exist or there might be an issue accessing it.`}
        actionLabel="Try Again"
        onAction={onRetry || (() => window.location.reload())}
        secondaryAction={() => window.location.href = '/'}
        secondaryActionLabel="Return Home"
      />
    );
  }

  // Case 4: General error
  return (
    <ReportError
      title="Error Loading Report"
      message={reportError?.message || userDataError?.message || "An unexpected error occurred while loading the report."}
      actionLabel="Try Again"
      onAction={onRetry || (() => window.location.reload())}
      secondaryAction={() => window.location.href = '/'}
      secondaryActionLabel="Return Home"
    />
  );
};

export default ErrorHandler;
