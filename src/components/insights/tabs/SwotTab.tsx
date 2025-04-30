
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
  // Get SWOT data with proper fallback strategy
  const strengths = normalizeSwotData(swotData?.strengths || archetypeData?.strengths);
  const weaknesses = normalizeSwotData(swotData?.weaknesses || archetypeData?.weaknesses);
  const opportunities = normalizeSwotData(swotData?.opportunities || archetypeData?.opportunities);
  const threats = normalizeSwotData(swotData?.threats || archetypeData?.threats);
  
  // Debug logging for troubleshooting
  useEffect(() => {
    console.log("SwotTab data available:", {
      directStrengths: archetypeData?.strengths ? normalizeSwotData(archetypeData.strengths).length : 0,
      directWeaknesses: archetypeData?.weaknesses ? normalizeSwotData(archetypeData.weaknesses).length : 0,
      directOpportunities: archetypeData?.opportunities ? normalizeSwotData(archetypeData.opportunities).length : 0,
      directThreats: archetypeData?.threats ? normalizeSwotData(archetypeData.threats).length : 0,
      normalizedStrengths: strengths.length,
      normalizedWeaknesses: weaknesses.length,
      normalizedOpportunities: opportunities.length,
      normalizedThreats: threats.length
    });
  }, [archetypeData, strengths, weaknesses, opportunities, threats]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">SWOT Analysis for {archetypeData.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h4 className="text-lg font-bold text-green-700 mb-4">Strengths</h4>
            <ul className="space-y-2">
              {strengths.map((strength: string, index: number) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>{strength}</span>
                </li>
              ))}
              
              {strengths.length === 0 && (
                <li className="text-gray-500 italic">No strengths data available</li>
              )}
            </ul>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h4 className="text-lg font-bold text-red-700 mb-4">Weaknesses</h4>
            <ul className="space-y-2">
              {weaknesses.map((weakness: string, index: number) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  <span>{weakness}</span>
                </li>
              ))}
              
              {weaknesses.length === 0 && (
                <li className="text-gray-500 italic">No weaknesses data available</li>
              )}
            </ul>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="text-lg font-bold text-blue-700 mb-4">Opportunities</h4>
            <ul className="space-y-2">
              {opportunities.map((opportunity: string, index: number) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span>{opportunity}</span>
                </li>
              ))}
              
              {opportunities.length === 0 && (
                <li className="text-gray-500 italic">No opportunities data available</li>
              )}
            </ul>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h4 className="text-lg font-bold text-amber-700 mb-4">Threats</h4>
            <ul className="space-y-2">
              {threats.map((threat: string, index: number) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                  <span>{threat}</span>
                </li>
              ))}
              
              {threats.length === 0 && (
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
