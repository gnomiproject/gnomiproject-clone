
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArchetypeDetailedData } from '@/types/archetype';
import { ensureArray } from '@/utils/array/ensureArray';

interface SwotTabProps {
  archetypeData: ArchetypeDetailedData;
}

const SwotTab = ({ archetypeData }: SwotTabProps) => {
  // Add logging to see what data we're receiving
  useEffect(() => {
    console.log("[SwotTab] Received archetype data:", archetypeData);
    console.log("[SwotTab] SWOT data fields:", {
      swotAnalysis: archetypeData?.swot_analysis ? typeof archetypeData.swot_analysis : 'Not available'
    });
  }, [archetypeData]);

  // Check if we have the necessary data
  if (!archetypeData) {
    console.log("[SwotTab] No archetype data available");
    return <div className="p-4">Unable to load SWOT analysis data</div>;
  }
  
  // Use our ensureArray utility for consistent handling
  const getSwotData = (data: any): string[] => {
    return ensureArray(data).map(item => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object' && 'text' in item) return item.text;
      return String(item);
    });
  };

  // Get SWOT components from the swot_analysis object
  let strengths: string[] = [];
  let weaknesses: string[] = [];
  let opportunities: string[] = [];
  let threats: string[] = [];
  
  // Check for swot_analysis object first
  if (archetypeData.swot_analysis && typeof archetypeData.swot_analysis === 'object') {
    const swotObj = archetypeData.swot_analysis as Record<string, any>;
    strengths = getSwotData(swotObj.strengths);
    weaknesses = getSwotData(swotObj.weaknesses);
    opportunities = getSwotData(swotObj.opportunities);
    threats = getSwotData(swotObj.threats);
  }
  
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
