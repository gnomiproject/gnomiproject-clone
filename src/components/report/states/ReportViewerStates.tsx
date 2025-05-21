
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReportLoadingState from '@/components/report/ReportLoadingState';
import ReportError from '@/components/report/ReportError';
import ReportDiagnosticTool from '@/components/report/ReportDiagnosticTool';
import ReportUserDataTest from '@/components/report/ReportUserDataTest';
import ArchetypeError from '@/components/insights/ArchetypeError';

interface LoadingStateProps {
  initialLoading: boolean;
  archetypeLoading: boolean;
  reportLoading: boolean;
  userDataLoading: boolean;
}

export const ReportLoadingStateHandler: React.FC<LoadingStateProps> = ({
  initialLoading,
  archetypeLoading,
  reportLoading,
  userDataLoading
}) => {
  if (initialLoading || archetypeLoading || reportLoading || userDataLoading) {
    return <ReportLoadingState />;
  }
  return null;
};

interface DiagnosticsStateProps {
  showDiagnostics: boolean;
  toggleDiagnostics: () => void;
}

export const DiagnosticsStateHandler: React.FC<DiagnosticsStateProps> = ({
  showDiagnostics,
  toggleDiagnostics
}) => {
  if (showDiagnostics) {
    return (
      <>
        <div className="fixed right-6 top-24 z-50 flex gap-2 print:hidden">
          <button 
            className="bg-white shadow-md hover:bg-gray-100 px-4 py-2 rounded text-sm font-medium flex items-center"
            onClick={toggleDiagnostics}
          >
            Back to Report
          </button>
        </div>
        <ReportDiagnosticTool />
      </>
    );
  }
  return null;
};

interface ValidationErrorStateProps {
  isValidArchetype: boolean;
}

export const ValidationErrorStateHandler: React.FC<ValidationErrorStateProps> = ({
  isValidArchetype
}) => {
  const navigate = useNavigate();
  
  if (!isValidArchetype) {
    return (
      <ReportError 
        title="Invalid Archetype ID"
        message="The requested archetype ID is not valid. Please check the URL or take the assessment again."
        actionLabel="Take Assessment"
        onAction={() => navigate('/assessment')}
      />
    );
  }
  return null;
};

interface ConnectionErrorStateProps {
  archetypeError: Error | null;
  onRetry: () => void;
  isRetrying: boolean;
  archetypeId: string; // Ensure we have this prop
}

export const ConnectionErrorStateHandler: React.FC<ConnectionErrorStateProps> = ({
  archetypeError,
  onRetry,
  isRetrying,
  archetypeId
}) => {
  const navigate = useNavigate();
  
  if (archetypeError && archetypeError.message?.includes('timeout')) {
    return (
      <ArchetypeError 
        onRetry={onRetry}
        onRetakeAssessment={() => navigate('/assessment')}
        isRetrying={isRetrying}
        archetypeId={archetypeId}
      />
    );
  }
  return null;
};

interface AccessErrorStateProps {
  isInsightsReport: boolean;
  token: string | undefined;
  isAdminView: boolean;
  isValidAccess: boolean;
  userDataError: Error | null;
}

export const AccessErrorStateHandler: React.FC<AccessErrorStateProps> = ({
  isInsightsReport,
  token,
  isAdminView,
  isValidAccess,
  userDataError
}) => {
  const navigate = useNavigate();
  
  if (!isInsightsReport && token && !isAdminView && (!isValidAccess || userDataError)) {
    console.error('[ReportViewer] Access denied:', {
      isValidAccess,
      error: userDataError?.message
    });
    
    return (
      <ReportError 
        title="Access Denied"
        message={`Unable to access this report: ${userDataError?.message || 'Invalid or expired token'}`}
        actionLabel="Back to Home"
        onAction={() => navigate('/')}
      />
    );
  }
  return null;
};

interface DebugStateProps {
  showDebugData: boolean;
  toggleDebugData: () => void;
  isInsightsReport: boolean;
}

export const DebugStateHandler: React.FC<DebugStateProps> = ({
  showDebugData,
  toggleDebugData,
  isInsightsReport
}) => {
  if (showDebugData && !isInsightsReport) {
    return (
      <>
        <div className="fixed right-6 top-24 z-50 flex gap-2 print:hidden">
          <button 
            className="bg-white shadow-md hover:bg-gray-100 px-4 py-2 rounded text-sm font-medium flex items-center"
            onClick={toggleDebugData}
          >
            Hide Debug
          </button>
        </div>
        <ReportUserDataTest />
      </>
    );
  }
  return null;
};

interface NoDataErrorStateProps {
  localArchetypeData: any;
  archetypeApiData: any;
  reportData: any;
  archetypeId: string;
}

export const NoDataErrorStateHandler: React.FC<NoDataErrorStateProps> = ({
  localArchetypeData,
  archetypeApiData,
  reportData,
  archetypeId
}) => {
  const navigate = useNavigate();
  
  if (!localArchetypeData && !archetypeApiData && !reportData) {
    console.error('[ReportViewer] No data available for archetype:', archetypeId);
    
    return (
      <ReportError 
        title="Report Not Available"
        message="We couldn't load the report data for this archetype. Please try again or take the assessment again."
        actionLabel="Take Assessment"
        onAction={() => navigate('/assessment')}
      />
    );
  }
  return null;
};
