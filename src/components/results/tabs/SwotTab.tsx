
import React from 'react';
import { ArchetypeDetailedData } from '@/types/archetype';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, AlertTriangle, Lightbulb, Shield } from 'lucide-react';

interface SwotTabProps {
  archetypeData: ArchetypeDetailedData;
}

const SwotTab = ({ archetypeData }: SwotTabProps) => {
  const color = archetypeData.hexColor ? 
    archetypeData.hexColor : 
    `var(--color-archetype-${archetypeData.id})`;
  
  // Extract SWOT data from the new data structure
  const strengths = Array.isArray(archetypeData.strengths) ? archetypeData.strengths :
    archetypeData.enhanced?.swot?.strengths || [];
  
  const weaknesses = Array.isArray(archetypeData.weaknesses) ? archetypeData.weaknesses :
    archetypeData.enhanced?.swot?.weaknesses || [];
  
  const opportunities = Array.isArray(archetypeData.opportunities) ? archetypeData.opportunities :
    archetypeData.enhanced?.swot?.opportunities || [];
  
  const threats = Array.isArray(archetypeData.threats) ? archetypeData.threats :
    archetypeData.enhanced?.swot?.threats || [];

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-xl font-bold">SWOT Analysis</h2>
        <Button 
          variant="outline" 
          className="mt-4 md:mt-0"
          style={{ color: color, borderColor: color }}
        >
          Get Strategic Implementation Plan
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-green-200">
          <CardHeader className="bg-green-50 pb-3">
            <CardTitle className="flex items-center text-green-700">
              <TrendingUp className="mr-2 h-5 w-5" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {strengths.length > 0 ? (
              <ul className="space-y-2">
                {strengths.slice(0, 5).map((strength, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full mt-2 bg-green-500"></div>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No data available</p>
            )}
          </CardContent>
        </Card>
        
        <Card className="border-orange-200">
          <CardHeader className="bg-orange-50 pb-3">
            <CardTitle className="flex items-center text-orange-700">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Weaknesses
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {weaknesses.length > 0 ? (
              <ul className="space-y-2">
                {weaknesses.slice(0, 5).map((weakness, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full mt-2 bg-orange-500"></div>
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No data available</p>
            )}
          </CardContent>
        </Card>
        
        <Card className="border-blue-200">
          <CardHeader className="bg-blue-50 pb-3">
            <CardTitle className="flex items-center text-blue-700">
              <Lightbulb className="mr-2 h-5 w-5" />
              Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {opportunities.length > 0 ? (
              <ul className="space-y-2">
                {opportunities.slice(0, 5).map((opportunity, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full mt-2 bg-blue-500"></div>
                    <span>{opportunity}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No data available</p>
            )}
          </CardContent>
        </Card>
        
        <Card className="border-red-200">
          <CardHeader className="bg-red-50 pb-3">
            <CardTitle className="flex items-center text-red-700">
              <Shield className="mr-2 h-5 w-5" />
              Threats
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {threats.length > 0 ? (
              <ul className="space-y-2">
                {threats.slice(0, 5).map((threat, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full mt-2 bg-red-500"></div>
                    <span>{threat}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No data available</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8 px-4 py-6 bg-gray-50 rounded-lg text-center">
        <p className="font-medium mb-2" style={{ color: color }}>
          Want to explore strategic implications in detail?
        </p>
        <p className="text-gray-600 text-sm">
          Our complete report includes detailed insights and actionable strategies
        </p>
      </div>
    </div>
  );
};

export default SwotTab;
