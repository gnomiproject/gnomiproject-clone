
import React from 'react';
import { Section } from '@/components/shared/Section';
import SectionTitle from '@/components/shared/SectionTitle';
import StrategicRecommendations from './StrategicRecommendations';
import GnomeImage from '@/components/common/GnomeImage';

interface InsightsReportContentProps {
  archetype: any;
}

const InsightsReportContent: React.FC<InsightsReportContentProps> = ({ archetype }) => {
  // Debug logging to see the data structure
  console.log('[DEBUG] InsightsReportContent data:', {
    id: archetype?.id || archetype?.archetype_id,
    name: archetype?.name || archetype?.archetype_name,
    hasStrengths: !!archetype?.strengths,
    hasRecommendations: !!archetype?.strategic_recommendations,
    recommendationsType: typeof archetype?.strategic_recommendations,
    recommendationsIsArray: Array.isArray(archetype?.strategic_recommendations)
  });

  // Safely extract name and ID from either format (admin or regular)
  const name = archetype?.name || archetype?.archetype_name || 'Untitled Archetype';
  const id = archetype?.id || archetype?.archetype_id || '';
  
  return (
    <div className="max-w-7xl mx-auto py-8 space-y-12">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {name} 
            <span className="ml-2 text-sm bg-gray-100 px-2 py-1 rounded text-gray-600 align-middle">
              {id.toUpperCase()}
            </span>
          </h1>
          <p className="text-gray-500 mt-2">
            Simplified report view for debugging
          </p>
        </div>
      </div>

      <Section id="debug-info">
        <SectionTitle title="Debug Information" />
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-mono text-sm">Data Structure</h3>
              <div className="mt-2 font-mono text-xs overflow-auto max-h-32">
                <p>Archetype ID: {id}</p>
                <p>Archetype Name: {name}</p>
                <p>Has Strengths: {archetype?.strengths ? 'Yes' : 'No'}</p>
                <p>Has Recommendations: {archetype?.strategic_recommendations ? 'Yes' : 'No'}</p>
                <p>Recommendations Type: {typeof archetype?.strategic_recommendations}</p>
              </div>
            </div>
            <div className="flex justify-center">
              <GnomeImage type="profile" showDebug={true} />
            </div>
          </div>
        </div>
      </Section>
      
      <Section id="recommendations">
        <StrategicRecommendations reportData={archetype} averageData={{}} />
      </Section>
    </div>
  );
};

export default InsightsReportContent;
