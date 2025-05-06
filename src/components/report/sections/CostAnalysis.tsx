
import React from 'react';
import CostAnalysisInsights from './cost-analysis/CostAnalysisInsights';
import CostOverviewGrid from './cost-analysis/CostOverviewGrid';
import CostImpactAnalysis from './cost-analysis/CostImpactAnalysis';

interface CostAnalysisProps {
  reportData: any;
  averageData: any;
}

const CostAnalysis = ({ 
  reportData, 
  averageData 
}: CostAnalysisProps) => {
  // Get cost analysis insights
  const costAnalysis = reportData.cost_analysis || 
    "No specific cost analysis insights available for this archetype.";
  
  // Gnome image
  const gnomeImage = '/assets/gnomes/gnome_charts.png';

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <p className="text-lg mb-6">
            Understanding healthcare spending patterns is crucial for effective benefits management. 
            This section breaks down this archetype's healthcare costs and compares them to the 
            {reportData.archetype_name} archetype average.
          </p>
        </div>
        <div className="md:w-1/3 flex justify-center">
          <img
            src={gnomeImage}
            alt="Cost Analysis Gnome"
            className="max-h-64 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/gnomes/placeholder.svg';
            }}
          />
        </div>
      </div>

      {/* Cost Analysis Insights */}
      <CostAnalysisInsights costAnalysis={costAnalysis} />

      {/* Cost Overview Cards */}
      <CostOverviewGrid reportData={reportData} averageData={averageData} />

      {/* Cost Impact Analysis Card */}
      <CostImpactAnalysis reportData={reportData} averageData={averageData} />
    </div>
  );
};

export default CostAnalysis;
