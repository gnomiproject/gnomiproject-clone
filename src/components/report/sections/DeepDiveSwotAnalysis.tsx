
/**
 * DeepDiveSwotAnalysis Component - Used EXCLUSIVELY for the Deep Dive Report (NOT Insights page)
 * Only processes data from level4_report_secure table
 */
import React, { useEffect } from 'react';
import SectionTitle from '@/components/shared/SectionTitle';
import { ArchetypeDetailedData } from '@/types/archetype';
import { processDeepDiveSwotData } from '@/utils/swot/processDeepDiveSwotData';

export interface DeepDiveSwotAnalysisProps {
  reportData?: ArchetypeDetailedData;
}

const DeepDiveSwotAnalysis: React.FC<DeepDiveSwotAnalysisProps> = ({ reportData }) => {
  // Log debugging information
  useEffect(() => {
    console.log("[DeepDiveSwotAnalysis] Initialization with report data:", {
      hasReportData: !!reportData,
      dataSource: 'level4_report_secure',
      hasSwotAnalysis: reportData ? !!reportData.swot_analysis : false
    });
  }, [reportData]);

  // Process the SWOT data using the dedicated utility function for Deep Dive Report
  const { strengths, weaknesses, opportunities, threats } = processDeepDiveSwotData(reportData);

  // Log processed data
  console.log("[DeepDiveSwotAnalysis] Processed SWOT data from level4_report_secure:", {
    strengthsCount: strengths.length,
    weaknessesCount: weaknesses.length,
    opportunitiesCount: opportunities.length,
    threatsCount: threats.length
  });

  // If no data available, show no data message
  if (!reportData) {
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
          This analysis identifies the key strengths, weaknesses, opportunities, and threats related to {reportData?.name || reportData?.archetype_name}.
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

export default DeepDiveSwotAnalysis;
