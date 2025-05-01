
/**
 * InsightsReportContent Component - Updated to use dedicated SWOT components
 * This component is for the Insights Report and uses level3_report_secure data
 */
import React from 'react';
import { Section } from '@/components/shared/Section';
import SectionTitle from '@/components/shared/SectionTitle';
import StrategicRecommendations from './StrategicRecommendations';
import DeepDiveSwotAnalysis from './DeepDiveSwotAnalysis';

interface InsightsReportContentProps {
  archetype: any;
}

const InsightsReportContent: React.FC<InsightsReportContentProps> = ({ archetype }) => {
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
      
      {/* Using the dedicated DeepDiveSwotAnalysis component for level4_report_secure data */}
      <Section id="swot-analysis">
        <DeepDiveSwotAnalysis reportData={archetype} />
      </Section>
      
      <Section id="recommendations">
        <StrategicRecommendations reportData={archetype} averageData={{}} />
      </Section>
    </div>
  );
};

export default InsightsReportContent;
