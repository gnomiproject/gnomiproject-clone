
import React from 'react';
import { Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { formatNumber } from '@/utils/formatters';
import { calculatePercentageDifference, isLowerBetter } from '@/utils/reports/metricUtils';

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
  
  // For clinical risk scores, higher values indicate greater clinical risks
  // Lower risk scores are associated with fewer health risks
  const higherRisks = percentDiff > 0;
  
  const comparisonWord = percentDiff > 0 ? "higher than" : "lower than";
  const text = `${Math.abs(percentDiff).toFixed(1)}% ${comparisonWord} archetype average`;
  
  // Color based on risk assessment - higher risks (red), lower risks (green)
  const color = higherRisks ? "text-red-600" : "text-green-600";
  
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
        <h3 className="text-xl font-semibold">Clinical Risk Profile</h3>
        <Activity className="h-6 w-6 text-blue-500" />
      </div>
      
      <div className="mt-4">
        <div className="text-3xl font-bold">{formatNumber(riskScore, 'number', 2)}</div>
        <div className="text-sm text-gray-500">Overall Clinical Risk Score</div>
        
        <div className="mt-3">
          <span className={`text-sm font-medium ${color}`}>{text}</span>
        </div>
        
        <div className="mt-4 bg-gray-100 rounded-lg p-4">
          <h4 className="font-medium mb-2">Clinical Risk Level:</h4>
          <div className={`text-lg font-semibold ${riskColor}`}>{riskLevel}</div>
          
          <p className="mt-2 text-sm text-gray-600">
            This clinical risk score factors in healthcare claims, demographic data, 
            and utilization patterns to estimate potential health risks based on the population's history. 
            {percentDiff < 0 ? 
              ' This archetype shows lower clinical risk factors compared to the archetype average.' : 
              ' This archetype shows elevated clinical risk factors compared to the archetype average.'}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default RiskProfile;
