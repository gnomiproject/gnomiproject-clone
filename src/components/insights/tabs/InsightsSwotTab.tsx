
/**
 * InsightsSwotTab Component - Used EXCLUSIVELY for the Insights page (NOT Deep Dive Report)
 * Only processes data from level3_report_secure table
 */
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArchetypeDetailedData } from '@/types/archetype';
import { processInsightsSwotData } from '@/utils/swot/processInsightsSwotData';

interface InsightsSwotTabProps {
  archetypeData: ArchetypeDetailedData;
}

const InsightsSwotTab = ({ archetypeData }: InsightsSwotTabProps) => {
  // Add logging to see what data we're receiving
  useEffect(() => {
    console.log("[InsightsSwotTab] Received archetype data for INSIGHTS tab:", {
      id: archetypeData?.id || archetypeData?.archetype_id,
      name: archetypeData?.name || archetypeData?.archetype_name,
      dataSource: 'level3_report_secure'
    });

    // Enhanced debugging for SWOT data structure
    if (archetypeData) {
      // Log raw data for each SWOT section
      console.log("[InsightsSwotTab] Raw SWOT data structure:", {
        strengths: archetypeData.strengths,
        strengthsType: typeof archetypeData.strengths,
        isStrengthsArray: Array.isArray(archetypeData.strengths),
        weaknesses: archetypeData.weaknesses,
        opportunities: archetypeData.opportunities,
        threats: archetypeData.threats
      });
      
      // If strengths exist, log a sample
      if (archetypeData.strengths) {
        const sample = Array.isArray(archetypeData.strengths) 
          ? archetypeData.strengths[0] 
          : typeof archetypeData.strengths === 'object'
            ? JSON.stringify(archetypeData.strengths).slice(0, 100)
            : archetypeData.strengths;
        
        console.log("[InsightsSwotTab] Sample strength:", sample);
      }
    }
  }, [archetypeData]);

  // Check if we have the necessary data
  if (!archetypeData) {
    console.log("[InsightsSwotTab] No archetype data available");
    return <div className="p-4">Unable to load SWOT analysis data</div>;
  }
  
  // Process the SWOT data using the dedicated utility function for Insights page
  const { strengths, weaknesses, opportunities, threats } = processInsightsSwotData(archetypeData);
  
  // Log processed data
  console.log("[InsightsSwotTab] Processed SWOT data from level3_report_secure:", {
    strengthsCount: strengths.length,
    weaknessesCount: weaknesses.length,
    opportunitiesCount: opportunities.length,
    threatsCount: threats.length,
    firstStrength: strengths.length > 0 ? strengths[0] : 'none'
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

export default InsightsSwotTab;
