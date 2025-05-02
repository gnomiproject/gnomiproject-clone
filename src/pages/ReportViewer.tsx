
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
  
  // Normalize the archetype ID to handle case sensitivity
  const archetypeId = rawArchetypeId ? normalizeArchetypeId(rawArchetypeId) : undefined;
  
  // Debug logging for URL parameters
  useEffect(() => {
    console.log('[ReportViewer] URL parameters:', {
      rawArchetypeId,
      normalizedArchetypeId: archetypeId,
      token: token ? `${token.substring(0, 5)}...` : 'missing',
      dataSource: 'level4_report_secure' // Explicitly log the data source
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
    debugInfo: userDataDebugInfo
  } = useReportUserData(token, archetypeId);

  // Use report data hook to fetch EXCLUSIVELY from level4_report_secure
  const {
    reportData, 
    archetypeData, // Kept for compatibility
    averageData,
    isLoading: reportLoading,
    error: reportError,
    debugInfo: reportDebugInfo
  } = useReportAccess({
    archetypeId, 
    token: token || '',
    isAdminView
  });

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
      swotAnalysisType: reportData?.swot_analysis ? typeof reportData.swot_analysis : 'N/A'
    });
  }, [reportData]);

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
      timestamp: new Date().toISOString()
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
        onAction={() => window.location.reload()}
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
        {/* Debug toggle removed */}
        
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
