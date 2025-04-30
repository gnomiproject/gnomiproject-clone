
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { isValidArchetypeId, normalizeArchetypeId } from '@/utils/archetypeValidation';
import { toast } from 'sonner';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import { useReportUserData } from '@/hooks/useReportUserData';
import { useReportAccess } from '@/hooks/useReportAccess';
import DeepDiveReport from '@/components/report/DeepDiveReport';
import { Card } from '@/components/ui/card';
import ReportLoadingState from '@/components/report/ReportLoadingState';
import ReportError from '@/components/report/ReportError';

// This is a simplified version of ReportViewer focused on token-based access
const ReportViewer = () => {
  const { archetypeId: rawArchetypeId, token } = useParams();
  const [debugMode, setDebugMode] = useState(true);
  
  // Normalize the archetype ID to handle case sensitivity
  const archetypeId = rawArchetypeId ? normalizeArchetypeId(rawArchetypeId) : undefined;
  
  // Debug logging for URL parameters
  useEffect(() => {
    console.log('[ReportViewer] URL parameters:', {
      rawArchetypeId,
      normalizedArchetypeId: archetypeId,
      token: token ? `${token.substring(0, 5)}...` : 'missing',
    });
  }, [archetypeId, rawArchetypeId, token]);
  
  // Simple helper for valid access
  const isAdminView = token === 'admin-view';
  const navigate = useNavigate();
  
  // Validate archetypeId
  if (!archetypeId || !isValidArchetypeId(archetypeId)) {
    return (
      <ReportError
        title="Invalid Archetype ID"
        message={`The requested archetype report (${rawArchetypeId}) could not be found.`}
        actionLabel="Return Home"
        onAction={() => navigate('/')}
      />
    );
  }

  // Use the simplified user data hook for token validation
  const {
    userData,
    isLoading: userDataLoading,
    isValid: isValidAccess,
    error: userDataError,
    debugInfo: userDataDebugInfo
  } = useReportUserData(token, archetypeId);

  // Use report data hook for archetype data (minimal version)
  const {
    reportData, 
    archetypeData,
    averageData,
    isLoading: reportLoading,
    error: reportError 
  } = useReportAccess({
    archetypeId, 
    token: token || '',
    isAdminView
  });

  // Show loading state
  if (userDataLoading || reportLoading) {
    return <ReportLoadingState />;
  }

  // Show access error
  if (!isAdminView && token && !isValidAccess) {
    return (
      <ReportError
        title="Access Error"
        message={userDataError?.message || 'Invalid or expired access token.'}
        actionLabel="Return Home"
        onAction={() => navigate('/')}
      />
    );
  }

  // Show data fetch error
  if (reportError) {
    return (
      <ReportError
        title="Error Loading Report"
        message={reportError.message}
        actionLabel="Retry Loading"
        onAction={() => window.location.reload()}
      />
    );
  }

  // Show missing data error
  if (!reportData && !archetypeData) {
    return (
      <ReportError
        title="Report Not Found" 
        message={`Could not find report data for archetype: ${archetypeId}`}
        actionLabel="Return Home"
        onAction={() => navigate('/')}
      />
    );
  }

  // Use report data prioritizing more specific data sources
  const finalReportData = reportData || archetypeData;
  
  // Do a final check to ensure we have valid data before rendering the report
  if (!finalReportData || Object.keys(finalReportData).length === 0) {
    return (
      <ReportError
        title="Invalid Report Data"
        message="The report data appears to be empty or invalid."
        actionLabel="Retry Loading"
        onAction={() => window.location.reload()}
      />
    );
  }

  // Render the simplified report
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Debug toggle */}
        {debugMode && (
          <div className="fixed bottom-4 right-4 z-50">
            <button
              onClick={() => setDebugMode(!debugMode)}
              className="bg-gray-800 text-white px-3 py-1 rounded text-xs shadow-lg"
            >
              {debugMode ? 'Hide Debug' : 'Show Debug'}
            </button>
          </div>
        )}
        
        <DeepDiveReport
          reportData={finalReportData}
          userData={userData}
          averageData={averageData}
          isAdminView={isAdminView}
          debugInfo={userDataDebugInfo}
        />
      </div>
    </ErrorBoundary>
  );
};

export default ReportViewer;
