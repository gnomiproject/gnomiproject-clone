
import React from 'react';

interface SwotTabProps {
  report: any;
}

export const SwotTab = ({ report }: SwotTabProps) => {
  if (!report) return <p>No SWOT analysis available</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Strengths</h4>
        <ul className="list-disc list-inside">
          {report.strengths?.map((strength: string, idx: number) => (
            <li key={idx}>{strength}</li>
          )) || <li>No strengths available</li>}
        </ul>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Weaknesses</h4>
        <ul className="list-disc list-inside">
          {report.weaknesses?.map((weakness: string, idx: number) => (
            <li key={idx}>{weakness}</li>
          )) || <li>No weaknesses available</li>}
        </ul>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Opportunities</h4>
        <ul className="list-disc list-inside">
          {report.opportunities?.map((opportunity: string, idx: number) => (
            <li key={idx}>{opportunity}</li>
          )) || <li>No opportunities available</li>}
        </ul>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Threats</h4>
        <ul className="list-disc list-inside">
          {report.threats?.map((threat: string, idx: number) => (
            <li key={idx}>{threat}</li>
          )) || <li>No threats available</li>}
        </ul>
      </div>
    </div>
  );
};
