
import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import DeepDiveReport from '@/components/report/DeepDiveReport';
import ArchetypeReport from '@/components/insights/ArchetypeReport';
import ReportLoadingState from '@/components/report/ReportLoadingState';
import ReportError from '@/components/report/ReportError';
import FallbackBanner from '@/components/report/FallbackBanner';
import { useReportData } from '@/hooks/useReportData';
import { isValidArchetypeId } from '@/utils/archetypeValidation';
import { ArchetypeId } from '@/types/archetype';

const ReportViewer = () => {
  const { archetypeId = '', token = '' } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're accessing via insights route (no token needed)
  const isInsightsReport = location.pathname.startsWith('/insights/report');

  if (!isValidArchetypeId(archetypeId)) {
    return (
      <ReportError 
        title="Invalid Archetype ID"
        message="The requested archetype ID is not valid. Please check the URL or request a new report."
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
    usingFallbackData
  } = useReportData({
    archetypeId,
    token,
    isInsightsReport
  });

  if (isLoading) {
    return <ReportLoadingState />;
  }

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

  if (!reportData) {
    return (
      <ReportError 
        title="Error Loading Report"
        message="There was an error loading the report data. Please try again later."
        actionLabel="Retry"
        onAction={() => window.location.reload()}
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
