
import React from 'react';

interface SwotTabProps {
  report: any;
}

export const SwotTab = ({ report }: SwotTabProps) => {
  // Helper function to normalize SWOT data
  const normalizeSwotData = (data: any): string[] => {
    if (!data) return [];
    
    // If it's already an array of strings, return it
    if (Array.isArray(data) && typeof data[0] === 'string') {
      return data;
    }
    
    // If it's an array of objects with text property
    if (Array.isArray(data) && typeof data[0] === 'object' && data[0]?.text) {
      return data.map(item => item.text || '');
    }
    
    // If it's a JSON string, parse it
    if (typeof data === 'string' && (data.startsWith('[') || data.startsWith('{'))) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          return parsed.map(item => typeof item === 'string' ? item : (item.text || JSON.stringify(item)));
        }
      } catch (e) {
        return [data];
      }
    }
    
    // For a single string
    if (typeof data === 'string') {
      return [data];
    }
    
    return [];
  };

  // Get SWOT data from the report or swot_analysis
  const swotAnalysis = report?.swot_analysis || {};
  
  const strengths = normalizeSwotData(report?.strengths || (swotAnalysis?.strengths));
  const weaknesses = normalizeSwotData(report?.weaknesses || (swotAnalysis?.weaknesses));
  const opportunities = normalizeSwotData(report?.opportunities || (swotAnalysis?.opportunities));
  const threats = normalizeSwotData(report?.threats || (swotAnalysis?.threats));

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
