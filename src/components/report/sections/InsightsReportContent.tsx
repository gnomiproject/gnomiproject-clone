
import React from 'react';
import InsightOverviewSection from './InsightOverviewSection';
import InsightMetricsSection from './InsightMetricsSection';
import InsightSwotSection from './InsightSwotSection';
import InsightCareSection from './InsightCareSection';
import { Section } from '@/components/shared/Section';
import RecommendationsSection from './StrategicRecommendations';

interface InsightsReportContentProps {
  archetype: any;
}

const InsightsReportContent: React.FC<InsightsReportContentProps> = ({ archetype }) => {
  // Add debug logging to see the data structure
  console.log('InsightsReportContent: Data received:', archetype);

  // Safely extract name from either format (admin or regular)
  const name = archetype?.name || archetype?.archetype_name || 'Untitled Archetype';
  
  return (
    <div className="max-w-7xl mx-auto py-8 space-y-12">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {name} Insights Report
          </h1>
          <p className="text-gray-500 mt-2">
            Comprehensive analysis and strategic recommendations
          </p>
        </div>
      </div>

      <InsightOverviewSection archetype={archetype} />
      <InsightMetricsSection archetype={archetype} />
      <InsightSwotSection archetype={archetype} />
      <InsightCareSection archetype={archetype} />
      
      <Section id="recommendations">
        <RecommendationsSection reportData={archetype} averageData={{}} />
      </Section>
    </div>
  );
};

export default InsightsReportContent;
