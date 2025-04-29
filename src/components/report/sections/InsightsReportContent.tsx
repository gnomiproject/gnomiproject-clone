
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
  // Debug logging to see the data structure
  console.log('InsightsReportContent: Data received:', {
    id: archetype?.id || archetype?.archetype_id,
    name: archetype?.name || archetype?.archetype_name,
    hasStrengths: !!archetype?.strengths,
    hasRecommendations: !!archetype?.strategic_recommendations,
    recommendationsType: typeof archetype?.strategic_recommendations,
    recommendationsIsArray: Array.isArray(archetype?.strategic_recommendations),
    recommendationsValue: archetype?.strategic_recommendations
  });

  // Safely extract name and ID from either format (admin or regular)
  const name = archetype?.name || archetype?.archetype_name || 'Untitled Archetype';
  const id = archetype?.id || archetype?.archetype_id || '';
  
  // Ensure all required arrays exist to prevent map function errors
  const ensureArray = (data: any): any[] => {
    if (Array.isArray(data)) return data;
    if (typeof data === 'string' && data) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
        if (parsed && typeof parsed === 'object') return [parsed];
        return [data]; // String as single item
      } catch (e) {
        // If parsing fails, return string as single item array
        return [data];
      }
    }
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      return Object.values(data);
    }
    return [];
  };
  
  // Process archetype data to ensure all required properties exist and are in the right format
  const processedArchetype = {
    ...archetype,
    strengths: ensureArray(archetype?.strengths),
    weaknesses: ensureArray(archetype?.weaknesses),
    opportunities: ensureArray(archetype?.opportunities),
    threats: ensureArray(archetype?.threats),
    strategic_recommendations: ensureArray(archetype?.strategic_recommendations),
  };

  // Additional debug logging for processed data
  console.log('InsightsReportContent: Processed data:', {
    processedStrengthsType: typeof processedArchetype.strengths,
    processedStrengthsIsArray: Array.isArray(processedArchetype.strengths),
    processedStrengthsLength: processedArchetype.strengths.length,
    processedRecommendationsType: typeof processedArchetype.strategic_recommendations,
    processedRecommendationsIsArray: Array.isArray(processedArchetype.strategic_recommendations),
    processedRecommendationsLength: processedArchetype.strategic_recommendations.length
  });
  
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
            Comprehensive analysis and strategic recommendations
          </p>
        </div>
      </div>

      <InsightOverviewSection archetype={processedArchetype} />
      <InsightMetricsSection archetype={processedArchetype} />
      <InsightSwotSection archetype={processedArchetype} />
      <InsightCareSection archetype={processedArchetype} />
      
      <Section id="recommendations">
        <RecommendationsSection reportData={processedArchetype} averageData={{}} />
      </Section>
    </div>
  );
};

export default InsightsReportContent;
