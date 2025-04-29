
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isValidArchetypeId } from '@/utils/archetypeValidation';
import { useArchetypes } from '@/hooks/useArchetypes';
import { toast } from 'sonner';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import ReportDiagnosticTool from '@/components/report/ReportDiagnosticTool';
import { useReportAccess } from '@/hooks/useReportAccess';
import {
  ReportLoadingStateHandler,
  DiagnosticsStateHandler,
  ValidationErrorStateHandler,
  ConnectionErrorStateHandler,
  AccessErrorStateHandler,
  DebugStateHandler,
  NoDataErrorStateHandler
} from '@/components/report/states/ReportViewerStates';
import InsightsReportContainer from '@/components/report/containers/InsightsReportContainer';
import DeepDiveReportContainer from '@/components/report/containers/DeepDiveReportContainer';

const ReportViewer = () => {
  // Custom hook for data and access management
  const {
    archetypeId,
    token,
    isInsightsReport,
    isAdminView,
    initialLoading,
    skipCache,
    setSkipCache,
    isRetrying,
    setIsRetrying,
    
    // Data and states
    archetypeData,
    archetypeLoading,
    archetypeError,
    dataSource,
    reportData,
    averageData,
    reportLoading,
    reportError,
    userData,
    userDataLoading,
    isValidAccess,
    userDataError,
    
    // Actions
    handleRetry,
    refreshArchetypeData,
    refreshReportData
  } = useReportAccess();

  // Local state for debug/diagnostic UI toggles
  const [showDebugData, setShowDebugData] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  
  const navigate = useNavigate();
  const { getArchetypeDetailedById } = useArchetypes();
  
  // Handle API errors even if we continue
  if (archetypeError && !archetypeError.message?.includes('timeout')) {
    console.error('[ReportViewer] Error loading archetype data:', archetypeError);
    toast.error(`Error loading data: ${archetypeError.message}`, { 
      id: 'archetype-load-error',
      duration: 5000
    });
  }
  
  // Get local data as fallback
  const localArchetypeData = getArchetypeDetailedById(archetypeId);
  
  // Toggle functions for debug UI
  const toggleDebugData = () => setShowDebugData(!showDebugData);
  const toggleDiagnostics = () => setShowDiagnostics(!showDiagnostics);
  
  // Function to refresh data
  const handleRefreshData = async () => {
    setSkipCache(true);
    try {
      await refreshArchetypeData();
      toast.success("Data refreshed successfully");
    } catch (err) {
      toast.error("Failed to refresh data");
    } finally {
      setSkipCache(false);
    }
  };

  // Function to refresh report data
  const handleRefreshReportData = () => {
    refreshReportData();
    toast.success("Refreshing report data...");
  };
  
  // Special state handlers - these components will return null if their condition isn't met
  
  // 1. Loading state
  const loadingState = (
    <ReportLoadingStateHandler
      initialLoading={initialLoading}
      archetypeLoading={archetypeLoading}
      reportLoading={reportLoading}
      userDataLoading={userDataLoading}
    />
  );
  if (loadingState) return loadingState;
  
  // 2. Diagnostics view
  const diagnosticsState = (
    <DiagnosticsStateHandler
      showDiagnostics={showDiagnostics}
      toggleDiagnostics={toggleDiagnostics}
    />
  );
  if (diagnosticsState) return diagnosticsState;
  
  // 3. Validation error
  const validationErrorState = (
    <ValidationErrorStateHandler
      isValidArchetype={isValidArchetypeId(archetypeId)}
    />
  );
  if (validationErrorState) return validationErrorState;
  
  // 4. Connection error
  const connectionErrorState = (
    <ConnectionErrorStateHandler
      archetypeError={archetypeError}
      onRetry={handleRetry}
      isRetrying={isRetrying}
    />
  );
  if (connectionErrorState) return connectionErrorState;
  
  // 5. Access error
  const accessErrorState = (
    <AccessErrorStateHandler
      isInsightsReport={isInsightsReport}
      token={token}
      isAdminView={isAdminView}
      isValidAccess={isValidAccess}
      userDataError={userDataError}
    />
  );
  if (accessErrorState) return accessErrorState;
  
  // 6. Debug state
  const debugState = (
    <DebugStateHandler
      showDebugData={showDebugData}
      toggleDebugData={toggleDebugData}
      isInsightsReport={isInsightsReport}
    />
  );
  if (debugState) return debugState;
  
  // 7. No data error
  const noDataErrorState = (
    <NoDataErrorStateHandler
      localArchetypeData={localArchetypeData}
      archetypeApiData={archetypeData}
      reportData={reportData}
      archetypeId={archetypeId}
    />
  );
  if (noDataErrorState) return noDataErrorState;

  // Report data will use real database data or fallback to local data
  const finalReportData = reportData || archetypeData || localArchetypeData;
  const finalUserData = userData || {
    name: 'Admin Viewer',
    organization: 'Admin Organization',
    created_at: new Date().toISOString(),
    email: 'admin@example.com'
  };
  const finalAverageData = averageData || {
    archetype_id: 'All_Average',
    archetype_name: 'Population Average',
    "Demo_Average Age": 40,
    "Demo_Average Family Size": 3.0,
    "Risk_Average Risk Score": 1.0,
    "Cost_Medical & RX Paid Amount PMPY": 5000
  };
  
  console.log('[ReportViewer] Rendering report with data:', {
    reportType: isInsightsReport ? 'Insights' : 'DeepDive',
    archetypeName: finalReportData.name || finalReportData.archetype_name,
    isAdminView
  });
  
  // Render the appropriate report type based on the URL and data
  if (isInsightsReport) {
    return (
      <ErrorBoundary>
        <InsightsReportContainer
          reportData={finalReportData}
          showDebugData={showDebugData}
          toggleDebugData={toggleDebugData}
          showDiagnostics={showDiagnostics}
          toggleDiagnostics={toggleDiagnostics}
          refreshArchetypeData={handleRefreshData}
        />
      </ErrorBoundary>
    );
  } else {
    return (
      <ErrorBoundary>
        <DeepDiveReportContainer
          reportData={finalReportData}
          userData={finalUserData}
          averageData={finalAverageData}
          isAdminView={isAdminView}
          showDebugData={showDebugData}
          toggleDebugData={toggleDebugData}
          showDiagnostics={showDiagnostics}
          toggleDiagnostics={toggleDiagnostics}
          refreshData={isAdminView ? handleRefreshData : handleRefreshReportData}
        />
      </ErrorBoundary>
    );
  }
};

export default ReportViewer;
