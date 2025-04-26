
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArchetypeDetailedData } from '@/types/archetype';

interface RecommendationsProps {
  archetypeData: ArchetypeDetailedData;
}

const Recommendations = ({ archetypeData }: RecommendationsProps) => {
  const { enhanced } = archetypeData;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Strategic Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {enhanced?.strategicPriorities.map((rec, index) => (
            <div 
              key={index}
              className="p-4 bg-purple-50 rounded-lg border border-purple-100"
            >
              <h3 className="font-semibold text-purple-800 mb-2">
                {index + 1}. {rec.title}
              </h3>
              <p className="text-purple-700">{rec.description}</p>
              
              {rec.metrics_references && rec.metrics_references.length > 0 && (
                <div className="mt-2">
                  <h4 className="text-sm font-medium text-purple-600">Supporting Metrics:</h4>
                  <ul className="list-disc list-inside text-sm text-purple-600">
                    {rec.metrics_references.map((metric, idx) => (
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
