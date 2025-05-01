
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArchetypeDetailedData } from '@/types/archetype';

interface SwotTabProps {
  archetypeData: ArchetypeDetailedData;
}

const SwotTab = ({ archetypeData }: SwotTabProps) => {
  // Add logging to see what data we're receiving
  useEffect(() => {
    console.log("[SwotTab] Received archetype data:", archetypeData);
    console.log("[SwotTab] Raw SWOT data fields:", {
      strengths: archetypeData?.strengths,
      weaknesses: archetypeData?.weaknesses,
      opportunities: archetypeData?.opportunities,
      threats: archetypeData?.threats,
      swot_analysis: archetypeData?.swot_analysis
    });
  }, [archetypeData]);

  // Check if we have the necessary data
  if (!archetypeData) {
    console.log("[SwotTab] No archetype data available");
    return <div className="p-4">Unable to load SWOT analysis data</div>;
  }
  
  // Helper function to safely process SWOT data with minimal transformation
  const getSwotData = (data: any): string[] => {
    if (!data) {
      console.log("[SwotTab] No SWOT data provided to getSwotData");
      return [];
    }

    console.log("[SwotTab] Processing SWOT data:", {
      dataType: typeof data,
      isArray: Array.isArray(data),
      rawData: data
    });
    
    // If it's already an array, use it directly
    if (Array.isArray(data)) {
      return data.map(item => typeof item === 'string' ? item : String(item));
    }
    
    // If it's a string that looks like JSON, try to parse it
    if (typeof data === 'string' && (data.startsWith('[') || data.startsWith('{'))) {
      try {
        const parsed = JSON.parse(data);
        console.log("[SwotTab] Parsed JSON data:", parsed);
        
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
        console.error("[SwotTab] JSON parsing failed:", e);
      }
    }
    
    // If it's an object directly, check for common patterns
    if (data && typeof data === 'object') {
      console.log("[SwotTab] Processing object data:", data);
      
      // Check for common patterns in our data structure
      for (const key of ['entries', 'items', 'points']) {
        if (Array.isArray(data[key])) {
          console.log(`[SwotTab] Found array in '${key}' property:`, data[key]);
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
  const strengths = getSwotData(archetypeData.strengths || (archetypeData.swot_analysis?.strengths));
  const weaknesses = getSwotData(archetypeData.weaknesses || (archetypeData.swot_analysis?.weaknesses));
  const opportunities = getSwotData(archetypeData.opportunities || (archetypeData.swot_analysis?.opportunities));
  const threats = getSwotData(archetypeData.threats || (archetypeData.swot_analysis?.threats));
  
  // Log processed data
  console.log("[SwotTab] Processed SWOT data:", {
    strengths,
    weaknesses,
    opportunities,
    threats
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">SWOT Analysis for {archetypeData.name || archetypeData.archetype_name || "This Archetype"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h4 className="text-lg font-bold text-green-700 mb-4">Strengths</h4>
            <ul className="space-y-2">
              {strengths && strengths.length > 0 ? (
                strengths.map((strength: string, index: number) => (
                  <li key={`strength-${index}`} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span>{strength}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 italic">No strengths data available</li>
              )}
            </ul>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h4 className="text-lg font-bold text-red-700 mb-4">Weaknesses</h4>
            <ul className="space-y-2">
              {weaknesses && weaknesses.length > 0 ? (
                weaknesses.map((weakness: string, index: number) => (
                  <li key={`weakness-${index}`} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    <span>{weakness}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 italic">No weaknesses data available</li>
              )}
            </ul>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="text-lg font-bold text-blue-700 mb-4">Opportunities</h4>
            <ul className="space-y-2">
              {opportunities && opportunities.length > 0 ? (
                opportunities.map((opportunity: string, index: number) => (
                  <li key={`opportunity-${index}`} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <span>{opportunity}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 italic">No opportunities data available</li>
              )}
            </ul>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h4 className="text-lg font-bold text-amber-700 mb-4">Threats</h4>
            <ul className="space-y-2">
              {threats && threats.length > 0 ? (
                threats.map((threat: string, index: number) => (
                  <li key={`threat-${index}`} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                    <span>{threat}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 italic">No threats data available</li>
              )}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SwotTab;
