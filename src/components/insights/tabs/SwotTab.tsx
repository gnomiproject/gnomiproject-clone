
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArchetypeDetailedData } from '@/types/archetype';
import { normalizeSwotData } from '@/utils/swot/normalizeSwotData';

interface SwotTabProps {
  archetypeData: ArchetypeDetailedData;
  swotData?: {
    strengths?: any;
    weaknesses?: any;
    opportunities?: any;
    threats?: any;
  };
  hideRequestSection?: boolean;
}

const SwotTab = ({ archetypeData, swotData, hideRequestSection = false }: SwotTabProps) => {
  if (!archetypeData) {
    console.error("SwotTab: Missing archetypeData");
    return <div className="p-4">Unable to load SWOT analysis data</div>;
  }
  
  // Get SWOT data with proper fallback strategy
  // We check multiple possible locations where SWOT data might be stored
  const strengths = normalizeSwotData(
    swotData?.strengths || 
    archetypeData?.strengths || 
    archetypeData?.swot_analysis?.strengths ||
    archetypeData?.enhanced?.swot?.strengths
  );
  
  const weaknesses = normalizeSwotData(
    swotData?.weaknesses || 
    archetypeData?.weaknesses || 
    archetypeData?.swot_analysis?.weaknesses ||
    archetypeData?.enhanced?.swot?.weaknesses
  );
  
  const opportunities = normalizeSwotData(
    swotData?.opportunities || 
    archetypeData?.opportunities || 
    archetypeData?.swot_analysis?.opportunities ||
    archetypeData?.enhanced?.swot?.opportunities
  );
  
  const threats = normalizeSwotData(
    swotData?.threats || 
    archetypeData?.threats || 
    archetypeData?.swot_analysis?.threats ||
    archetypeData?.enhanced?.swot?.threats
  );
  
  // Debug logging for troubleshooting
  useEffect(() => {
    console.log("SwotTab data sources:", {
      directStrengths: archetypeData?.strengths ? 
        "Available" + (Array.isArray(archetypeData.strengths) ? ` (${archetypeData.strengths.length} items)` : " (not array)") : "Not available",
      swotAnalysisStrengths: archetypeData?.swot_analysis?.strengths ? 
        "Available" + (Array.isArray(archetypeData.swot_analysis.strengths) ? ` (${archetypeData.swot_analysis.strengths.length} items)` : " (not array)") : "Not available",
      enhancedSwotStrengths: archetypeData?.enhanced?.swot?.strengths ? 
        "Available" + (Array.isArray(archetypeData.enhanced?.swot?.strengths) ? ` (${archetypeData.enhanced?.swot?.strengths.length} items)` : " (not array)") : "Not available",
      afterNormalization: {
        strengths: strengths.length,
        weaknesses: weaknesses.length,
        opportunities: opportunities.length,
        threats: threats.length
      }
    });
  }, [archetypeData, strengths, weaknesses, opportunities, threats]);

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
              {strengths.length > 0 ? (
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
              {weaknesses.length > 0 ? (
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
              {opportunities.length > 0 ? (
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
              {threats.length > 0 ? (
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
