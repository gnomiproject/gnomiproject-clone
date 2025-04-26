
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArchetypeDetailedData } from '@/types/archetype';

interface ExecutiveSummaryProps {
  archetypeData: ArchetypeDetailedData;
}

const ExecutiveSummary = ({ archetypeData }: ExecutiveSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Executive Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg text-gray-700">
          {archetypeData.long_description}
        </p>
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Key Characteristics</h3>
          <ul className="list-disc list-inside space-y-2">
            {archetypeData.key_characteristics?.map((char, index) => (
              <li key={index} className="text-gray-700">{char}</li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Common Industries</h3>
          <p className="text-gray-700">{archetypeData.industries}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExecutiveSummary;
