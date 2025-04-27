
import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import DeepDiveReport from '@/components/report/DeepDiveReport';
import ArchetypeReport from '@/components/insights/ArchetypeReport';
import ReportLoadingState from '@/components/report/ReportLoadingState';
import ReportError from '@/components/report/ReportError';
import FallbackBanner from '@/components/report/FallbackBanner';
import { useReportData } from '@/hooks/useReportData';
import { isValidArchetypeId } from '@/utils/archetypeValidation';
import { ArchetypeId } from '@/types/archetype';
import { useArchetypes } from '@/hooks/useArchetypes';
import { toast } from 'sonner';

const ReportViewer = () => {
  const { archetypeId = '' } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getAllArchetypeSummaries } = useArchetypes();
  
  // Check if we're accessing via insights route
  const isInsightsReport = location.pathname.startsWith('/insights/report');
  
  // Validate archetype ID early
  useEffect(() => {
    if (!isValidArchetypeId(archetypeId)) {
      toast.error("Invalid archetype ID. Redirecting to assessment...");
      // Short delay before navigation to show the toast
      const timer = setTimeout(() => navigate('/assessment'), 1500);
      return () => clearTimeout(timer);
    }
    
    // Additional check - verify the archetype exists in our data
    const allArchetypes = getAllArchetypeSummaries();
    const archetypeExists = allArchetypes.some(a => a.id === archetypeId);
    if (!archetypeExists) {
      console.warn(`Archetype ${archetypeId} not found in local data`);
    }
  }, [archetypeId, navigate, getAllArchetypeSummaries]);

  // If invalid ID, show error immediately 
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

  const {
    isValidAccess,
    reportData,
    userData,
    averageData,
    isLoading,
    usingFallbackData,
    error
  } = useReportData({
    archetypeId,
    token: '',
    isInsightsReport
  });

  // Show loading state while data is being fetched
  if (isLoading) {
    return <ReportLoadingState />;
  }

  // Handle invalid access
  if (isValidAccess === false) {
    return (
      <ReportError 
        title="Invalid Access"
        message="This report link is either invalid or has expired. Please request a new report."
        actionLabel="Take Assessment"
        onAction={() => navigate('/assessment')}
      />
    );
  }

  // Handle data loading errors
  if (error) {
    return (
      <ReportError 
        title="Error Loading Report"
        message={`There was a problem loading the report: ${error.message || 'Unknown error'}. We're using local data if available.`}
        actionLabel="Try Again"
        onAction={() => window.location.reload()}
      />
    );
  }

  // Show appropriate error if no report data is available
  if (!reportData) {
    return (
      <ReportError 
        title="Report Not Available"
        message="We couldn't load the report data for this archetype. Please try again or take the assessment again."
        actionLabel="Take Assessment"
        onAction={() => navigate('/assessment')}
      />
    );
  }

  return (
    <>
      <FallbackBanner show={usingFallbackData} />
      {isInsightsReport ? (
        <ArchetypeReport archetypeId={archetypeId as ArchetypeId} reportData={reportData} />
      ) : (
        <DeepDiveReport reportData={reportData} userData={userData} averageData={averageData} />
      )}
    </>
  );
};

export default ReportViewer;
