
import React from 'react';
import CarePathwayUtilization from './utilization/CarePathwayUtilization';
import HospitalServices from './utilization/HospitalServices';
import DiagnosticServices from './utilization/DiagnosticServices';
import SpecialPopulations from './utilization/SpecialPopulations';
import UtilizationInsights from './utilization/UtilizationInsights';

interface UtilizationPatternsProps {
  reportData: any;
  averageData: any;
}

const UtilizationPatterns = ({ reportData, averageData }: UtilizationPatternsProps) => {
  return (
    <div className="space-y-4">
      {/* Add section title */}
      <h1 className="text-3xl font-bold mb-6">Utilization Patterns</h1>
      
      {/* Introductory text */}
      <p className="text-gray-700 mb-6">
        Understanding how members access healthcare services provides crucial insights into population health management and cost-saving opportunities.
      </p>

      {/* Utilization Insights - Moved to top */}
      <UtilizationInsights reportData={reportData} />

      {/* Care Pathway Utilization */}
      <CarePathwayUtilization reportData={reportData} averageData={averageData} />

      {/* Hospital Services */}
      <HospitalServices reportData={reportData} averageData={averageData} />

      {/* Diagnostic Services */}
      <DiagnosticServices reportData={reportData} averageData={averageData} />

      {/* Special Populations */}
      <SpecialPopulations reportData={reportData} averageData={averageData} />
    </div>
  );
};

export default UtilizationPatterns;
