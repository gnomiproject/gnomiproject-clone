
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
  
  // Safely extract the name
  const archetypeName = data?.name || data?.archetype_name || 'Unknown';
  
  // Enhanced helper function to ensure we're working with an array
  const ensureArray = (data: any): any[] => {
    // If it's already an array, return it
    if (Array.isArray(data)) return data;
    
    // If it's a string, try to parse it as JSON
    if (typeof data === 'string' && data) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
        if (parsed && typeof parsed === 'object') return [parsed]; // Single object becomes array with one item
        return []; // String parsed successfully but result is not an array or object
      } catch (e) {
        // If parsing fails, return string as single item in array
        return [{ description: data }];
      }
    }
    
    // If it's a non-null object but not an array, convert object values to array
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      if (Object.keys(data).length > 0) {
        return Object.values(data);
      }
    }
    
    // Default to empty array for null, undefined, or other non-convertible types
    return [];
  };
  
  // Extract strategic recommendations from the report data and ensure it's an array
  const recommendations = ensureArray(data?.strategic_recommendations);
  
  // Add debug logging
  console.log('[StrategicRecommendations] Rendering with data:', {
    hasData: !!data,
    dataName: archetypeName,
    recommendationsBeforeProcess: data?.strategic_recommendations,
    recommendationsAfterProcess: recommendations,
    recommendationsCount: recommendations.length,
    recommendationsType: typeof data?.strategic_recommendations,
    recommendationsIsArray: Array.isArray(data?.strategic_recommendations)
  });
  
  return (
    <div className="space-y-6">
      <SectionTitle title="Strategic Recommendations" />
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <p className="text-gray-600 mb-6">
          Based on our analysis of {archetypeName}, we recommend the following strategies:
        </p>
        
        {recommendations.length > 0 ? (
          <div className="space-y-6">
            {recommendations.map((recommendation: any, index: number) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-1">
                <h3 className="font-semibold text-lg">{recommendation.title || `Recommendation ${index + 1}`}</h3>
                <p className="text-gray-600">{recommendation.description || 'No description available.'}</p>
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
