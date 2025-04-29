
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { isValidArchetypeId } from '@/utils/archetypeValidation';
import { toast } from 'sonner';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import { useReportUserData } from '@/hooks/useReportUserData';
import { useReportAccess } from '@/hooks/useReportAccess';
import DeepDiveReport from '@/components/report/DeepDiveReport';
import { Card } from '@/components/ui/card';

// This is a simplified version of ReportViewer focused on token-based access
const ReportViewer = () => {
  const { archetypeId, token } = useParams();
  const [debugMode, setDebugMode] = useState(true);
  
  // Debug logging for URL parameters
  useEffect(() => {
    console.log('[ReportViewer] URL parameters:', {
      archetypeId,
      token: token ? `${token.substring(0, 5)}...` : 'missing',
    });
  }, [archetypeId, token]);
  
  // Simple helper for valid access
  const isAdminView = token === 'admin-view';
  const navigate = useNavigate();
  
  // Validate archetypeId
  if (!archetypeId || !isValidArchetypeId(archetypeId)) {
    return (
      <Card className="p-6 m-4">
        <h2 className="text-xl font-semibold text-red-600">Invalid Archetype ID</h2>
        <p className="text-gray-600 mt-2">The requested archetype report could not be found.</p>
        <pre className="mt-4 text-xs bg-gray-100 p-2 rounded overflow-auto">
          URL parameters: archetypeId={archetypeId}, token={token?.substring(0, 5) + '...'}
        </pre>
      </Card>
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
    return (
      <Card className="p-6 m-4">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading report with token access...</p>
          {debugMode && (
            <div className="mt-4 text-xs bg-gray-50 p-3 rounded w-full">
              <p>Parameters: archetypeId={archetypeId}, token={token?.substring(0, 5)}...</p>
              <p>User data loading: {userDataLoading ? 'Yes' : 'No'}</p>
              <p>Report data loading: {reportLoading ? 'Yes' : 'No'}</p>
            </div>
          )}
        </div>
      </Card>
    );
  }

  // Show access error
  if (!isAdminView && token && !isValidAccess) {
    return (
      <Card className="p-6 m-4">
        <h2 className="text-xl font-semibold text-red-600">Access Error</h2>
        <p className="text-gray-600 mt-2">
          {userDataError?.message || 'Invalid or expired access token.'}
        </p>
        {debugMode && userDataDebugInfo && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-1">Debug Information</h3>
            <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto max-h-80">
              {JSON.stringify(userDataDebugInfo, null, 2)}
            </pre>
          </div>
        )}
      </Card>
    );
  }

  // Show data fetch error
  if (reportError) {
    return (
      <Card className="p-6 m-4">
        <h2 className="text-xl font-semibold text-red-600">Error Loading Report</h2>
        <p className="text-gray-600 mt-2">{reportError.message}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </Card>
    );
  }

  // Show missing data error
  if (!reportData && !archetypeData) {
    return (
      <Card className="p-6 m-4">
        <h2 className="text-xl font-semibold text-yellow-600">Report Not Found</h2>
        <p className="text-gray-600 mt-2">
          Could not find report data for archetype: {archetypeId}
        </p>
        {debugMode && (
          <div className="mt-4 text-xs bg-gray-50 p-3 rounded">
            <p>Access type: {isAdminView ? 'Admin view' : 'Token access'}</p>
            <p>Token: {token?.substring(0, 5)}...</p>
            <p>Valid access: {isValidAccess ? 'Yes' : 'No'}</p>
          </div>
        )}
      </Card>
    );
  }

  // Use report data prioritizing more specific data sources
  const finalReportData = reportData || archetypeData;

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
