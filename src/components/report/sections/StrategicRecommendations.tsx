
import React from 'react';
import { Lightbulb } from 'lucide-react';

interface StrategicRecommendationsProps {
  reportData: any;
  averageData: any;
}

const StrategicRecommendations = ({ reportData, averageData }: StrategicRecommendationsProps) => {
  // Gnome image
  const gnomeImage = '/assets/gnomes/gnome_charts.png';

  const recommendations = reportData.strategic_recommendations || [];
  const hasRecommendations = recommendations && recommendations.length > 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-6">Strategic Recommendations</h1>
          <p className="text-lg">
            This section provides tailored recommendations based on your organization's unique profile.
            {!hasRecommendations && " We'll expand this section in the next update."}
          </p>
        </div>
        <div className="md:w-1/3 flex justify-center">
          <img
            src={gnomeImage}
            alt="Recommendations Gnome"
            className="max-h-64 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/gnomes/placeholder.svg';
            }}
          />
        </div>
      </div>

      {!hasRecommendations ? (
        <div className="bg-blue-50 p-8 rounded-lg text-center">
          <Lightbulb className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
          <p>The full strategic recommendations will be available in the next update.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {recommendations.map((rec: any, index: number) => (
            <div key={index} className="bg-white border rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2">{rec.title}</h3>
              <p className="text-gray-700">{rec.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StrategicRecommendations;
