
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

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-6">Cost Analysis</h1>
      
      <div className="mb-6">
        <p className="text-lg">
          Understanding healthcare spending patterns is crucial for effective benefits management. 
          This section breaks down this archetype's healthcare costs and compares them to the 
          average.
        </p>
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
