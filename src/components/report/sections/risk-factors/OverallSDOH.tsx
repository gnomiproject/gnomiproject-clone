
import React from 'react';
import { BarChart2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { formatNumber } from '@/utils/formatters';
import { calculatePercentageDifference, isLowerBetter } from '@/utils/reports/metricUtils';

interface OverallSDOHProps {
  reportData: any;
  averageData: any;
}

const OverallSDOH: React.FC<OverallSDOHProps> = ({ reportData, averageData }) => {
  // Extract SDOH score, handling possible naming variations
  const sdohScore = reportData?.['SDOH_Average SDOH'] || 
                    reportData?.SDOH_Average_SDOH || 0;
  const avgSdohScore = averageData?.['SDOH_Average SDOH'] || 
                       averageData?.SDOH_Average_SDOH || 0;
  
  // Calculate comparison metrics
  const percentDiff = calculatePercentageDifference(sdohScore, avgSdohScore);
  
  // For SDOH, lower values indicate fewer social determinant risks
  // Note: This is different from isLowerBetter() - we're not saying lower is "better"
  // but rather that lower values represent fewer social risk factors
  const fewerRisks = percentDiff < 0;
  
  const comparisonWord = percentDiff > 0 ? "higher than" : "lower than";
  const text = `${Math.abs(percentDiff).toFixed(1)}% ${comparisonWord} archetype average`;
  
  // Color based on risk assessment, not "better/worse" judgment
  const color = fewerRisks ? "text-green-600" : "text-amber-600";
  
  // Determine SDOH level category
  let sdohLevel = 'Moderate Social Risk Factors';
  let sdohColor = 'text-yellow-500';
  
  if (sdohScore > avgSdohScore * 1.05) {
    sdohLevel = 'Higher Social Risk Factors';
    sdohColor = 'text-red-500';
  } else if (sdohScore < avgSdohScore * 0.95) {
    sdohLevel = 'Fewer Social Risk Factors';
    sdohColor = 'text-green-500';
  }

  return (
    <Card className="p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <h3 className="text-xl font-semibold">Overall SDOH Score</h3>
        <BarChart2 className="h-6 w-6 text-violet-500" />
      </div>
      
      <div className="mt-4">
        <div className="text-3xl font-bold">{formatNumber(sdohScore, 'number', 1)}</div>
        <div className="text-sm text-gray-500">SDOH Composite Score (Higher indicates greater health risks)</div>
        
        <div className="mt-3">
          <span className={`text-sm font-medium ${color}`}>{text}</span>
        </div>
        
        <div className="mt-4 bg-gray-100 rounded-lg p-4">
          <h4 className="font-medium mb-2">SDOH Status:</h4>
          <div className={`text-lg font-semibold ${sdohColor}`}>{sdohLevel}</div>
          
          <p className="mt-2 text-sm text-gray-600">
            This composite score measures the overall social and environmental factors 
            affecting this population. A higher score indicates greater social determinant risks,
            which may negatively impact health outcomes. The score reflects economic stability, 
            education, social context, healthcare access, and neighborhood factors.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default OverallSDOH;
