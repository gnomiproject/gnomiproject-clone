
import React from 'react';
import { ChartBar } from 'lucide-react';
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
  // Gnome image
  const gnomeImage = '/assets/gnomes/gnome_clipboard.png';

  return (
    <div className="space-y-4">
      {/* Care Pathway Utilization */}
      <CarePathwayUtilization reportData={reportData} averageData={averageData} />

      {/* Hospital Services */}
      <HospitalServices reportData={reportData} averageData={averageData} />

      {/* Diagnostic Services */}
      <DiagnosticServices reportData={reportData} averageData={averageData} />

      {/* Special Populations */}
      <SpecialPopulations reportData={reportData} averageData={averageData} />

      {/* Utilization Insights */}
      <UtilizationInsights reportData={reportData} />
    </div>
  );
};

export default UtilizationPatterns;
