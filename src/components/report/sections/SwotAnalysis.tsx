
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArchetypeDetailedData } from '@/types/archetype';

interface SwotAnalysisProps {
  archetypeData: ArchetypeDetailedData;
}

const SwotAnalysis = ({ archetypeData }: SwotAnalysisProps) => {
  const { enhanced } = archetypeData;

  return (
    <Card>
      <CardHeader>
        <CardTitle>SWOT Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-700 mb-2">Strengths</h3>
            <ul className="list-disc list-inside space-y-2">
              {enhanced?.swot.strengths.map((strength, index) => (
                <li key={index} className="text-green-600">{strength}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-amber-50 rounded-lg">
            <h3 className="font-semibold text-amber-700 mb-2">Weaknesses</h3>
            <ul className="list-disc list-inside space-y-2">
              {enhanced?.swot.weaknesses.map((weakness, index) => (
                <li key={index} className="text-amber-600">{weakness}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-700 mb-2">Opportunities</h3>
            <ul className="list-disc list-inside space-y-2">
              {enhanced?.swot.opportunities.map((opportunity, index) => (
                <li key={index} className="text-blue-600">{opportunity}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-red-50 rounded-lg">
            <h3 className="font-semibold text-red-700 mb-2">Threats</h3>
            <ul className="list-disc list-inside space-y-2">
              {enhanced?.swot.threats.map((threat, index) => (
                <li key={index} className="text-red-600">{threat}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SwotAnalysis;
