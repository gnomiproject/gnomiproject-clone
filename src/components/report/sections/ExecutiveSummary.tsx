
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArchetypeDetailedData } from '@/types/archetype';
import { ensureArray } from '@/utils/ensureArray';

interface ExecutiveSummaryProps {
  archetypeData: ArchetypeDetailedData;
}

const ExecutiveSummary = ({ archetypeData }: ExecutiveSummaryProps) => {
  // Use the ensureArray utility to safely handle key_characteristics
  const characteristics = ensureArray<string>(archetypeData.key_characteristics);

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
          {characteristics.length > 0 ? (
            <ul className="list-disc list-inside space-y-2">
              {characteristics.map((char, index) => (
                <li key={index} className="text-gray-700">{char}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No key characteristics available</p>
          )}
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
