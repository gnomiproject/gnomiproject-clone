
import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArchetypeDetailedData } from '@/types/archetype';
import { ensureArray } from '@/utils/array/arrayUtils';

interface RecommendationsProps {
  archetypeData: ArchetypeDetailedData;
}

const Recommendations = ({ archetypeData }: RecommendationsProps) => {
  // Extract recommendations from either enhanced.strategicPriorities or strategic_recommendations
  const recommendations = useMemo(() => {
    console.log('[Recommendations] Processing data:', {
      hasEnhanced: !!archetypeData?.enhanced,
      hasStrategicPriorities: !!archetypeData?.enhanced?.strategicPriorities,
      hasStrategicRecommendations: !!archetypeData?.strategic_recommendations,
      dataType: typeof archetypeData?.strategic_recommendations
    });
    
    // Check for enhanced.strategicPriorities first (legacy format)
    if (archetypeData?.enhanced?.strategicPriorities) {
      return archetypeData.enhanced.strategicPriorities;
    }
    
    // Then check for strategic_recommendations (new format)
    if (archetypeData?.strategic_recommendations) {
      // Ensure we have an array of recommendations
      return ensureArray(archetypeData.strategic_recommendations);
    }
    
    // Return empty array if no recommendations found
    return [];
  }, [archetypeData]);

  // If no recommendations, show empty state
  if (recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Strategic Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No strategic recommendations available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Strategic Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {recommendations.map((rec, index) => (
            <div 
              key={index}
              className="p-4 bg-purple-50 rounded-lg border border-purple-100"
            >
              <h3 className="font-semibold text-purple-800 mb-2">
                {index + 1}. {rec.title || rec.name || `Recommendation ${index + 1}`}
              </h3>
              <p className="text-purple-700">{rec.description || rec.content || ''}</p>
              
              {(rec.metrics_references || rec.metrics) && (rec.metrics_references?.length > 0 || rec.metrics?.length > 0) && (
                <div className="mt-2">
                  <h4 className="text-sm font-medium text-purple-600">Supporting Metrics:</h4>
                  <ul className="list-disc list-inside text-sm text-purple-600">
                    {(rec.metrics_references || rec.metrics || []).map((metric, idx) => (
                      <li key={idx}>{metric}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Recommendations;
