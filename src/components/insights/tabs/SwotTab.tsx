
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArchetypeDetailedData } from '@/types/archetype';
import { useDebug } from '@/components/debug/DebugProvider';
import DataSourceInfo from '@/components/debug/DataSourceInfo';

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
  const { showDataSource, showRawValues } = useDebug();
  
  // Add debug logging
  console.log("SwotTab received data:", {
    archetypeData: archetypeData?.id,
    strengths: swotData?.strengths?.length || 0,
    weaknesses: swotData?.weaknesses?.length || 0,
    opportunities: swotData?.opportunities?.length || 0,
    threats: swotData?.threats?.length || 0,
  });
  
  // Helper function to render items with or without debug info
  const renderItem = (item: string, index: number, category: string) => {
    if (showDataSource) {
      return (
        <li key={index} className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <DataSourceInfo
            tableName="Analysis_Archetype_SWOT"
            columnName={category}
            rawValue={item}
            formattedValue={item}
            showRawValues={showRawValues}
          />
        </li>
      );
    }
    
    return (
      <li key={index} className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-green-500"></div>
        <span>{item}</span>
      </li>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          SWOT Analysis for {archetypeData.name}
          {showDataSource && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded ml-2">
              Source: archetypes_detailed.ts or supabase
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h4 className="text-lg font-bold text-green-700 mb-4">Strengths</h4>
            <ul className="space-y-2">
              {(swotData.strengths || []).map((strength: string, index: number) => 
                renderItem(strength, index, "strengths")
              )}
              
              {(!swotData.strengths || swotData.strengths.length === 0) && (
                <li className="text-gray-500 italic">No strengths data available</li>
              )}
            </ul>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h4 className="text-lg font-bold text-red-700 mb-4">Weaknesses</h4>
            <ul className="space-y-2">
              {(swotData.weaknesses || []).map((weakness: string, index: number) => 
                renderItem(weakness, index, "weaknesses")
              )}
              
              {(!swotData.weaknesses || swotData.weaknesses.length === 0) && (
                <li className="text-gray-500 italic">No weaknesses data available</li>
              )}
            </ul>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="text-lg font-bold text-blue-700 mb-4">Opportunities</h4>
            <ul className="space-y-2">
              {(swotData.opportunities || []).map((opportunity: string, index: number) => 
                renderItem(opportunity, index, "opportunities")
              )}
              
              {(!swotData.opportunities || swotData.opportunities.length === 0) && (
                <li className="text-gray-500 italic">No opportunities data available</li>
              )}
            </ul>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h4 className="text-lg font-bold text-amber-700 mb-4">Threats</h4>
            <ul className="space-y-2">
              {(swotData.threats || []).map((threat: string, index: number) => 
                renderItem(threat, index, "threats")
              )}
              
              {(!swotData.threats || swotData.threats.length === 0) && (
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
