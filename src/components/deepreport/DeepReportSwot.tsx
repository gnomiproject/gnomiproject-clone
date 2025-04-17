
import React from 'react';
import { DeepReportData } from '@/pages/ArchetypeDeepReport';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getArchetypeColorHex } from '@/data/colors';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeepReportSwotProps {
  reportData: DeepReportData;
}

const DeepReportSwot: React.FC<DeepReportSwotProps> = ({ reportData }) => {
  const { archetypeData, swotAnalysis } = reportData;
  
  if (!archetypeData) {
    return <div>Loading archetype data...</div>;
  }
  
  const archetypeColor = getArchetypeColorHex(archetypeData.id);
  
  // Function to check if SWOT data is available and valid
  const hasSwotData = swotAnalysis && 
    (Array.isArray(swotAnalysis.strengths) || 
     Array.isArray(swotAnalysis.weaknesses) || 
     Array.isArray(swotAnalysis.opportunities) || 
     Array.isArray(swotAnalysis.threats));
  
  return (
    <div className="mb-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">SWOT Analysis</h1>
        <div 
          className="h-1 w-24 rounded-full mb-6"
          style={{ backgroundColor: archetypeColor }}
        ></div>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Strategic Evaluation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-8">
            This SWOT analysis provides a strategic evaluation of the {archetypeData.name} archetype,
            identifying key strengths, weaknesses, opportunities, and threats based on the detailed
            metrics analysis. This framework helps prioritize strategic initiatives and interventions.
          </p>
          
          {hasSwotData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-green-700 mb-4">Strengths</h3>
                <ul className="space-y-3">
                  {Array.isArray(swotAnalysis.strengths) ? swotAnalysis.strengths.map((strength: string, index: number) => (
                    <li key={`strength-${index}`} className="flex items-start">
                      <div 
                        className="h-2 w-2 mt-2 mr-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: archetypeColor }}
                      ></div>
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  )) : (
                    <li className="text-gray-500">No strengths data available</li>
                  )}
                </ul>
              </div>
              
              {/* Weaknesses */}
              <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-red-700 mb-4">Weaknesses</h3>
                <ul className="space-y-3">
                  {Array.isArray(swotAnalysis.weaknesses) ? swotAnalysis.weaknesses.map((weakness: string, index: number) => (
                    <li key={`weakness-${index}`} className="flex items-start">
                      <div 
                        className="h-2 w-2 mt-2 mr-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: archetypeColor }}
                      ></div>
                      <span className="text-gray-700">{weakness}</span>
                    </li>
                  )) : (
                    <li className="text-gray-500">No weaknesses data available</li>
                  )}
                </ul>
              </div>
              
              {/* Opportunities */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-blue-700 mb-4">Opportunities</h3>
                <ul className="space-y-3">
                  {Array.isArray(swotAnalysis.opportunities) ? swotAnalysis.opportunities.map((opportunity: string, index: number) => (
                    <li key={`opportunity-${index}`} className="flex items-start">
                      <div 
                        className="h-2 w-2 mt-2 mr-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: archetypeColor }}
                      ></div>
                      <span className="text-gray-700">{opportunity}</span>
                    </li>
                  )) : (
                    <li className="text-gray-500">No opportunities data available</li>
                  )}
                </ul>
              </div>
              
              {/* Threats */}
              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-yellow-700 mb-4">Threats</h3>
                <ul className="space-y-3">
                  {Array.isArray(swotAnalysis.threats) ? swotAnalysis.threats.map((threat: string, index: number) => (
                    <li key={`threat-${index}`} className="flex items-start">
                      <div 
                        className="h-2 w-2 mt-2 mr-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: archetypeColor }}
                      ></div>
                      <span className="text-gray-700">{threat}</span>
                    </li>
                  )) : (
                    <li className="text-gray-500">No threats data available</li>
                  )}
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <CircleAlert className="h-12 w-12 text-amber-500 mb-4" />
              <h4 className="text-lg font-semibold mb-2">SWOT Analysis Not Available</h4>
              <p className="text-gray-500 mb-6">The SWOT analysis for this archetype is still being generated.</p>
              <Button variant="outline">Request SWOT Analysis</Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Strategic Implications */}
      <Card>
        <CardHeader>
          <CardTitle>Strategic Implications</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-6">
            This SWOT analysis identifies several key strategic implications for organizations within 
            the {archetypeData.name} archetype:
          </p>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Leverage Core Strengths</h3>
              <p className="text-gray-700">
                Organizations in this archetype should build upon their demonstrated capabilities 
                in key areas, using these strengths as a foundation for broader healthcare strategy.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Address Critical Weaknesses</h3>
              <p className="text-gray-700">
                The identified weaknesses represent priority areas for intervention, as they may 
                undermine overall healthcare performance and return on investment if left unaddressed.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Pursue High-Value Opportunities</h3>
              <p className="text-gray-700">
                The opportunities identified represent areas where targeted investments and program 
                changes are likely to yield significant improvements in outcomes and efficiency.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Mitigate Emerging Threats</h3>
              <p className="text-gray-700">
                Proactive strategies should be developed to address identified threats before they 
                materialize into significant challenges for the organization's healthcare program.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeepReportSwot;
