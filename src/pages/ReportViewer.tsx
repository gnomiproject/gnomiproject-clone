
import React, { useEffect, useState } from 'react';
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
  const { getAllArchetypeSummaries, getArchetypeDetailedById } = useArchetypes();
  const [maxRetries] = useState(2);
  const [retryCount, setRetryCount] = useState(0);
  
  // Check if we're accessing via insights route
  const isInsightsReport = location.pathname.startsWith('/insights/report');
  
  // Log route information for debugging
  useEffect(() => {
    console.log('ReportViewer rendered with:', {
      archetypeId,
      isInsightsReport,
      pathname: location.pathname
    });
  }, [archetypeId, isInsightsReport, location.pathname]);
  
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
    console.log('Available archetypes:', allArchetypes.map(a => a.id).join(', '));
    
    const archetypeExists = allArchetypes.some(a => a.id === archetypeId);
    if (!archetypeExists) {
      console.warn(`Archetype ${archetypeId} not found in local data`);
    } else {
      console.log(`Found archetype ${archetypeId} in local data`);
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
  
  // Helper function to retry loading
  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      toast.info("Retrying to load your report...");
      window.location.reload();
    } else {
      // Max retries reached, force using local data
      const localData = getArchetypeDetailedById(archetypeId as ArchetypeId);
      if (localData) {
        toast.success("Using locally available data for your report");
      } else {
        toast.error("Unable to load report data after multiple attempts");
      }
    }
  };

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
        onAction={handleRetry}
      />
    );
  }

  // Show appropriate error if no report data is available
  if (!reportData) {
    console.error('No report data available for archetype:', archetypeId);
    
    // Try to get local data as a last resort
    const localData = getArchetypeDetailedById(archetypeId as ArchetypeId);
    
    if (localData) {
      console.log('Using local archetype data as emergency fallback');
      
      // Format local data to match expected reportData structure
      const emergencyFallbackData = {
        archetype_id: localData.id,
        archetype_name: localData.name,
        short_description: localData.short_description || '',
        long_description: localData.long_description || '',
        key_characteristics: localData.key_characteristics || [],
        strengths: localData.enhanced?.swot?.strengths || [],
        weaknesses: localData.enhanced?.swot?.weaknesses || [],
        opportunities: localData.enhanced?.swot?.opportunities || [],
        threats: localData.enhanced?.swot?.threats || [],
        strategic_recommendations: localData.enhanced?.strategicPriorities || []
      };
      
      // Show notification
      toast.info("Using backup data for your report");
      
      // Render the appropriate report with emergency fallback data
      return (
        <>
          <FallbackBanner show={true} />
          {isInsightsReport ? (
            <ArchetypeReport archetypeId={archetypeId as ArchetypeId} reportData={emergencyFallbackData} />
          ) : (
            <DeepDiveReport reportData={emergencyFallbackData} userData={userData} averageData={averageData} />
          )}
        </>
      );
    }
    
    // If we still have no data, show a helpful error
    return (
      <ReportError 
        title="Report Not Available"
        message="We couldn't load the report data for this archetype. Please try again or take the assessment again."
        actionLabel="Take Assessment"
        onAction={() => navigate('/assessment')}
      />
    );
  }

  // If we got here, we have report data, so render the appropriate report
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
