
import React from 'react';
import { normalizeSwotData } from '@/utils/swot/normalizeSwotData';

interface SwotTabProps {
  report: any;
}

export const SwotTab = ({ report }: SwotTabProps) => {
  // Get SWOT data directly from the report
  const strengths = normalizeSwotData(report?.strengths);
  const weaknesses = normalizeSwotData(report?.weaknesses);
  const opportunities = normalizeSwotData(report?.opportunities);
  const threats = normalizeSwotData(report?.threats);

  if (!report) return <p>No SWOT analysis available</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Strengths</h4>
        <ul className="list-disc list-inside">
          {strengths.length > 0 ? 
            strengths.map((strength: string, idx: number) => (
              <li key={idx}>{strength}</li>
            )) : 
            <li className="text-gray-500 italic">No strengths available</li>
          }
        </ul>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Weaknesses</h4>
        <ul className="list-disc list-inside">
          {weaknesses.length > 0 ? 
            weaknesses.map((weakness: string, idx: number) => (
              <li key={idx}>{weakness}</li>
            )) : 
            <li className="text-gray-500 italic">No weaknesses available</li>
          }
        </ul>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Opportunities</h4>
        <ul className="list-disc list-inside">
          {opportunities.length > 0 ? 
            opportunities.map((opportunity: string, idx: number) => (
              <li key={idx}>{opportunity}</li>
            )) : 
            <li className="text-gray-500 italic">No opportunities available</li>
          }
        </ul>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Threats</h4>
        <ul className="list-disc list-inside">
          {threats.length > 0 ? 
            threats.map((threat: string, idx: number) => (
              <li key={idx}>{threat}</li>
            )) : 
            <li className="text-gray-500 italic">No threats available</li>
          }
        </ul>
      </div>
    </div>
  );
};
