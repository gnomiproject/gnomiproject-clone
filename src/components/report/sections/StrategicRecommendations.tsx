
import React from 'react';
import { ArchetypeDetailedData } from '@/types/archetype';
import SectionTitle from '@/components/shared/SectionTitle';

export interface StrategicRecommendationsProps {
  reportData?: ArchetypeDetailedData;
  averageData?: any;
  archetypeData?: ArchetypeDetailedData;  // Added for backward compatibility
}

const StrategicRecommendations: React.FC<StrategicRecommendationsProps> = ({ 
  reportData,
  averageData,
  archetypeData  // Support both prop patterns
}) => {
  // Use reportData as primary, fall back to archetypeData
  const data = reportData || archetypeData;
  
  // Extract strategic recommendations from the report data
  const recommendations = data?.strategic_recommendations || [];
  
  return (
    <div className="space-y-6">
      <SectionTitle title="Strategic Recommendations" />
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <p className="text-gray-600 mb-6">
          Based on our analysis of {data?.name || data?.archetype_name}, we recommend the following strategies:
        </p>
        
        {recommendations.length > 0 ? (
          <div className="space-y-6">
            {recommendations.map((recommendation: any, index: number) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-1">
                <h3 className="font-semibold text-lg">{recommendation.title}</h3>
                <p className="text-gray-600">{recommendation.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No specific recommendations are available at this time.
          </p>
        )}
      </div>
    </div>
  );
};

export default StrategicRecommendations;
