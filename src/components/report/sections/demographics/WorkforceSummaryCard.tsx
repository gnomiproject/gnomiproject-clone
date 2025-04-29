
import React from 'react';
import { formatNumber } from '@/utils/formatters';
import { calculatePercentageDifference } from '@/utils/reports/metricUtils';

interface WorkforceSummaryCardProps {
  title: string;
  value: number;
  averageValue: number;
  icon: React.ReactNode;
  suffix?: string;
  isPercent?: boolean;
  isCurrency?: boolean;
  decimals?: number;
}

const WorkforceSummaryCard: React.FC<WorkforceSummaryCardProps> = ({
  title,
  value,
  averageValue,
  icon,
  suffix = '',
  isPercent = false,
  isCurrency = false,
  decimals = 0
}) => {
  // Format the value based on its type
  let formattedValue: string;
  if (isPercent) {
    formattedValue = formatNumber(value, 'percent', 1);
  } else if (isCurrency) {
    formattedValue = formatNumber(value, 'currency', 0);
  } else {
    formattedValue = formatNumber(value, 'number', decimals);
  }

  // Calculate comparison to average
  const percentDiff = calculatePercentageDifference(value, averageValue);
  const percentDiffText = `${percentDiff > 0 ? '+' : ''}${percentDiff.toFixed(1)}%`;
  
  // Determine comparison text
  let comparisonText: string;
  if (Math.abs(percentDiff) < 1) {
    comparisonText = 'On par with archetype average';
  } else {
    // Format the average value appropriately
    let formattedAverage: string;
    if (isCurrency) {
      formattedAverage = formatNumber(averageValue, 'currency', 0);
    } else if (isPercent) {
      formattedAverage = formatNumber(averageValue, 'percent', 1);
    } else {
      formattedAverage = formatNumber(averageValue, 'number', decimals);
    }
    
    comparisonText = `${percentDiffText} vs. archetype average (${formattedAverage})`;
  }

  // Determine if this is positive or negative (context-sensitive)
  // For some metrics like costs, lower is better
  const isPositiveMetric = !title.toLowerCase().includes('cost');
  const isPositiveComparison = isPositiveMetric ? percentDiff > 0 : percentDiff < 0;
  
  const comparisonColor = Math.abs(percentDiff) < 1 
    ? 'text-gray-600' 
    : isPositiveComparison ? 'text-green-600' : 'text-amber-600';
  
  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center mb-2">
        <div className="bg-blue-100 p-2 rounded-lg mr-3">
          {icon}
        </div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <div className="mt-2">
        <div className="text-2xl font-bold">
          {formattedValue} {suffix && <span className="text-sm font-normal">{suffix}</span>}
        </div>
        <p className={`text-sm mt-1 ${comparisonColor}`}>{comparisonText}</p>
      </div>
    </div>
  );
};

export default WorkforceSummaryCard;
