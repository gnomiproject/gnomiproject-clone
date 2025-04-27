
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ArchetypeReport from '@/components/insights/ArchetypeReport';
import DeepDiveReport from '@/components/report/DeepDiveReport';
import ReportError from '@/components/report/ReportError';
import ReportLoadingState from '@/components/report/ReportLoadingState';
import { isValidArchetypeId } from '@/utils/archetypeValidation';
import { ArchetypeId, ArchetypeDetailedData } from '@/types/archetype';
import { useArchetypes } from '@/hooks/useArchetypes';
import { useGetArchetype } from '@/hooks/useGetArchetype';
import { toast } from 'sonner';
import ArchetypeError from '@/components/insights/ArchetypeError';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const ReportViewer = () => {
  const { archetypeId = '', token } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getArchetypeDetailedById } = useArchetypes();
  
  // Declare all state variables at the top
  const [initialLoading, setInitialLoading] = useState(true);
  const [isInsightsReport, setIsInsightsReport] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [skipCache, setSkipCache] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [averageData, setAverageData] = useState<any>(null);
  const [isValidAccess, setIsValidAccess] = useState(true);
  const [loadingReport, setLoadingReport] = useState(false);
  const [reportError, setReportError] = useState<Error | null>(null);
  
  // First check validity of archetypeId
  const validArchetypeId = isValidArchetypeId(archetypeId);
  
  // Call hooks unconditionally - move this before any conditional logic
  const { 
    archetypeData: archetypeApiData, 
    isLoading: archetypeLoading, 
    error: archetypeError, 
    dataSource,
    refetch: refetchArchetype,
    refreshData: refreshArchetypeData
  } = useGetArchetype(validArchetypeId ? archetypeId as ArchetypeId : 'a1' as ArchetypeId, skipCache);
  
  // Determine if we're viewing an insights report based on the route
  useEffect(() => {
    setIsInsightsReport(location.pathname.startsWith('/insights/report'));
    // Check if this is an admin view (for Deep Dive reports without tokens)
    setIsAdminView(token === 'admin-view');
  }, [location.pathname, token]);
  
  // After a brief initial loading state for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (!validArchetypeId) return;
    
    let isMounted = true;
    const loadReportData = async () => {
      if (!isInsightsReport && token && !isAdminView) {
        setLoadingReport(true);
        try {
          // We can't use hooks conditionally, so this needs to be restructured
          // Instead of calling the hook here, we'll use a function that doesn't involve hooks
          const reportDataResult = await fetch(`/api/report/${archetypeId}/${token}`);
          const data = await reportDataResult.json();
          
          if (isMounted) {
            setReportData(data?.reportData || null);
            setUserData(data?.userData || null);
            setAverageData(data?.averageData || null);
            setIsValidAccess(data?.isValidAccess || false);
            setReportError(data?.error ? new Error(data.error) : null);
          }
        } catch (error) {
          if (isMounted) {
            console.error("Error in report data loading:", error);
            setReportError(error as Error);
          }
        } finally {
          if (isMounted) {
            setLoadingReport(false);
          }
        }
      }
    };
    
    loadReportData();
    
    return () => {
      isMounted = false;
    };
  }, [archetypeId, token, isInsightsReport, isAdminView, skipCache]);
  
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

  // Function to refresh data
  const handleRefreshData = async () => {
    setSkipCache(true);
    try {
      await refreshArchetypeData();
      setSkipCache(false);
    } catch (err) {
      toast.error("Failed to refresh data");
      setSkipCache(false);
    }
  };
  
  // Function to refresh report data
  const handleRefreshReportData = async () => {
    setSkipCache(true);
    setLoadingReport(true);
    setTimeout(() => {
      setSkipCache(false);
      setLoadingReport(false);
      window.location.reload();
    }, 100);
  };

  // Now handle UI rendering based on state
  
  // First, validate archetypeId
  if (!validArchetypeId) {
    return (
      <ReportError 
        title="Invalid Archetype ID"
        message="The requested archetype ID is not valid. Please check the URL or take the assessment again."
        actionLabel="Take Assessment"
        onAction={() => navigate('/assessment')}
      />
    );
  }

  // Show loading state
  if (initialLoading || archetypeLoading || loadingReport) {
    return <ReportLoadingState />;
  }

  // If there's a connection error, show a specific error component with retry option
  if (archetypeError && archetypeError.message?.includes('timeout')) {
    return (
      <ArchetypeError 
        onRetry={handleRetry}
        onRetakeAssessment={() => navigate('/assessment')}
        isRetrying={isRetrying}
      />
    );
  }
  
  // If there's any other error, check if we can use local data
  if (archetypeError) {
    console.error('Error loading archetype data:', archetypeError);
    toast.error(`Error loading data: ${archetypeError.message}`, { 
      id: 'archetype-load-error',
      duration: 5000
    });
  }
  
  // Special handling for report token access errors
  if (!isInsightsReport && token && !isAdminView) {
    if (!isValidAccess || reportError) {
      return (
        <ReportError 
          title="Access Denied"
          message={`Unable to access this report: ${reportError?.message || 'Invalid or expired token'}`}
          actionLabel="Back to Home"
          onAction={() => navigate('/')}
        />
      );
    }
  }
  
  // Setup admin view mock data for DeepDiveReport
  const adminUserData = {
    name: 'Admin Viewer',
    organization: 'Admin Organization',
    created_at: new Date().toISOString(),
    email: 'admin@example.com'
  };
  
  const defaultAverageData = {
    archetype_id: 'All_Average',
    archetype_name: 'Population Average',
    "Demo_Average Age": 40,
    "Demo_Average Family Size": 3.0,
    "Risk_Average Risk Score": 1.0,
    "Cost_Medical & RX Paid Amount PMPY": 5000
  };

  // Fallback to local data if there's an error or no data
  const localArchetypeData = getArchetypeDetailedById(archetypeId as ArchetypeId);
  
  // If no data available even in local data, show a helpful error
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
  const finalUserData = userData || adminUserData;
  const finalAverageData = averageData || defaultAverageData;
  
  // Render the appropriate report type based on the route
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
        <ArchetypeReport 
          archetypeId={archetypeId as ArchetypeId} 
          reportData={finalReportData} 
          dataSource={dataSource} 
        />
      </div>
    );
  } else {
    // For deep dive report (regular or admin view)
    const typedReportData = finalReportData as unknown as ArchetypeDetailedData;
    
    return (
      <div className="relative">
        <div className="fixed right-6 top-24 z-50">
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
