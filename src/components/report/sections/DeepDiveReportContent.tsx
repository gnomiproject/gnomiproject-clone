
import React from 'react';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import { Section } from '@/components/shared/Section';
import SectionTitle from '@/components/shared/SectionTitle';
import StrategicRecommendations from './StrategicRecommendations';
import GnomeImage from '@/components/common/GnomeImage';

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
  console.log('[DEBUG] DeepDiveReportContent received data:', {
    id: archetypeId,
    name: archetypeName,
    hasStrategicRecommendations: !!archetype?.strategic_recommendations,
    recommendationsType: typeof archetype?.strategic_recommendations
  });

  // Make a safe copy of the data to avoid mutation issues
  const safeArchetype = {...archetype};
  
  return (
    <div className="container mx-auto p-6">
      <ErrorBoundary>
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <h1 className="text-3xl font-bold">
            {archetypeName} Report 
            <span className="ml-2 text-sm bg-gray-100 px-2 py-1 rounded text-gray-600 align-middle">
              {archetypeId ? archetypeId.toUpperCase() : 'ID UNKNOWN'}
            </span>
          </h1>
          <p className="text-gray-500 mt-2">
            Simplified debugging view
          </p>
          
          <div className="mt-8 bg-gray-50 p-4 rounded-lg">
            <h2 className="font-semibold">Debug Information</h2>
            <div className="mt-2 font-mono text-xs space-y-1">
              <p>User: {userData?.name || 'Not available'}</p>
              <p>Organization: {userData?.organization || 'Not available'}</p>
              <p>Data Type: {typeof archetype || 'Unknown'}</p>
              <p>Has Strategic Recommendations: {archetype?.strategic_recommendations ? 'Yes' : 'No'}</p>
              <p>Recommendations Type: {typeof archetype?.strategic_recommendations || 'Not available'}</p>
              <p>Has SWOT Data: {archetype?.strengths ? 'Yes' : 'No'}</p>
            </div>
          </div>
          
          <div className="mt-4 flex justify-center">
            <GnomeImage type="presentation" showDebug={true} />
          </div>
        </div>
      </ErrorBoundary>
      
      <Section id="recommendations">
        <ErrorBoundary>
          <StrategicRecommendations 
            reportData={safeArchetype}
            archetypeData={safeArchetype}
            averageData={averageData}
          />
        </ErrorBoundary>
      </Section>
    </div>
  );
};

export default DeepDiveReportContent;
