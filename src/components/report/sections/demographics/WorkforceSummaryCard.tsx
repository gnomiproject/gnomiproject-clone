
import React, { useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { calculatePercentageDifference } from '@/utils/reports/metricUtils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from 'lucide-react';

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
  
  // Validate inputs before calculation
  const validValue = typeof value === 'number' ? value : 0;
  const validAverage = typeof average === 'number' && average !== 0 ? average : 
    (title.includes('Age') ? 40 : 
     title.includes('Family') ? 3.0 : 
     title.includes('Employees') ? 5000 : 
     title.includes('States') ? 10 : 
     title.includes('Female') ? 0.51 : 
     title.includes('Salary') ? 75000 : 1);
  
  // Calculate the percentage difference with validated inputs
  const percentDiff = calculatePercentageDifference(validValue, validAverage);
  
  // Enhanced debug log to see what's happening with the calculations
  useEffect(() => {
    console.log(`[WorkforceSummaryCard] ${title} comparison:`, {
      value: validValue,
      average: validAverage,
      percentDiff,
      calculation: `(${validValue} - ${validAverage}) / ${validAverage} * 100 = ${percentDiff.toFixed(1)}%`,
      source: validAverage === average ? 'Using provided average' : 'Using fallback average'
    });
  }, [validValue, validAverage, title, percentDiff, value, average]);
  
  // Determine if higher or lower is better based on the metric name
  const lowerIsBetter = title.toLowerCase().includes('cost') || title.toLowerCase().includes('risk');
  
  // Determine if this is positive or negative
  const isPositive = (percentDiff > 0 && !lowerIsBetter) || (percentDiff < 0 && lowerIsBetter);
  
  // Determine display text
  const comparisonWord = percentDiff > 0 ? "higher than" : "lower than";
  const comparisonText = Math.abs(percentDiff) < 0.1 ? 
    "same as the archetype average" : 
    `${Math.abs(percentDiff).toFixed(1)}% ${comparisonWord} the archetype average`;
  
  // Determine color for the comparison text
  const textColor = isPositive ? "text-green-600" : Math.abs(percentDiff) < 0.1 ? "text-gray-600" : "text-amber-600";
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center mb-2">
          <div className="p-2 rounded-full bg-blue-100 text-blue-800 mr-2">
            {icon}
          </div>
          <h3 className="text-sm font-medium text-gray-700 flex items-center">
            {title}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 ml-2 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Compared to a weighted average across all healthcare archetypes</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h3>
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
