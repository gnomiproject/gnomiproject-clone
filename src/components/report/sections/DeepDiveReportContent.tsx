
import React from 'react';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import { Section } from '@/components/shared/Section';
import SectionTitle from '@/components/shared/SectionTitle';
import GnomeImage from '@/components/common/GnomeImage';
import HomeIntroduction from './HomeIntroduction';
import ArchetypeProfileSection from './ArchetypeProfileSection';
import DemographicsSection from './DemographicsSection';
import StrategicRecommendationsSection from './strategic-recommendations/StrategicRecommendationsSection';

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
  
  // Debug logging
  console.log('[DEBUG] DeepDiveReportContent archetype data:', {
    id: archetypeId,
    name: archetypeName,
    familyId: archetype?.family_id || archetype?.familyId,
    familyName: archetype?.family_name,
    userData: userData ? {
      name: userData.name,
      organization: userData.organization,
      accessToken: userData.access_token ? `${userData.access_token.substring(0, 5)}...` : 'None',
      lastAccessed: userData.last_accessed
    } : 'No user data'
  });

  // Make a safe copy of the data to avoid mutation issues
  const safeArchetype = {...archetype};
  
  return (
    <div className="container mx-auto p-6">
      <ErrorBoundary>
        {/* Home & Introduction Section */}
        <HomeIntroduction 
          userData={userData}
          archetypeData={safeArchetype}
          averageData={averageData}
        />
      </ErrorBoundary>
      
      {/* Archetype Profile Section */}
      <ErrorBoundary>
        <ArchetypeProfileSection archetypeData={safeArchetype} />
      </ErrorBoundary>
      
      {/* Demographics Section */}
      <ErrorBoundary>
        <DemographicsSection 
          reportData={safeArchetype} 
          averageData={averageData} 
        />
      </ErrorBoundary>
      
      {/* Strategic Recommendations Section */}
      <ErrorBoundary>
        <StrategicRecommendationsSection
          reportData={safeArchetype}
          averageData={averageData}
        />
      </ErrorBoundary>
      
      {/* Debug information - shown in a less prominent way */}
      <ErrorBoundary>
        <Section id="debug-info" className="print:hidden">
          <details className="mt-4 bg-gray-50 p-4 rounded-lg text-sm">
            <summary className="font-medium cursor-pointer">Debug Information</summary>
            <div className="mt-2 font-mono text-xs space-y-1">
              <p>Archetype ID: {archetypeId}</p>
              <p>Archetype Name: {archetypeName}</p>
              <p>Family ID: {archetype?.family_id || archetype?.familyId || 'Not available'}</p>
              <p>Family Name: {archetype?.family_name || 'Not available'}</p>
              <p>User: {userData?.name || 'Not available'}</p>
              <p>Organization: {userData?.organization || 'Not available'}</p>
              <p>Access Token: {userData?.access_token ? `${userData.access_token.substring(0, 5)}...` : 'Not available'}</p>
              <p>Last Accessed: {userData?.last_accessed ? new Date(userData.last_accessed).toLocaleString() : 'Never'}</p>
              <p>Has User Data: {userData ? 'Yes' : 'No'}</p>
              <p>Has Strategic Recommendations: {archetype?.strategic_recommendations ? 'Yes' : 'No'}</p>
              <p>Has SWOT Data: {archetype?.strengths || archetype?.swot_analysis ? 'Yes' : 'No'}</p>
            </div>
            <div className="mt-4 flex justify-center">
              <GnomeImage type="presentation" showDebug={true} />
            </div>
          </details>
        </Section>
      </ErrorBoundary>
    </div>
  );
};

export default DeepDiveReportContent;
