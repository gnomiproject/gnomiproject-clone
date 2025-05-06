
import React, { useEffect } from 'react';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import ReportSections from './ReportSections';
import ReportErrorHandler from '../components/ReportErrorHandler';
import ReportDebugInfo from '../components/ReportDebugInfo';

interface DeepDiveReportContentProps {
  archetype: any;
  userData?: any;
  averageData?: any;
}

const DeepDiveReportContent = ({ 
  archetype, 
  userData,
  averageData
}: DeepDiveReportContentProps) => {
  // Store these values once to avoid unnecessary recalculations
  const archetypeName = archetype?.name || archetype?.archetype_name || 'Unknown';
  const archetypeId = archetype?.id || archetype?.archetype_id || '';
  const familyName = archetype?.family_name || 'Unknown Family';
  const shortDescription = archetype?.short_description || '';
  
  // Debug logging
  useEffect(() => {
    console.log('[DeepDiveReportContent] Processing archetype data from level4_report_secure:', {
      id: archetypeId,
      name: archetypeName,
      familyId: archetype?.family_id || archetype?.familyId,
      familyName,
      shortDescription: shortDescription ? shortDescription.substring(0, 50) + '...' : 'None',
      hasSwotAnalysisField: !!archetype?.swot_analysis,
      swotAnalysisType: archetype?.swot_analysis ? typeof archetype.swot_analysis : 'None',
      hasStrengthsField: !!archetype?.strengths,
      hasWeaknessesField: !!archetype?.weaknesses,
      userData: userData ? {
        name: userData.name,
        organization: userData.organization,
        accessToken: userData.access_token ? `${userData.access_token.substring(0, 5)}...` : 'None',
        lastAccessed: userData.last_accessed
      } : 'No user data'
    });
  }, [archetype, archetypeId, archetypeName, familyName, shortDescription, userData]);

  // Make a safe copy of the data to avoid mutation issues
  const safeArchetype = {...archetype};
  
  // If no archetype data, show error
  if (!archetype) {
    return <ReportErrorHandler 
      archetypeName={archetypeName} 
      onRetry={() => window.location.reload()} 
    />;
  }
  
  // Ensure we're passing the complete archetype data to all components
  return (
    <div className="container mx-auto p-6">
      <ReportSections 
        reportData={safeArchetype}
        userData={userData}
        averageData={averageData}
      />
      
      {/* Debug information - shown in a less prominent way */}
      <ErrorBoundary>
        <ReportDebugInfo 
          archetypeId={archetypeId}
          archetypeName={archetypeName}
          familyName={familyName}
          familyId={archetype?.family_id || archetype?.familyId}
          swotAnalysis={archetype?.swot_analysis}
          strengths={archetype?.strengths}
          weaknesses={archetype?.weaknesses}
          userData={userData}
        />
      </ErrorBoundary>
    </div>
  );
};

export default DeepDiveReportContent;
