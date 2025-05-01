
import React from 'react';
import { ArchetypeDetailedData } from '@/types/archetype';
import SectionTitle from '@/components/shared/SectionTitle';
import { normalizeSwotData } from '@/utils/swot/normalizeSwotData';

export interface SwotAnalysisProps {
  reportData?: ArchetypeDetailedData;
  archetypeData?: ArchetypeDetailedData; // Kept for backward compatibility
  swotData?: {
    strengths?: any[];
    weaknesses?: any[];
    opportunities?: any[];
    threats?: any[];
  };
}

const SwotAnalysis: React.FC<SwotAnalysisProps> = ({ reportData, archetypeData, swotData: propSwotData }) => {
  // Use reportData from level4_report_secure as primary source
  const data = reportData;
  
  // Log the data sources available
  console.log("[SwotAnalysis] Data source check:", {
    hasReportData: !!reportData,
    reportDataSource: reportData ? "level4_report_secure" : "none",
    swotDataAvailable: !!(reportData?.swot_analysis || reportData?.strengths),
    swotAnalysisType: reportData?.swot_analysis ? typeof reportData.swot_analysis : "N/A"
  });

  // Get SWOT data from the swot_analysis field if available, or from individual fields
  const swotAnalysis = data?.swot_analysis || {};
  
  // Extract SWOT components from the data with priority order
  // 1. Use props.swotData if provided (for testing/override)
  // 2. Use data.swot_analysis.X if available
  // 3. Use data.X direct fields if available
  const strengths = normalizeSwotData(propSwotData?.strengths || swotAnalysis?.strengths || data?.strengths);
  const weaknesses = normalizeSwotData(propSwotData?.weaknesses || swotAnalysis?.weaknesses || data?.weaknesses);
  const opportunities = normalizeSwotData(propSwotData?.opportunities || swotAnalysis?.opportunities || data?.opportunities);
  const threats = normalizeSwotData(propSwotData?.threats || swotAnalysis?.threats || data?.threats);

  // If no data available, show no data message
  if (!data) {
    return (
      <div className="space-y-6">
        <SectionTitle title="SWOT Analysis" />
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <p className="text-gray-600">No SWOT analysis data available for this archetype.</p>
        </div>
      </div>
    );
  }

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
