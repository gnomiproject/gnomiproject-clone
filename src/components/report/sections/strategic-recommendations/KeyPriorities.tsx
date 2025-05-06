
import React, { memo, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { memoizedEnsureArray } from '@/utils/ensureArray';

interface KeyPrioritiesProps {
  recommendations: any[];
}

// Base component implementation
const KeyPrioritiesBase: React.FC<KeyPrioritiesProps> = ({ recommendations }) => {
  // Use memoizedEnsureArray to safely handle recommendations data
  const safeRecommendations = useMemo(() => 
    memoizedEnsureArray<any>(recommendations, 'recommendations'),
  [recommendations]);
  
  // Show all recommendations instead of limiting to top 3
  const allRecommendations = safeRecommendations;

  // Early return for empty data case
  if (allRecommendations.length === 0) {
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
      <div className="space-y-4">
        {allRecommendations.map((rec, index) => (
          <div 
            key={index}
            className="flex gap-4 items-start p-4 rounded-lg border border-gray-100 bg-white shadow-sm"
          >
            <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
              <Star className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-lg">{rec.title || `Priority ${index + 1}`}</h4>
              <p className="text-gray-600 mt-1">{rec.description || 'No description available'}</p>
              {rec.metrics_references && rec.metrics_references.length > 0 && (
                <div className="mt-3">
                  <h5 className="text-xs font-medium text-gray-600">Related Metrics:</h5>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {rec.metrics_references.map((metric: string, i: number) => (
                      <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                        {metric}
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
