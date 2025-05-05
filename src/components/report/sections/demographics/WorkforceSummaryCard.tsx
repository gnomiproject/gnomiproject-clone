
import React, { useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { calculatePercentageDifference } from '@/utils/reports/metricUtils';

interface WorkforceSummaryCardProps {
  title: string;
  value: number;
  average: number;
  icon: React.ReactNode;
  unit?: string;
  decimals?: number;
}

const WorkforceSummaryCard: React.FC<WorkforceSummaryCardProps> = ({ 
  title, 
  value, 
  average, 
  icon, 
  unit = '', 
  decimals = 0 
}) => {
  // Format the value with the appropriate number of decimal places
  const formattedValue = value ? value.toLocaleString(undefined, { 
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }) : 'N/A';
  
  // Calculate the percentage difference
  const percentDiff = calculatePercentageDifference(value, average);
  
  // Enhanced debug log to see what's happening with the calculations
  useEffect(() => {
    console.log(`[WorkforceSummaryCard] ${title} comparison:`, {
      value,
      average,
      percentDiff,
      calculation: `(${value} - ${average}) / ${average} * 100 = ${percentDiff.toFixed(1)}%`,
      source: 'Using All_Average from database'
    });
  }, [value, average, title, percentDiff]);
  
  // Determine if higher or lower is better based on the metric name
  const lowerIsBetter = title.toLowerCase().includes('cost') || title.toLowerCase().includes('risk');
  
  // Determine if this is positive or negative
  const isPositive = (percentDiff > 0 && !lowerIsBetter) || (percentDiff < 0 && lowerIsBetter);
  
  // Determine display text
  const comparisonWord = percentDiff > 0 ? "higher than" : "lower than";
  const comparisonText = Math.abs(percentDiff) < 0.1 ? 
    "same as average" : 
    `${Math.abs(percentDiff).toFixed(1)}% ${comparisonWord} average`;
  
  // Determine color for the comparison text
  const textColor = isPositive ? "text-green-600" : Math.abs(percentDiff) < 0.1 ? "text-gray-600" : "text-amber-600";
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center mb-2">
          <div className="p-2 rounded-full bg-blue-100 text-blue-800 mr-2">
            {icon}
          </div>
          <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        </div>
        
        <div className="mt-2">
          <div className="flex items-baseline">
            <span className="text-2xl font-bold">{formattedValue}</span>
            {unit && <span className="text-gray-500 ml-1">{unit}</span>}
          </div>
          
          <p className={`text-sm mt-1 ${textColor}`}>
            {comparisonText}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkforceSummaryCard;
