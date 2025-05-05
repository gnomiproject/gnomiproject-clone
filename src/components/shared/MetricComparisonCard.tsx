
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { calculatePercentageDifference, getMetricComparisonText } from '@/utils/reports/metricUtils';

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
  const { text, color } = getMetricComparisonText(value, average, title);
  
  // Format the average value
  const formattedAverage = title.toLowerCase().includes('cost') ? 
    `$${average.toLocaleString()}` : 
    average.toLocaleString();
  
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium text-gray-700 mb-1">{title}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">{value.toLocaleString()}</span>
          {unit && <span className="text-gray-500">{unit}</span>}
        </div>
        <p className={`mt-2 ${color}`}>
          {text}
        </p>
      </CardContent>
    </Card>
  );
};

export default MetricComparisonCard;
