
import React from 'react';
import { insightReportSchema } from '@/schemas/insightReportSchema';

interface OverviewTabProps {
  report: any;
}

export const OverviewTab = ({ report }: OverviewTabProps) => {
  if (!report) return <p>No overview data available</p>;

  // Get the fields from our schema
  const overviewFields = insightReportSchema.overview.fields;

  return (
    <div className="space-y-6">
      {/* Archetype Name and Family */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {report.archetype_name || 'Unnamed Archetype'}
        </h1>
        <p className="text-lg text-gray-600 mt-1">
          Family: {report.family_name || 'Unknown Family'}
        </p>
      </div>

      {/* Long Description */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Detailed Description</h3>
        <p className="text-gray-700 whitespace-pre-line">
          {report.long_description || 'No detailed description available'}
        </p>
      </div>

      {/* Industries */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Common Industries</h3>
        <p className="text-gray-700">
          {report.industries || 'No industry information available'}
        </p>
      </div>

      {/* Key Characteristics */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Key Characteristics</h3>
        {report.key_characteristics ? (
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {(typeof report.key_characteristics === 'string' 
              ? report.key_characteristics.split('\n')
              : Array.isArray(report.key_characteristics)
              ? report.key_characteristics
              : []
            ).map((char: string, index: number) => (
              <li key={index}>{char}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No key characteristics available</p>
        )}
      </div>
    </div>
  );
};
