
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import InsightsView from '@/components/insights/InsightsView';
import DeepDiveReport from '@/components/report/DeepDiveReport';
import ReportError from '@/components/report/ReportError';
import ReportLoadingState from '@/components/report/ReportLoadingState';
import { isValidArchetypeId } from '@/utils/archetypeValidation';
import { ArchetypeId, ArchetypeDetailedData } from '@/types/archetype';
import { useArchetypes } from '@/hooks/useArchetypes';
import { useGetArchetype } from '@/hooks/useGetArchetype';
import { useReportData } from '@/hooks/useReportData';
import { useReportUserData } from '@/hooks/useReportUserData';
import { toast } from 'sonner';
import ArchetypeError from '@/components/insights/ArchetypeError';
import { Button } from '@/components/ui/button';
import { RefreshCw, Bug } from 'lucide-react';
import InsightsReportContent from '@/components/report/sections/InsightsReportContent';
import ReportUserDataTest from '@/components/report/ReportUserDataTest';

const ReportViewer = () => {
  const { archetypeId = '', token } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getArchetypeDetailedById } = useArchetypes();
  
  // State variables declared together
  const [initialLoading, setInitialLoading] = useState(true);
  const [isInsightsReport, setIsInsightsReport] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [skipCache, setSkipCache] = useState(false);
  const [showDebugData, setShowDebugData] = useState(false);
  
  // Validate archetypeId (no conditional hook usage after this)
  const validArchetypeId = isValidArchetypeId(archetypeId) ? archetypeId as ArchetypeId : 'a1' as ArchetypeId;
  
  // Call hooks UNCONDITIONALLY, regardless of validArchetypeId
  const { 
    archetypeData: archetypeApiData, 
    isLoading: archetypeLoading, 
    error: archetypeError, 
    dataSource,
    refetch: refetchArchetype,
    refreshData: refreshArchetypeData
  } = useGetArchetype(validArchetypeId, skipCache);
  
  // Use the updated user data hook for report access verification
  const {
    userData,
    isLoading: userDataLoading,
    isValid: isValidAccess,
    error: userDataError
  } = useReportUserData(token, validArchetypeId);
  
  // Call useReportData hook unconditionally with safe defaults
  const {
    reportData,
    averageData,
    isLoading: reportLoading,
    error: reportError,
    retry: retryReportData,
    refreshData: refreshReportData
  } = useReportData({
    archetypeId: validArchetypeId,
    token: token || '',
    isInsightsReport,
    skipCache
  });

  // Determine report type using useEffect
  useEffect(() => {
    setIsInsightsReport(location.pathname.startsWith('/insights/report'));
    setIsAdminView(token === 'admin-view');
  }, [location.pathname, token]);
  
  // Initial loading timer effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Function to handle retry when there's a connection error
  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await refetchArchetype();
      toast.success("Reconnected successfully");
    } catch (err) {
      toast.error("Connection failed. Please try again.");
    } finally {
      setIsRetrying(false);
    }
  };

  // Function to refresh data - simplified
  const handleRefreshData = async () => {
    setSkipCache(true);
    try {
      await refreshArchetypeData();
    } finally {
      setSkipCache(false);
    }
  };
  
  // Function to refresh report data - simplified
  const handleRefreshReportData = () => {
    refreshReportData();
  };

  // Debug logging to help diagnose issues
  useEffect(() => {
    if (reportData) {
      console.log('Report data loaded:', reportData);
      console.log('User data:', userData);
      console.log('Using fallback data:', !reportData.strategic_recommendations || reportData.strategic_recommendations.length === 0);
    }
  }, [reportData, userData]);

  // Toggle debug data view
  const toggleDebugData = () => {
    setShowDebugData(!showDebugData);
  };

  // Show loading state if any data is still loading
  if (initialLoading || archetypeLoading || reportLoading || userDataLoading) {
    return <ReportLoadingState />;
  }

  // Handle validation error after all hooks have been called
  if (!isValidArchetypeId(archetypeId)) {
    return (
      <ReportError 
        title="Invalid Archetype ID"
        message="The requested archetype ID is not valid. Please check the URL or take the assessment again."
        actionLabel="Take Assessment"
        onAction={() => navigate('/assessment')}
      />
    );
  }

  // Handle connection errors
  if (archetypeError && archetypeError.message?.includes('timeout')) {
    return (
      <ArchetypeError 
        onRetry={handleRetry}
        onRetakeAssessment={() => navigate('/assessment')}
        isRetrying={isRetrying}
      />
    );
  }
  
  // Handle API errors but continue
  if (archetypeError) {
    console.error('Error loading archetype data:', archetypeError);
    toast.error(`Error loading data: ${archetypeError.message}`, { 
      id: 'archetype-load-error',
      duration: 5000
    });
  }
  
  // Handle report token access errors
  if (!isInsightsReport && token && !isAdminView && (!isValidAccess || userDataError)) {
    return (
      <ReportError 
        title="Access Denied"
        message={`Unable to access this report: ${userDataError?.message || 'Invalid or expired token'}`}
        actionLabel="Back to Home"
        onAction={() => navigate('/')}
      />
    );
  }
  
  // If debug mode is enabled, show the test component
  if (showDebugData && !isInsightsReport) {
    return (
      <>
        <div className="fixed right-6 top-24 z-50 flex gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={toggleDebugData}
            className="bg-white shadow-md hover:bg-gray-100"
          >
            <Bug className="h-4 w-4 mr-2" />
            Hide Debug
          </Button>
        </div>
        <ReportUserDataTest />
      </>
    );
  }
  
  // Get local data as fallback
  const localArchetypeData = getArchetypeDetailedById(archetypeId as ArchetypeId);
  
  // If no data is available, show error
  if (!localArchetypeData && !archetypeApiData && !reportData) {
    return (
      <ReportError 
        title="Report Not Available"
        message="We couldn't load the report data for this archetype. Please try again or take the assessment again."
        actionLabel="Take Assessment"
        onAction={() => navigate('/assessment')}
      />
    );
  }

  // Report data will use real database data or fallback to local data
  const finalReportData = reportData || archetypeApiData || localArchetypeData;
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
  
  // Render the appropriate report type
  if (isInsightsReport) {
    return (
      <div className="relative">
        <div className="fixed right-6 top-24 z-50">
          <Button 
            variant="outline"
            size="sm"
            onClick={handleRefreshData}
            className="bg-white shadow-md hover:bg-gray-100"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
        <div className="container mx-auto">
          <InsightsReportContent archetype={finalReportData} />
        </div>
      </div>
    );
  } else {
    // For deep dive report (regular or admin view)
    const typedReportData = finalReportData as unknown as ArchetypeDetailedData;
    
    return (
      <div className="relative">
        <div className="fixed right-6 top-24 z-50 flex gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={toggleDebugData}
            className="bg-white shadow-md hover:bg-gray-100"
          >
            <Bug className="h-4 w-4 mr-2" />
            Debug Data
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={isAdminView ? handleRefreshData : handleRefreshReportData}
            className="bg-white shadow-md hover:bg-gray-100"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
        <DeepDiveReport 
          reportData={typedReportData} 
          userData={finalUserData} 
          averageData={finalAverageData}
          isAdminView={isAdminView}
        />
      </div>
    );
  }
};

export default ReportViewer;
