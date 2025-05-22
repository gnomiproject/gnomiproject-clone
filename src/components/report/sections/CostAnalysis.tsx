
import React, { useEffect } from 'react';
import CostAnalysisInsights from './cost-analysis/CostAnalysisInsights';
import CostOverviewGrid from './cost-analysis/CostOverviewGrid';
import CostImpactAnalysis from './cost-analysis/CostImpactAnalysis';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CostAnalysisProps {
  reportData: any;
  averageData: any;
}

const CostAnalysis = ({ 
  reportData, 
  averageData 
}: CostAnalysisProps) => {
  // Check if we have the required cost analysis data
  const hasRequiredData = reportData && 
    (reportData["Cost_Avoidable ER Potential Savings PMPY"] !== undefined ||
     reportData["Cost_Specialty RX Allowed Amount PMPM"] !== undefined);
  
  const costAnalysis = reportData?.cost_analysis || 
    "No specific cost analysis insights available for this archetype.";
  
  // Log component rendering information
  useEffect(() => {
    console.log('[CostAnalysis] Rendering with data:', {
      hasReportData: !!reportData,
      hasAverageData: !!averageData,
      hasCostAnalysisText: !!reportData?.cost_analysis,
      hasCostAvoidableER: reportData && "Cost_Avoidable ER Potential Savings PMPY" in reportData,
      hasSpecialtyRx: reportData && "Cost_Specialty RX Allowed Amount PMPM" in reportData,
    });
  }, [reportData, averageData]);

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

      {!hasRequiredData && (
        <Alert className="bg-yellow-50 border border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            Some cost data may be missing or incomplete. The report will display available data.
          </AlertDescription>
        </Alert>
      )}

      {/* Cost Analysis Insights */}
      <CostAnalysisInsights costAnalysis={costAnalysis} />

      {/* Cost Overview Cards */}
      <ErrorBoundary>
        <CostOverviewGrid reportData={reportData} averageData={averageData} />
      </ErrorBoundary>

      {/* Cost Impact Analysis Card */}
      <ErrorBoundary>
        <CostImpactAnalysis reportData={reportData} averageData={averageData} />
      </ErrorBoundary>
    </div>
  );
};

export default CostAnalysis;
