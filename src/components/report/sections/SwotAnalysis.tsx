
import React from 'react';
import { ArchetypeDetailedData } from '@/types/archetype';
import SectionTitle from '@/components/shared/SectionTitle';
import { normalizeSwotData } from '@/utils/swot/normalizeSwotData';

export interface SwotAnalysisProps {
  reportData?: ArchetypeDetailedData;
  archetypeData?: ArchetypeDetailedData;
  swotData?: {
    strengths?: any[];
    weaknesses?: any[];
    opportunities?: any[];
    threats?: any[];
  };
}

const SwotAnalysis: React.FC<SwotAnalysisProps> = ({ reportData, archetypeData, swotData: propSwotData }) => {
  // Use reportData as primary, fall back to archetypeData
  const data = reportData || archetypeData;

  // Get SWOT data directly from the data or from props if provided
  const strengths = normalizeSwotData(propSwotData?.strengths || data?.strengths);
  const weaknesses = normalizeSwotData(propSwotData?.weaknesses || data?.weaknesses);
  const opportunities = normalizeSwotData(propSwotData?.opportunities || data?.opportunities);
  const threats = normalizeSwotData(propSwotData?.threats || data?.threats);

  return (
    <div className="space-y-6">
      <SectionTitle title="SWOT Analysis" />
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <p className="text-gray-600 mb-6">
          This analysis identifies the key strengths, weaknesses, opportunities, and threats related to {data?.name || data?.archetype_name}.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Strengths Section */}
          <div className="border border-green-200 bg-green-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg text-green-700 mb-3">Strengths</h3>
            {strengths && strengths.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {strengths.map((strength, idx) => (
                  <li key={idx} className="text-gray-700">{strength}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 italic">No specific strengths identified.</p>
            )}
          </div>
          
          {/* Weaknesses Section */}
          <div className="border border-amber-200 bg-amber-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg text-amber-700 mb-3">Weaknesses</h3>
            {weaknesses && weaknesses.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {weaknesses.map((weakness, idx) => (
                  <li key={idx} className="text-gray-700">{weakness}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 italic">No specific weaknesses identified.</p>
            )}
          </div>
          
          {/* Opportunities Section */}
          <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg text-blue-700 mb-3">Opportunities</h3>
            {opportunities && opportunities.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {opportunities.map((opportunity, idx) => (
                  <li key={idx} className="text-gray-700">{opportunity}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 italic">No specific opportunities identified.</p>
            )}
          </div>
          
          {/* Threats Section */}
          <div className="border border-red-200 bg-red-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg text-red-700 mb-3">Threats</h3>
            {threats && threats.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {threats.map((threat, idx) => (
                  <li key={idx} className="text-gray-700">{threat}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 italic">No specific threats identified.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwotAnalysis;
