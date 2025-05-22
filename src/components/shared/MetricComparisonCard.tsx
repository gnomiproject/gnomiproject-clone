
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { calculatePercentageDifference, getMetricComparisonText } from '@/utils/reports/metricUtils';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MetricComparisonCardProps {
  title: string;
  value: number;
  average: number;
  unit?: string;
  className?: string;
}

/**
 * A card component that displays a metric value with a comparison to the archetype average
 */
const MetricComparisonCard = ({ 
  title, 
  value, 
  average, 
  unit = '', 
  className = ''
}: MetricComparisonCardProps) => {
  // Validate inputs
  const validValue = typeof value === 'number' ? value : 0;
  const validAverage = typeof average === 'number' && average !== 0 ? average : 
    (title.includes('Cost') ? 5000 : 1); // Fallback based on metric type
    
  // Calculate the percentage difference with validated inputs
  const difference = calculatePercentageDifference(validValue, validAverage);
  const { text, color } = getMetricComparisonText(validValue, validAverage, title);
  
  // Format the average value
  const formattedAverage = title.toLowerCase().includes('cost') ? 
    `$${validAverage.toLocaleString()}` : 
    validAverage.toLocaleString();
  
  // Log validation info if using fallback
  if (validAverage !== average) {
    console.warn(`[MetricComparisonCard] Using fallback average for ${title}:`, {
      originalAverage: average,
      fallbackAverage: validAverage
    });
  }
  
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium text-gray-700 mb-1 flex items-center">
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
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">{validValue.toLocaleString()}</span>
          {unit && <span className="text-gray-500">{unit}</span>}
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-500">Archetype avg: {formattedAverage}{unit}</span>
          <p className={`${color}`}>
            {text}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricComparisonCard;
