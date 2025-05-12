
import React, { memo, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { ensureArray } from '@/utils/array/arrayUtils';
import { formatFieldLabel } from '@/utils/reports/fieldFormatters';

interface KeyPrioritiesProps {
  recommendations: any[];
}

// Base component implementation
const KeyPrioritiesBase: React.FC<KeyPrioritiesProps> = ({ recommendations }) => {
  // Use ensureArray to safely handle recommendations data
  const safeRecommendations = useMemo(() => {
    console.log('[KeyPriorities] Processing recommendations:', {
      originalType: Array.isArray(recommendations) ? 'array' : typeof recommendations,
      length: Array.isArray(recommendations) ? recommendations.length : 'unknown'
    });
    return ensureArray<any>(recommendations, 'recommendations');
  }, [recommendations]);
  
  // Format metric field names to be more readable
  const formatMetricName = (metricKey: string): string => {
    return formatFieldLabel(metricKey);
  };
  
  // Early return for empty data case
  if (!safeRecommendations.length) {
    return (
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Strategic Recommendations</h3>
        <p className="text-gray-500 italic">No strategic recommendations are available at this time.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Strategic Recommendations</h3>
      <div className="space-y-6">
        {safeRecommendations.map((rec, index) => (
          <div 
            key={index}
            className="flex gap-4 items-start p-4 rounded-lg border border-gray-100 bg-white shadow-sm"
          >
            <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
              <Star className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-lg">
                {rec.title || rec.name || `Priority ${index + 1}`}
              </h4>
              <p className="text-gray-600 mt-2 whitespace-pre-line">
                {rec.description || rec.content || 'No description available'}
              </p>
              
              {/* Show metrics references if available */}
              {(rec.metrics_references || rec.metrics) && (
                <div className="mt-3">
                  <h5 className="text-xs font-medium text-gray-600">Related Metrics:</h5>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {ensureArray(rec.metrics_references || rec.metrics).map((metric: string, i: number) => (
                      <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        {formatMetricName(metric)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Export a memoized version to prevent unnecessary re-renders
const KeyPriorities = memo(KeyPrioritiesBase);
export default KeyPriorities;
