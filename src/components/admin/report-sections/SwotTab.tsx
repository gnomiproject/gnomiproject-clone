
import React from 'react';
import { useDebug } from '@/components/debug/DebugProvider';
import DataSourceInfo from '@/components/debug/DataSourceInfo';

interface SwotTabProps {
  report: any;
}

export const SwotTab = ({ report }: SwotTabProps) => {
  const { showDataSource, showRawValues } = useDebug();
  
  if (!report) return <p>No SWOT analysis available</p>;

  // Helper function to render items with or without debug info
  const renderItem = (item: string, index: number, category: string) => {
    if (showDataSource) {
      return (
        <li key={index}>
          <DataSourceInfo
            tableName="Analysis_Archetype_SWOT"
            columnName={category}
            rawValue={item}
            formattedValue={item}
            showRawValues={showRawValues}
          />
        </li>
      );
    }
    
    return <li key={index}>{item}</li>;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Strengths</h4>
        <ul className="list-disc list-inside">
          {report.strengths?.map((strength: string, idx: number) => 
            renderItem(strength, idx, "strengths")
          ) || <li>No strengths available</li>}
        </ul>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Weaknesses</h4>
        <ul className="list-disc list-inside">
          {report.weaknesses?.map((weakness: string, idx: number) => 
            renderItem(weakness, idx, "weaknesses")
          ) || <li>No weaknesses available</li>}
        </ul>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Opportunities</h4>
        <ul className="list-disc list-inside">
          {report.opportunities?.map((opportunity: string, idx: number) => 
            renderItem(opportunity, idx, "opportunities")
          ) || <li>No opportunities available</li>}
        </ul>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Threats</h4>
        <ul className="list-disc list-inside">
          {report.threats?.map((threat: string, idx: number) => 
            renderItem(threat, idx, "threats")
          ) || <li>No threats available</li>}
        </ul>
      </div>
    </div>
  );
};
