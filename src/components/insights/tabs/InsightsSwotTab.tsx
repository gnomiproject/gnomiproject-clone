
/**
 * InsightsSwotTab Component - Used EXCLUSIVELY for the Insights page (NOT Deep Dive Report)
 * Only processes data from level3_report_secure table
 */
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArchetypeDetailedData } from '@/types/archetype';
import { processInsightsSwotData } from '@/utils/swot/processInsightsSwotData';
import { Badge } from '@/components/ui/badge';

interface InsightsSwotTabProps {
  archetypeData: ArchetypeDetailedData;
}

const InsightsSwotTab = ({ archetypeData }: InsightsSwotTabProps) => {
  // Enhanced debugging for received data
  useEffect(() => {
    console.log("[InsightsSwotTab] Received archetype data:", {
      id: archetypeData?.id || archetypeData?.archetype_id,
      name: archetypeData?.name || archetypeData?.archetype_name,
      hasStrengths: !!archetypeData?.strengths,
      hasSwot: !!archetypeData?.swot_analysis,
      strengthsType: archetypeData?.strengths ? typeof archetypeData.strengths : 'undefined'
    });

    // Log raw SWOT data structure for debugging
    if (archetypeData) {
      console.log("[InsightsSwotTab] Raw SWOT data structure:", {
        strengths: archetypeData.strengths,
        strengthsType: typeof archetypeData.strengths,
        isStrengthsArray: Array.isArray(archetypeData.strengths),
        weaknesses: archetypeData.weaknesses,
        opportunities: archetypeData.opportunities,
        threats: archetypeData.threats
      });
    }
  }, [archetypeData]);

  // Check if we have the necessary data
  if (!archetypeData) {
    console.log("[InsightsSwotTab] No archetype data available");
    return <div className="p-4">Unable to load SWOT analysis data</div>;
  }
  
  // Process the SWOT data using the dedicated utility function
  const { strengths, weaknesses, opportunities, threats } = processInsightsSwotData(archetypeData);
  
  // Log processed data
  console.log("[InsightsSwotTab] Processed SWOT data:", {
    strengthsCount: strengths.length,
    weaknessesCount: weaknesses.length,
    opportunitiesCount: opportunities.length,
    threatsCount: threats.length
  });

  // Get the proper display name
  const displayName = archetypeData.name || archetypeData.archetype_name || "This Archetype";

  return (
    <div className="space-y-6">
      {/* Archetype Context Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">Your Archetype Match</Badge>
        </div>
        <p className="text-blue-800 text-sm">
          The SWOT analysis below reflects the <strong>{displayName}</strong> you most closely match based on your assessment responses.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">SWOT Analysis for {displayName}</CardTitle>
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
    </div>
  );
};

export default InsightsSwotTab;
