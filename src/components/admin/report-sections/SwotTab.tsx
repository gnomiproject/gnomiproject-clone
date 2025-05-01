
import React, { useEffect } from 'react';

interface SwotTabProps {
  report: any;
}

export const SwotTab = ({ report }: SwotTabProps) => {
  // Add logging to help debug SWOT data
  useEffect(() => {
    console.log("[AdminSwotTab] Rendering with report data:", report);
    console.log("[AdminSwotTab] SWOT data fields:", {
      strengths: report?.strengths,
      weaknesses: report?.weaknesses,
      opportunities: report?.opportunities,
      threats: report?.threats,
      swot_analysis: report?.swot_analysis
    });
  }, [report]);
  
  // Helper function to get SWOT data safely
  const getSwotData = (data: any): string[] => {
    if (!data) {
      return [];
    }
    
    // If it's already an array, use it directly
    if (Array.isArray(data)) {
      return data.map(item => typeof item === 'string' ? item : String(item));
    }
    
    // If it's a string that looks like JSON, try to parse it
    if (typeof data === 'string' && (data.startsWith('[') || data.startsWith('{'))) {
      try {
        const parsed = JSON.parse(data);
        
        if (Array.isArray(parsed)) {
          return parsed.map(item => typeof item === 'string' ? item : String(item));
        } else if (typeof parsed === 'object' && parsed !== null) {
          // Handle case where it's an object with entries/items/points
          for (const key of ['entries', 'items', 'points']) {
            if (Array.isArray(parsed[key])) {
              return parsed[key].map((item: any) => typeof item === 'string' ? item : String(item));
            }
          }
          // If no recognized arrays inside, convert object properties to strings
          return Object.values(parsed).map(val => String(val));
        }
      } catch (e) {
        console.error("[AdminSwotTab] JSON parsing failed:", e);
      }
    }
    
    // If it's an object directly, check for common patterns
    if (data && typeof data === 'object') {
      // Check for common patterns in our data structure
      for (const key of ['entries', 'items', 'points']) {
        if (Array.isArray(data[key])) {
          return data[key].map((item: any) => {
            if (typeof item === 'string') return item;
            if (item && typeof item === 'object' && 'text' in item) return item.text;
            return String(item);
          });
        }
      }
      
      // If no recognized arrays found, convert object properties to strings
      return Object.values(data).filter(Boolean).map(val => String(val));
    }
    
    // Fallback: if it's a plain string or other format
    return typeof data === 'string' ? [data] : [String(data)];
  };
  
  // Check both direct fields and swot_analysis container
  const strengths = getSwotData(report?.strengths || report?.swot_analysis?.strengths);
  const weaknesses = getSwotData(report?.weaknesses || report?.swot_analysis?.weaknesses);
  const opportunities = getSwotData(report?.opportunities || report?.swot_analysis?.opportunities);
  const threats = getSwotData(report?.threats || report?.swot_analysis?.threats);

  // Log results for debugging
  console.log("[AdminSwotTab] Processed SWOT data:", {
    strengths,
    weaknesses,
    opportunities,
    threats
  });

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
