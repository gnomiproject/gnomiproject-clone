
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { calculatePercentageDifference, formatPercentageDifference } from '@/utils/reports/metricUtils';

interface MetricComparisonCardProps {
  title: string;
  value: number;
  average: number;
  unit?: string;
  className?: string;
}

/**
 * A card component that displays a metric value with a comparison to the average
 */
const MetricComparisonCard = ({ 
  title, 
  value, 
  average, 
  unit = '', 
  className = ''
}: MetricComparisonCardProps) => {
  // Calculate the percentage difference
  const difference = calculatePercentageDifference(value, average);
  const percentageText = formatPercentageDifference(difference);
  
  // Determine if this is better or worse (lower is better for costs, etc.)
  const lowerIsBetter = title.toLowerCase().includes('cost') || 
    title.toLowerCase().includes('emergency') || 
    title.toLowerCase().includes('risk');
  
  // Determine if this is positive or negative
  const isPositive = (difference > 0 && !lowerIsBetter) || (difference < 0 && lowerIsBetter);
  
  // Determine display text
  const comparisonWord = difference > 0 ? "higher than" : "lower than";
  
  // Format the average value
  const formattedAverage = title.toLowerCase().includes('cost') ? 
    `$${average.toLocaleString()}` : 
    average.toLocaleString();
  
  const comparisonText = `${Math.abs(difference).toFixed(1)}% ${comparisonWord} average (${formattedAverage})`;
  
  // Determine color for the comparison text
  const textColor = isPositive ? "text-green-600" : "text-amber-600";
  
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium text-gray-700 mb-1">{title}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">{value.toLocaleString()}</span>
          {unit && <span className="text-gray-500">{unit}</span>}
        </div>
        <p className={`mt-2 ${textColor}`}>
          {comparisonText}
        </p>
      </CardContent>
    </Card>
  );
};

export default MetricComparisonCard;
