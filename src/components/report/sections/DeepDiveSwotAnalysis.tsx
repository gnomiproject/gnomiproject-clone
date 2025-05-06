
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SectionTitle from '@/components/shared/SectionTitle';
import { processSwotData } from '@/utils/swot/processSwotData';
import { ArchetypeDetailedData } from '@/types/archetype';

interface SwotAnalysisProps {
  reportData?: ArchetypeDetailedData;
  archetypeData?: ArchetypeDetailedData; // For backward compatibility
}

const DeepDiveSwotAnalysis: React.FC<SwotAnalysisProps> = ({ reportData, archetypeData }) => {
  // Use reportData from level4_report_secure as primary source, fall back to archetypeData
  const data = reportData || archetypeData;
  const title = data?.name || data?.archetype_name || 'This Archetype';
  
  // Process SWOT data using our unified utility - memoized for performance
  const { strengths, weaknesses, opportunities, threats } = useMemo(() => {
    return processSwotData(data);
  }, [data]);
  
  // Log the processed data
  React.useEffect(() => {
    console.log("[DeepDiveSwotAnalysis] Processed SWOT data:", {
      strengthsCount: strengths.length,
      weaknessesCount: weaknesses.length,
      opportunitiesCount: opportunities.length,
      threatsCount: threats.length
    });
  }, [strengths, weaknesses, opportunities, threats]);

  return (
    <section className="mb-10">
      <SectionTitle title="SWOT Analysis" />
      <p className="text-gray-600 mb-6">
        This analysis identifies key Strengths, Weaknesses, Opportunities, and Threats for {title}.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-green-700 text-xl">Strengths</CardTitle>
          </CardHeader>
          <CardContent>
            {strengths.length > 0 ? (
              <ul className="space-y-2">
                {strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 mt-2"></div>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No strength data available</p>
            )}
          </CardContent>
        </Card>
        
        {/* Weaknesses */}
        <Card className="bg-gradient-to-br from-red-50 to-white border-red-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-red-700 text-xl">Weaknesses</CardTitle>
          </CardHeader>
          <CardContent>
            {weaknesses.length > 0 ? (
              <ul className="space-y-2">
                {weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-500 mt-2"></div>
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No weakness data available</p>
            )}
          </CardContent>
        </Card>
        
        {/* Opportunities */}
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-700 text-xl">Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            {opportunities.length > 0 ? (
              <ul className="space-y-2">
                {opportunities.map((opportunity, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
                    <span>{opportunity}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No opportunity data available</p>
            )}
          </CardContent>
        </Card>
        
        {/* Threats */}
        <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-700 text-xl">Threats</CardTitle>
          </CardHeader>
          <CardContent>
            {threats.length > 0 ? (
              <ul className="space-y-2">
                {threats.map((threat, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-amber-500 mt-2"></div>
                    <span>{threat}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No threat data available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default React.memo(DeepDiveSwotAnalysis);
