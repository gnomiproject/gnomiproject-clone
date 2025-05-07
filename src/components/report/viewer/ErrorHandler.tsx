
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { isValidArchetypeId } from '@/utils/archetypeValidation';
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

  // Check if the archetype ID is invalid
  if (!isValidArchetype) {
    return (
      <ReportError
        title="Invalid Report ID"
        description={`The report ID "${rawArchetypeId}" is not valid.`}
        action={() => navigate('/insights')}
        actionText="Go to Insights"
      />
    );
  }

  // For non-admin views, check if access is valid and we don't have fallback data
  if (!isAdminView && !isValidAccess && !reportData && !isUsingFallbackData) {
    return (
      <ReportError
        title="Access Denied"
        description={
          token
            ? "Your access token is invalid or has expired."
            : "No access token was provided. You need a valid token to view this report."
        }
        action={onRequestNewToken}
        actionText="Request Access"
        secondaryAction={onRetry}
        secondaryActionText="Try Again"
      />
    );
  }

  // Check for report error when no fallback data is available
  if (!reportData && reportError && !isUsingFallbackData) {
    return (
      <ReportError
        title="Error Loading Report"
        description={reportError.message || "An unexpected error occurred."}
        action={onRetry}
        actionText="Try Again"
      />
    );
  }

  // Default case - no error or error with fallback data (handled elsewhere)
  return null;
};

export default ErrorHandler;
