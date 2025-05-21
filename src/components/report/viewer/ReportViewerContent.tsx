import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { isValidArchetypeId } from '@/utils/archetypeValidation';
import { useArchetypeDetails } from '@/hooks/archetype/useArchetypeDetails';
import { useReportData } from '@/hooks/report/useReportData';
import { useUserData } from '@/hooks/user/useUserData';
import { ReportLoadingStateHandler, DiagnosticsStateHandler, ValidationErrorStateHandler, ConnectionErrorStateHandler, AccessErrorStateHandler, DebugStateHandler, NoDataErrorStateHandler } from '@/components/report/states/ReportViewerStates';
import ErrorHandler from '@/components/report/viewer/ErrorHandler';
import ReportViewer from '@/components/report/viewer/ReportViewer';
import { useToast } from "@/components/ui/use-toast"
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useLocalStorage } from 'usehooks-ts';

interface ReportViewerContentProps {
  isInsightsReport?: boolean;
  isAdminView?: boolean;
}

const ReportViewerContent: React.FC<ReportViewerContentProps> = ({ isInsightsReport = false, isAdminView = false }) => {
  const { toast } = useToast();
  const { archetypeId: rawArchetypeId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get('token');
  const archetypeId = rawArchetypeId || '';
  const isValidArchetype = isValidArchetypeId(archetypeId);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [showDebugData, setShowDebugData] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isUsingFallbackData, setIsUsingFallbackData] = useState(false);
  const [localArchetypeData, setLocalArchetypeData] = useLocalStorage(`archetypeData-${archetypeId}`, null);
  const [hasRequestedToken, setHasRequestedToken] = useState(false);
  const [isValidAccess, setIsValidAccess] = useState(true);

  // Data fetching hooks
  const { data: archetypeApiData, isLoading: archetypeLoading, error: archetypeError, refetch: refreshArchetypeData } = useArchetypeDetails(archetypeId);
  const { data: reportData, isLoading: reportLoading, error: reportError, refetch: refreshReportData } = useReportData(archetypeId, token, isUsingFallbackData);
  const { data: userData, isLoading: userDataLoading, error: userDataError } = useUserData(token, isInsightsReport);

  // Loading states
  const initialLoading = !archetypeId;

  // Toggle functions
  const toggleDiagnostics = () => setShowDiagnostics(prev => !prev);
  const toggleDebugData = () => setShowDebugData(prev => !prev);

  // Function to request a new token
  const onRequestNewToken = () => {
    // Implement your logic to request a new token here
    // This might involve calling an API or showing a modal
    setHasRequestedToken(true);
    toast({
      title: "Requesting New Token",
      description: "Please wait, we are requesting a new access token.",
    });
  };

  // Retry function
  const onRetry = useCallback(() => {
    setIsRetrying(true);
    Promise.all([
      refreshArchetypeData(),
      refreshReportData()
    ])
    .then(() => {
      setIsRetrying(false);
      toast({
        title: "Data Refreshed",
        description: "Report data has been successfully refreshed.",
      });
    })
    .catch(err => {
      setIsRetrying(false);
      toast({
        variant: "destructive",
        title: "Refresh Failed",
        description: `Failed to refresh data: ${err.message}`,
      });
    });
  }, [refreshArchetypeData, refreshReportData, toast]);

  // useEffect to handle fallback data
  useEffect(() => {
    if (!archetypeApiData && localArchetypeData) {
      setIsUsingFallbackData(true);
    } else {
      setIsUsingFallbackData(false);
    }
  }, [archetypeApiData, localArchetypeData]);

  // useEffect to validate access
  useEffect(() => {
    if (userDataError) {
      setIsValidAccess(false);
    } else {
      setIsValidAccess(true);
    }
  }, [userData, userDataError]);

  return (
    <>
      {/* Global Loading State */}
      <ReportLoadingStateHandler
        initialLoading={initialLoading}
        archetypeLoading={archetypeLoading}
        reportLoading={reportLoading}
        userDataLoading={userDataLoading}
      />

      {/* Diagnostics Mode */}
      <DiagnosticsStateHandler
        showDiagnostics={showDiagnostics}
        toggleDiagnostics={toggleDiagnostics}
      />

      {/* Invalid Archetype ID */}
      <ValidationErrorStateHandler
        isValidArchetype={isValidArchetype}
      />

      {/* Connection Error Handler */}
      <ConnectionErrorStateHandler
        archetypeError={archetypeError}
        onRetry={onRetry}
        isRetrying={isRetrying}
        archetypeId={archetypeId}
      />

      {/* Access Error Handler */}
      <AccessErrorStateHandler
        isInsightsReport={isInsightsReport}
        token={token}
        isAdminView={isAdminView}
        isValidAccess={isValidAccess}
        userDataError={userDataError}
      />

      {/* Debug Mode */}
      <DebugStateHandler
        showDebugData={showDebugData}
        toggleDebugData={toggleDebugData}
        isInsightsReport={isInsightsReport}
      />

      {/* No Data Error Handler */}
      <NoDataErrorStateHandler
        localArchetypeData={localArchetypeData}
        archetypeApiData={archetypeApiData}
        reportData={reportData}
        archetypeId={archetypeId}
      />

      {/* Error Boundary for handling specific error scenarios */}
      <ErrorHandler
        archetypeId={archetypeId}
        rawArchetypeId={rawArchetypeId}
        isValidArchetype={isValidArchetype}
        isValidAccess={isValidAccess}
        isAdminView={isAdminView}
        token={token}
        userDataError={userDataError}
        reportError={reportError}
        reportData={reportData}
        isUsingFallbackData={isUsingFallbackData}
        onRetry={onRetry}
        onRequestNewToken={onRequestNewToken}
      />

      {/* Report Viewer */}
      {(!initialLoading && isValidArchetype && isValidAccess && !archetypeError && !reportError && reportData) && (
        <ReportViewer
          archetypeId={archetypeId}
          reportData={reportData}
          showDiagnostics={showDiagnostics}
          toggleDiagnostics={toggleDiagnostics}
          showDebugData={showDebugData}
          toggleDebugData={toggleDebugData}
          isInsightsReport={isInsightsReport}
          isAdminView={isAdminView}
        />
      )}
    </>
  );
};

export default ReportViewerContent;
