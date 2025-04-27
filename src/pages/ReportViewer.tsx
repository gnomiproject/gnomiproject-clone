
import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ArchetypeReport from '@/components/insights/ArchetypeReport';
import DeepDiveReport from '@/components/report/DeepDiveReport';
import ReportError from '@/components/report/ReportError';
import { isValidArchetypeId } from '@/utils/archetypeValidation';
import { ArchetypeId } from '@/types/archetype';
import { useArchetypes } from '@/hooks/useArchetypes';
import { useGetArchetype } from '@/hooks/useGetArchetype';

const ReportViewer = () => {
  const { archetypeId = '' } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getArchetypeDetailedById } = useArchetypes();
  
  // Check if we're accessing via insights route
  const isInsightsReport = location.pathname.startsWith('/insights/report');
  
  // Validate archetype ID early
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

  // Get the archetype data with full database data
  const { archetypeData, isLoading, error } = useGetArchetype(archetypeId as ArchetypeId);
  
  // Fallback to local data if there's an error or while loading
  const localArchetypeData = getArchetypeDetailedById(archetypeId as ArchetypeId);
  
  // If no data available even in local data, show a helpful error
  if (!localArchetypeData) {
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
  const reportData = archetypeData || localArchetypeData;
  
  // Dummy data for other report properties that might be needed for DeepDiveReport
  const userData = {
    name: 'Demo User',
    organization: 'Demo Organization',
    created_at: new Date().toISOString(),
    email: 'demo@example.com'
  };
  
  const averageData = {
    archetype_id: 'All_Average',
    archetype_name: 'Population Average',
    "Demo_Average Age": 40,
    "Demo_Average Family Size": 3.0,
    "Risk_Average Risk Score": 1.0,
    "Cost_Medical & RX Paid Amount PMPY": 5000
  };

  // Directly render the appropriate report type based on the route
  return isInsightsReport ? (
    <ArchetypeReport archetypeId={archetypeId as ArchetypeId} reportData={reportData} />
  ) : (
    <DeepDiveReport reportData={reportData} userData={userData} averageData={averageData} />
  );
};

export default ReportViewer;
