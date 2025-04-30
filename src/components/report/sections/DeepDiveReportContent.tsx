
import React, { useEffect } from 'react';
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
  const familyName = archetype?.family_name || 'Unknown Family';
  const shortDescription = archetype?.short_description || '';
  
  // Debug logging
  useEffect(() => {
    console.log('[DeepDiveReportContent] Processing archetype data:', {
      id: archetypeId,
      name: archetypeName,
      familyId: archetype?.family_id || archetype?.familyId,
      familyName,
      shortDescription: shortDescription ? shortDescription.substring(0, 50) + '...' : 'None',
      userData: userData ? {
        name: userData.name,
        organization: userData.organization,
        accessToken: userData.access_token ? `${userData.access_token.substring(0, 5)}...` : 'None',
        lastAccessed: userData.last_accessed
      } : 'No user data',
      fullArchetypeObject: archetype ? 'Present' : 'Missing'
    });
  }, [archetype, archetypeId, archetypeName, familyName, shortDescription, userData]);

  // Make a safe copy of the data to avoid mutation issues
  const safeArchetype = {...archetype};
  
  // Ensure the archetype data has all expected fields
  safeArchetype.id = archetypeId;
  safeArchetype.name = archetypeName;
  safeArchetype.archetype_id = archetypeId;
  safeArchetype.archetype_name = archetypeName;
  safeArchetype.family_name = familyName;
  safeArchetype.short_description = shortDescription;
  
  // Ensure we're passing the complete archetype data to all components
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
              <p>Family Name: {familyName}</p>
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
