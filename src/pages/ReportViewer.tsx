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
  const [debugMode, setDebugMode] = useState(false); // Changed to false to hide debug by default
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Added to trigger data refresh
  
  // Normalize the archetype ID to handle case sensitivity
  const archetypeId = rawArchetypeId ? normalizeArchetypeId(rawArchetypeId) : undefined;
  
  // Debug logging for URL parameters
  useEffect(() => {
    console.log('[ReportViewer] URL parameters:', {
      rawArchetypeId,
      normalizedArchetypeId: archetypeId,
      token: token ? `${token.substring(0, 5)}...` : 'missing',
      dataSource: 'level4_report_secure', // Explicitly log the data source
      refreshTrigger
    });
  }, [archetypeId, rawArchetypeId, token, refreshTrigger]);
  
  // Simple helper for valid access
  const isAdminView = token === 'admin-view';
  const navigate = useNavigate();
  
  // Set up periodic refresh to keep session alive
  useEffect(() => {
    // Set up a refresh timer to keep tokens valid (every 5 minutes)
    const refreshTimer = setInterval(() => {
      console.log('[ReportViewer] Refreshing report data to maintain session');
      setRefreshTrigger(prev => prev + 1); // This will trigger a re-fetch
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(refreshTimer);
  }, []);
  
  // Validate archetypeId
  if (!archetypeId || !isValidArchetypeId(archetypeId)) {
    return (
      <ReportError
        title="Invalid Archetype ID"
        message="The requested archetype report could not be found."
        actionLabel="Return Home"
        onAction={() => navigate('/')}
        secondaryAction={() => window.location.reload()}
        secondaryActionLabel="Retry"
      />
    );
  }

  // Use the simplified user data hook for token validation
  const {
    userData,
    isLoading: userDataLoading,
    isValid: isValidAccess,
    error: userDataError,
    debugInfo: userDataDebugInfo,
    refreshData: refreshUserData
  } = useReportUserData(token, archetypeId, refreshTrigger);

  // Use report data hook to fetch EXCLUSIVELY from level4_report_secure
  const {
    reportData, 
    archetypeData, // Kept for compatibility
    averageData,
    isLoading: reportLoading,
    error: reportError,
    debugInfo: reportDebugInfo,
    refreshData: refreshReportData
  } = useReportAccess({
    archetypeId, 
    token: token || '',
    isAdminView,
    refreshTrigger
  });

  // Handle manual refresh
  const handleRefresh = () => {
    console.log('[ReportViewer] Manual refresh triggered');
    refreshUserData();
    refreshReportData();
    toast.info("Refreshing report data...");
  };

  // Data source verification logging
  useEffect(() => {
    // Log details about the data source and SWOT data
    console.log('[ReportViewer] Data source verification:', {
      source: 'level4_report_secure',
      hasReportData: !!reportData,
      hasSwotAnalysis: !!reportData?.swot_analysis,
      hasStrengths: !!reportData?.strengths,
      hasWeaknesses: !!reportData?.weaknesses,
      hasOpportunities: !!reportData?.opportunities,
      hasThreats: !!reportData?.threats,
      swotAnalysisType: reportData?.swot_analysis ? typeof reportData.swot_analysis : 'N/A',
      timestampRefresh: new Date().toISOString(),
      isValidAccess
    });
  }, [reportData, isValidAccess, refreshTrigger]);

  // Combined debug info
  const combinedDebugInfo = {
    ...userDataDebugInfo,
    ...reportDebugInfo,
    reportViewerState: {
      dataSource: 'level4_report_secure',
      userDataLoading,
      reportLoading,
      isValidAccess,
      hasUserData: !!userData,
      hasReportData: !!reportData,
      hasSwotData: !!(reportData?.swot_analysis || reportData?.strengths),
      timestamp: new Date().toISOString(),
      refreshTrigger
    }
  };

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
        message={`${reportError.message} (Data source: level4_report_secure)`}
        actionLabel="Retry"
        onAction={() => handleRefresh()}
        secondaryAction={() => navigate('/')}
        secondaryActionLabel="Return Home"
      />
    );
  }

  // Show missing data error
  if (!reportData) {
    return (
      <ReportError
        title="Report Not Found"
        message={`Could not find report data for archetype: ${archetypeId} in level4_report_secure table.`}
        actionLabel="Return Home"
        onAction={() => navigate('/')}
      />
    );
  }

  // Render the report using only data from level4_report_secure
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Add a refresh button that's visible but not intrusive */}
        <div className="fixed bottom-4 left-4 z-50 print:hidden">
          <button 
            onClick={handleRefresh}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg flex items-center justify-center"
            title="Refresh report data"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
        
        <DeepDiveReport
          reportData={reportData} // Using only the data from level4_report_secure
          userData={userData}
          averageData={averageData}
          isAdminView={isAdminView}
          debugInfo={combinedDebugInfo}
          isLoading={userDataLoading || reportLoading}
          error={reportError || userDataError}
        />
      </div>
    </ErrorBoundary>
  );
};

export default ReportViewer;
