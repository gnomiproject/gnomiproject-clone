
import React from 'react';
import { ArchetypeDetailedData } from '@/types/archetype';
import SectionTitle from '@/components/shared/SectionTitle';
import GnomeImage from '@/components/common/GnomeImage';

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
  
  // Debugging: log the raw data structure
  console.log('[DEBUG] StrategicRecommendations data:', {
    hasData: !!data,
    dataName: archetypeName,
    rawRecommendations: data?.strategic_recommendations,
    recommendationsType: typeof data?.strategic_recommendations
  });
  
  // Enhanced helper function to ensure we're working with an array
  const ensureArray = (data: any): any[] => {
    if (!data) return [];
    
    // If it's already an array, return it
    if (Array.isArray(data)) return data;
    
    // If it's a string, try to parse it as JSON
    if (typeof data === 'string' && data) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
        if (parsed && typeof parsed === 'object') return [parsed]; // Single object becomes array with one item
        return [{ description: data }]; // String as single item
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
  
  // Extract strategic recommendations from the report data
  const rawRecommendations = data?.strategic_recommendations;
  const recommendations = ensureArray(rawRecommendations);
  
  return (
    <div className="space-y-6">
      <SectionTitle title="Strategic Recommendations" />
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-3/4">
            <p className="text-gray-600 mb-6">
              Based on our analysis of {archetypeName}, we recommend the following strategies:
            </p>
            
            {/* DEBUG VIEW: Display the raw data structure */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="text-sm font-mono">Debug Information</h3>
              <div className="text-xs font-mono mt-2 overflow-auto max-h-32">
                <p>Raw Data Type: {typeof rawRecommendations}</p>
                <p>Is Array: {Array.isArray(rawRecommendations) ? 'Yes' : 'No'}</p>
                <p>Processed Count: {recommendations.length}</p>
              </div>
            </div>
            
            {/* SIMPLIFIED VIEW: Just show text content safely */}
            {recommendations.length > 0 ? (
              <div className="space-y-4">
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
          
          <div className="md:w-1/4 flex justify-center">
            <GnomeImage type="report" showDebug={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategicRecommendations;
