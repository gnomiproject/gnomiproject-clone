
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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-6">Utilization Patterns</h1>
          {/* Removed the introductory paragraph text as requested */}
        </div>
        <div className="md:w-1/3 flex justify-center">
          <img
            src={gnomeImage}
            alt="Utilization Patterns Analysis"
            className="max-h-64 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/gnomes/placeholder.svg';
            }}
          />
        </div>
      </div>

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
