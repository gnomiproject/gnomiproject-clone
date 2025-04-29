
import React, { memo } from 'react';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface KeyPrioritiesProps {
  recommendations: any[];
}

// Base component implementation
const KeyPrioritiesBase: React.FC<KeyPrioritiesProps> = ({ recommendations }) => {
  // Get the top 3 recommendations (or fewer if there aren't 3)
  const topRecommendations = recommendations.slice(0, 3);

  if (topRecommendations.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Key Priorities</h3>
        <p className="text-gray-500 italic">No strategic recommendations are available at this time.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Key Priorities</h3>
      <div className="space-y-4">
        {topRecommendations.map((rec, index) => (
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
