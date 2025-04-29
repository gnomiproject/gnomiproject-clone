
import React from 'react';
import { Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { formatNumber } from '@/utils/formatters';
import { calculatePercentageDifference, getMetricComparisonText } from '@/utils/reports/metricUtils';

interface RiskProfileProps {
  reportData: any;
  averageData: any;
}

const RiskProfile: React.FC<RiskProfileProps> = ({ reportData, averageData }) => {
  // Extract risk score, handling possible naming variations
  const riskScore = reportData?.['Risk_Average Risk Score'] || 
                    reportData?.Risk_Average_Risk_Score || 0;
  const avgRiskScore = averageData?.['Risk_Average Risk Score'] || 
                      averageData?.Risk_Average_Risk_Score || 0;
  
  // Calculate comparison metrics
  const percentDiff = calculatePercentageDifference(riskScore, avgRiskScore);
  const { text, color } = getMetricComparisonText(riskScore, avgRiskScore, 'risk');
  
  // Determine risk level category
  let riskLevel = 'Moderate';
  let riskColor = 'text-yellow-500';
  
  if (riskScore < avgRiskScore * 0.9) {
    riskLevel = 'Lower than Average';
    riskColor = 'text-green-500';
  } else if (riskScore > avgRiskScore * 1.1) {
    riskLevel = 'Higher than Average';
    riskColor = 'text-red-500';
  }

  return (
    <Card className="p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <h3 className="text-xl font-semibold">Risk Profile</h3>
        <Activity className="h-6 w-6 text-blue-500" />
      </div>
      
      <div className="mt-4">
        <div className="text-3xl font-bold">{formatNumber(riskScore, 'number', 2)}</div>
        <div className="text-sm text-gray-500">Overall Risk Score</div>
        
        <div className="mt-3">
          <span className={`text-sm font-medium ${color}`}>{text}</span>
        </div>
        
        <div className="mt-4 bg-gray-100 rounded-lg p-4">
          <h4 className="font-medium mb-2">Risk Level:</h4>
          <div className={`text-lg font-semibold ${riskColor}`}>{riskLevel}</div>
          
          <p className="mt-2 text-sm text-gray-600">
            This risk score factors in clinical history, demographic data, 
            and utilization patterns to estimate potential health risks. 
            {percentDiff < 0 ? 
              ' This archetype shows lower risk factors compared to average.' : 
              ' This archetype shows elevated risk factors compared to average.'}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default RiskProfile;
