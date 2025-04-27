
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArchetypeDetailedData } from '@/types/archetype';

interface SwotTabProps {
  archetypeData: ArchetypeDetailedData;
  familyColor: string;
}

const SwotTab = ({ archetypeData, familyColor }: SwotTabProps) => {
  const strengths = archetypeData.strengths || archetypeData.enhanced?.swot?.strengths || [];
  const weaknesses = archetypeData.weaknesses || archetypeData.enhanced?.swot?.weaknesses || [];
  const opportunities = archetypeData.opportunities || archetypeData.enhanced?.swot?.opportunities || [];
  const threats = archetypeData.threats || archetypeData.enhanced?.swot?.threats || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>SWOT Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="border rounded-lg p-4" style={{ borderColor: `${familyColor}40` }}>
            <h3 className="text-lg font-semibold mb-3 text-green-700">Strengths</h3>
            <ul className="list-disc list-inside space-y-2">
              {strengths.slice(0, 5).map((item, index) => (
                <li key={`strength-${index}`} className="text-gray-700">{item}</li>
              ))}
              {strengths.length === 0 && <li className="text-gray-500">No specific strengths identified</li>}
            </ul>
          </div>
          
          {/* Weaknesses */}
          <div className="border rounded-lg p-4" style={{ borderColor: `${familyColor}40` }}>
            <h3 className="text-lg font-semibold mb-3 text-red-700">Weaknesses</h3>
            <ul className="list-disc list-inside space-y-2">
              {weaknesses.slice(0, 5).map((item, index) => (
                <li key={`weakness-${index}`} className="text-gray-700">{item}</li>
              ))}
              {weaknesses.length === 0 && <li className="text-gray-500">No specific weaknesses identified</li>}
            </ul>
          </div>
          
          {/* Opportunities */}
          <div className="border rounded-lg p-4" style={{ borderColor: `${familyColor}40` }}>
            <h3 className="text-lg font-semibold mb-3 text-blue-700">Opportunities</h3>
            <ul className="list-disc list-inside space-y-2">
              {opportunities.slice(0, 5).map((item, index) => (
                <li key={`opportunity-${index}`} className="text-gray-700">{item}</li>
              ))}
              {opportunities.length === 0 && <li className="text-gray-500">No specific opportunities identified</li>}
            </ul>
          </div>
          
          {/* Threats */}
          <div className="border rounded-lg p-4" style={{ borderColor: `${familyColor}40` }}>
            <h3 className="text-lg font-semibold mb-3 text-orange-700">Threats</h3>
            <ul className="list-disc list-inside space-y-2">
              {threats.slice(0, 5).map((item, index) => (
                <li key={`threat-${index}`} className="text-gray-700">{item}</li>
              ))}
              {threats.length === 0 && <li className="text-gray-500">No specific threats identified</li>}
            </ul>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
          <h3 className="font-semibold text-yellow-800">Want to explore strategic implications in detail?</h3>
          <p className="text-yellow-700">Get the full report with detailed analysis and actionable insights.</p>
          <Button className="mt-2 bg-yellow-700 hover:bg-yellow-800" size="sm">
            Request Full Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SwotTab;
