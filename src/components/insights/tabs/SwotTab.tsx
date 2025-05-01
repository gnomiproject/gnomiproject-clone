
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArchetypeDetailedData } from '@/types/archetype';
import { normalizeSwotData } from '@/utils/swot/normalizeSwotData';

interface SwotTabProps {
  archetypeData: ArchetypeDetailedData;
}

const SwotTab = ({ archetypeData }: SwotTabProps) => {
  // Add logging to understand what data we're getting
  useEffect(() => {
    console.log("SwotTab received data:", {
      archetypeId: archetypeData ? archetypeData.id || 'unknown' : null,
      strengths: archetypeData?.strengths ? typeof archetypeData.strengths : 'undefined',
      weaknesses: archetypeData?.weaknesses ? typeof archetypeData.weaknesses : 'undefined',
      opportunities: archetypeData?.opportunities ? typeof archetypeData.opportunities : 'undefined',
      threats: archetypeData?.threats ? typeof archetypeData.threats : 'undefined'
    });
    
    // Log the actual data structures
    console.log("SwotTab raw data:", {
      strengths: archetypeData?.strengths,
      weaknesses: archetypeData?.weaknesses,
      opportunities: archetypeData?.opportunities,
      threats: archetypeData?.threats
    });
    
    if (archetypeData?.strengths) {
      console.log("SwotTab strengths sample:", 
        JSON.stringify(archetypeData.strengths).substring(0, 100) + '...'
      );
    }
  }, [archetypeData]);

  // Check if we have the necessary data
  if (!archetypeData) {
    console.log("SwotTab: No archetype data available");
    return <div className="p-4">Unable to load SWOT analysis data</div>;
  }
  
  // Get SWOT data directly from the level3 table data
  console.log("SwotTab: About to normalize data");
  
  // We only look for direct properties on the archetypeData object
  const strengths = normalizeSwotData(archetypeData.strengths);
  const weaknesses = normalizeSwotData(archetypeData.weaknesses);
  const opportunities = normalizeSwotData(archetypeData.opportunities);
  const threats = normalizeSwotData(archetypeData.threats);
  
  // Log what we got after normalization
  console.log("SwotTab normalized data:", {
    strengthsLength: strengths.length,
    weaknessesLength: weaknesses.length,
    opportunitiesLength: opportunities.length,
    threatsLength: threats.length,
    strengthsSample: strengths.length > 0 ? strengths[0] : 'none',
    weaknessesSample: weaknesses.length > 0 ? weaknesses[0] : 'none',
    strengthsIsArray: Array.isArray(strengths),
    fullStrengths: strengths
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
                strengths.map((strength: string, index: number) => {
                  console.log(`Rendering strength #${index}:`, strength);
                  return (
                    <li key={`strength-${index}`} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span>{strength}</span>
                    </li>
                  );
                })
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
