
import React from 'react';

interface RecommendationsTabProps {
  report: any;
}

export const RecommendationsTab = ({ report }: RecommendationsTabProps) => {
  // Check if strategic recommendations exist
  const hasRecommendations = report?.strategic_recommendations && 
    (Array.isArray(report.strategic_recommendations) ? 
      report.strategic_recommendations.length > 0 : 
      Object.keys(report.strategic_recommendations).length > 0);
  
  if (!hasRecommendations) return <p>No recommendations available</p>;
  
  // Handle array or object format for recommendations
  const recommendationsArray = Array.isArray(report.strategic_recommendations) 
    ? report.strategic_recommendations 
    : Object.values(report.strategic_recommendations);

  // Format metric field names to be more readable
  const formatMetricName = (metricKey: string): string => {
    // Remove prefixes like "Dise_" or "Util_"
    let formatted = metricKey.replace(/^(Dise|Util|Cost|SDOH|Risk|Gaps|Demo|Bene)_/i, '');
    
    // Replace underscores with spaces
    formatted = formatted.replace(/_/g, ' ');
    
    // Handle specific abbreviations
    formatted = formatted
      .replace(/\bRX\b/g, 'Prescription')
      .replace(/\bED\b/g, 'Emergency Department')
      .replace(/\bPMPY\b/g, 'Per Member Per Year')
      .replace(/\bPEPY\b/g, 'Per Employee Per Year')
      .replace(/\bPMPM\b/g, 'Per Member Per Month')
      .replace(/\bPEPM\b/g, 'Per Employee Per Month');
    
    return formatted;
  };

  return (
    <div className="space-y-6">
      {recommendationsArray.map((recommendation: any, index: number) => {
        // Extract fields with fallbacks for different data structures
        const title = recommendation.title || recommendation.name || `Recommendation ${index + 1}`;
        const description = recommendation.description || recommendation.content || '';
        const metrics = recommendation.metrics_references || recommendation.metrics || [];
        
        return (
          <div key={index} className="border rounded-lg p-4">
            <h4 className="text-lg font-medium mb-2">
              {index + 1}. {title}
            </h4>
            <div className="bg-gray-50 p-3 rounded mb-3">
              <p className="text-gray-700 whitespace-pre-line">{description}</p>
            </div>
            
            {Array.isArray(metrics) && metrics.length > 0 && (
              <div className="mt-3">
                <h5 className="text-sm font-medium text-gray-600 mb-2">Supporting Metrics:</h5>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {metrics.map((metric: string, idx: number) => (
                    <li key={idx}>{formatMetricName(metric)}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
