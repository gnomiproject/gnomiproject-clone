
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { isValidArchetypeId } from '@/utils/archetypeValidation';
import { useArchetypeDetails } from '@/hooks/archetype/useArchetypeDetails';
import { useReportAccess } from '@/hooks/useReportAccess';
import { useUserData } from '@/hooks/user/useUserData';
import { ReportLoadingStateHandler, DiagnosticsStateHandler, ValidationErrorStateHandler, ConnectionErrorStateHandler, AccessErrorStateHandler, DebugStateHandler, NoDataErrorStateHandler } from '@/components/report/states/ReportViewerStates';
import ErrorHandler from '@/components/report/viewer/ErrorHandler';
import ReportViewer from '@/components/report/viewer/ReportViewer';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useLocalStorage } from 'usehooks-ts';
import { ArchetypeId } from '@/types/archetype';

interface ReportViewerContentProps {
  isInsightsReport?: boolean;
  isAdminView?: boolean;
  tokenStatus?: 'valid' | 'checking' | 'warning' | 'error' | 'grace-period';
  reportData?: any;
  userData?: any;
  averageData?: any;
  combinedDebugInfo?: any;
  userDataLoading?: boolean;
  reportLoading?: boolean;
  reportError?: Error | null;
  userDataError?: Error | null;
  isUsingFallbackData?: boolean;
  sessionStartTime?: number;
  lastStatusCheck?: number;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  onRequestNewToken?: () => void;
  hideNavbar?: boolean;
}

const ReportViewerContent: React.FC<ReportViewerContentProps> = ({ 
  isInsightsReport = false, 
  isAdminView = false,
  tokenStatus,
  reportData: providedReportData,
  userData: providedUserData,
  averageData: providedAverageData,
  combinedDebugInfo,
  userDataLoading: providedUserDataLoading,
  reportLoading: providedReportLoading,
  reportError: providedReportError,
  userDataError: providedUserDataError,
  isUsingFallbackData: providedIsUsingFallbackData,
  onError,
  onRequestNewToken,
  hideNavbar
}) => {
  const { toast } = useToast();
  const { archetypeId: rawArchetypeId } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const archetypeId = rawArchetypeId || '';
  const isValidArchetype = isValidArchetypeId(archetypeId);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [showDebugData, setShowDebugData] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isUsingFallbackData, setIsUsingFallbackData] = useState(providedIsUsingFallbackData || false);
  const [localArchetypeData, setLocalArchetypeData] = useLocalStorage(`archetypeData-${archetypeId}`, null);
  const [hasRequestedToken, setHasRequestedToken] = useState(false);
  const [isValidAccess, setIsValidAccess] = useState(true);

  // Use provided data if available, otherwise fetch it
  const shouldFetchData = !providedReportData || !providedUserData;

  // Data fetching hooks - only used if data is not provided
  const { data: archetypeApiData, isLoading: archetypeLoading, error: archetypeError, refetch: refreshArchetypeData } = 
    useArchetypeDetails(archetypeId as ArchetypeId);
  
  const { reportData: fetchedReportData, isLoading: reportDataLoading, error: reportDataError, refreshData: refreshReportData } = 
    shouldFetchData ? useReportAccess({ archetypeId, token: token || '', isAdminView }) : { reportData: null, isLoading: false, error: null, refreshData: () => Promise.resolve() };
  
  const { data: fetchedUserData, isLoading: userDataFetchLoading, error: userDataFetchError } = 
    shouldFetchData ? useUserData(token) : { data: null, isLoading: false, error: null };

  // Use provided or fetched data
  const reportData = providedReportData || fetchedReportData;
  const userData = providedUserData || fetchedUserData;
  const reportLoading = providedReportLoading !== undefined ? providedReportLoading : reportDataLoading;
  const userDataLoading = providedUserDataLoading !== undefined ? providedUserDataLoading : userDataFetchLoading;
  const reportError = providedReportError || reportDataError;
  const userDataError = providedUserDataError || userDataFetchError;

  // Loading states
  const initialLoading = !archetypeId;

  // Toggle functions
  const toggleDiagnostics = () => setShowDiagnostics(prev => !prev);
  const toggleDebugData = () => setShowDebugData(prev => !prev);

  // Function to request a new token
  const handleRequestNewToken = () => {
    // Use provided handler if available
    if (onRequestNewToken) {
      onRequestNewToken();
      return;
    }
    
    // Default implementation
    setHasRequestedToken(true);
    toast({
      title: "Requesting New Token",
      description: "Please wait, we are requesting a new access token.",
    });
  };

  // Retry function
  const onRetry = useCallback(() => {
    setIsRetrying(true);
    
    // Use provided or default refresh methods
    const refreshPromises = [];
    
    if (refreshArchetypeData) {
      refreshPromises.push(refreshArchetypeData());
    }
    
    if (refreshReportData) {
      refreshPromises.push(refreshReportData());
    }
    
    Promise.all(refreshPromises)
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
    if (!providedIsUsingFallbackData && !archetypeApiData && localArchetypeData) {
      setIsUsingFallbackData(true);
    } else if (providedIsUsingFallbackData !== undefined) {
      setIsUsingFallbackData(providedIsUsingFallbackData);
    } else {
      setIsUsingFallbackData(false);
    }
  }, [archetypeApiData, localArchetypeData, providedIsUsingFallbackData]);

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
        onRequestNewToken={handleRequestNewToken}
        tokenStatus={tokenStatus}
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
