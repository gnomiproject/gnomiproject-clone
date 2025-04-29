
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArchetypeDetailedData } from '@/types/archetype';

interface SwotTabProps {
  archetypeData: ArchetypeDetailedData;
  swotData: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  hideRequestSection?: boolean;
}

const SwotTab = ({ archetypeData, swotData, hideRequestSection = false }: SwotTabProps) => {
  // Enhanced debug logging to identify SWOT data issues
  useEffect(() => {
    console.log("SwotTab received data:", {
      archetypeId: archetypeData?.id,
      archetypeName: archetypeData?.name,
      swotData: swotData || 'No SWOT data',
      strengths: swotData?.strengths?.length || 0,
      weaknesses: swotData?.weaknesses?.length || 0,
      opportunities: swotData?.opportunities?.length || 0,
      threats: swotData?.threats?.length || 0,
      rawStrengths: swotData?.strengths,
      rawWeaknesses: swotData?.weaknesses,
      rawOpportunities: swotData?.opportunities,
      rawThreats: swotData?.threats,
    });
    
    // Check if there's nested SWOT data in archetypeData.swot_analysis
    if (archetypeData?.swot_analysis) {
      console.log("Found nested SWOT data in archetypeData.swot_analysis", archetypeData.swot_analysis);
    }
  }, [archetypeData, swotData]);

  // Normalize the SWOT data to handle different formats and convert to string arrays if needed
  const normalizeSwotItems = (items: any): string[] => {
    if (!items) return [];
    
    // If it's already a string array, return it
    if (Array.isArray(items) && typeof items[0] === 'string') {
      return items;
    }
    
    // If it's an array of objects with a 'text' property (common format in our DB)
    if (Array.isArray(items) && typeof items[0] === 'object' && items[0]?.text) {
      return items.map(item => item.text || '');
    }
    
    // If it's a JSON string, try to parse it
    if (typeof items === 'string' && (items.startsWith('[') || items.startsWith('{'))) {
      try {
        const parsed = JSON.parse(items);
        if (Array.isArray(parsed)) {
          return parsed.map(item => typeof item === 'string' ? item : (item.text || JSON.stringify(item)));
        }
      } catch (e) {
        // If parsing fails, treat as a single string
        return [items];
      }
    }
    
    // If it's a plain string (not JSON), treat as a single item
    if (typeof items === 'string') {
      return [items];
    }
    
    // Fallback: convert whatever we have to string and return as array
    return [String(items)];
  };

  // Prepare normalized SWOT data
  const strengths = normalizeSwotItems(swotData?.strengths);
  const weaknesses = normalizeSwotItems(swotData?.weaknesses);
  const opportunities = normalizeSwotItems(swotData?.opportunities);
  const threats = normalizeSwotItems(swotData?.threats);

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
