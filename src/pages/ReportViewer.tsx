
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ArchetypeReport from '@/components/insights/ArchetypeReport';
import DeepDiveReport from '@/components/report/DeepDiveReport';
import ReportError from '@/components/report/ReportError';
import ReportLoadingState from '@/components/report/ReportLoadingState';
import { isValidArchetypeId } from '@/utils/archetypeValidation';
import { ArchetypeId } from '@/types/archetype';
import { useArchetypes } from '@/hooks/useArchetypes';
import { useGetArchetype } from '@/hooks/useGetArchetype';
import { useReportData } from '@/hooks/useReportData';
import { toast } from 'sonner';
import ArchetypeError from '@/components/insights/ArchetypeError';

const ReportViewer = () => {
  const { archetypeId = '', token } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getArchetypeDetailedById } = useArchetypes();
  const [initialLoading, setInitialLoading] = useState(true);
  const [isInsightsReport, setIsInsightsReport] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  
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
  
  // Always call the hook regardless of the path
  // This ensures consistent hook order on every render
  const { 
    archetypeData: archetypeApiData, 
    isLoading: archetypeLoading, 
    error: archetypeError, 
    dataSource,
    refetch: refetchArchetype
  } = useGetArchetype(archetypeId as ArchetypeId);
  
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
  
  // Validate archetype ID early - this doesn't use hooks so it's safe 
  // to place here conditionally
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

  // For deep dive reports with tokens, use the useReportData hook
  if (!isInsightsReport && token && !isAdminView) {
    const { 
      reportData, 
      userData, 
      averageData, 
      isLoading, 
      isValidAccess, 
      error, 
      dataSource: reportDataSource,
      retry: retryReportData
    } = useReportData({ 
      archetypeId, 
      token, 
      isInsightsReport: false 
    });

    if (isLoading || initialLoading) {
      return <ReportLoadingState />;
    }

    if (!isValidAccess || error) {
      return (
        <ReportError 
          title="Access Denied"
          message={`Unable to access this report: ${error?.message || 'Invalid or expired token'}`}
          actionLabel="Retry Connection"
          onAction={retryReportData}
          secondaryAction={() => navigate('/')}
          secondaryActionLabel="Back to Home"
        />
      );
    }

    return (
      <DeepDiveReport 
        reportData={reportData} 
        userData={userData} 
        averageData={averageData}
        loading={isLoading}
      />
    );
  }

  // For admin-view deep dive reports or insights reports
  if (initialLoading || archetypeLoading) {
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
  
  // Fallback to local data if there's an error or no data
  const localArchetypeData = getArchetypeDetailedById(archetypeId as ArchetypeId);
  
  // If no data available even in local data, show a helpful error
  if (!localArchetypeData && !archetypeApiData) {
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
  const reportData = archetypeApiData || localArchetypeData;
  
  // Setup admin view mock data for DeepDiveReport
  const adminUserData = {
    name: 'Admin Viewer',
    organization: 'Admin Organization',
    created_at: new Date().toISOString(),
    email: 'admin@example.com'
  };
  
  const averageData = {
    archetype_id: 'All_Average',
    archetype_name: 'Population Average',
    "Demo_Average Age": 40,
    "Demo_Average Family Size": 3.0,
    "Risk_Average Risk Score": 1.0,
    "Cost_Medical & RX Paid Amount PMPY": 5000
  };

  // Render the appropriate report type based on the route
  if (isInsightsReport) {
    return (
      <ArchetypeReport 
        archetypeId={archetypeId as ArchetypeId} 
        reportData={reportData} 
        dataSource={dataSource} 
      />
    );
  } else {
    // For deep dive report (regular or admin view)
    return (
      <>
        {isAdminView && (
          <div className="bg-yellow-50 border-yellow-200 border p-4 text-yellow-800 text-center">
            <strong>Admin View</strong> - Viewing with placeholder user data. Not a real user session.
          </div>
        )}
        <DeepDiveReport 
          reportData={reportData} 
          userData={adminUserData} 
          averageData={averageData}
          isAdminView={isAdminView}
        />
      </>
    );
  }
};

export default ReportViewer;
