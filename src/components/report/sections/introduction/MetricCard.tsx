
import React from 'react';
import { Card } from '@/components/ui/card';
import { ArrowDown, ArrowUp, Info } from 'lucide-react';
import { calculatePercentageDifference, getMetricComparisonText } from '@/utils/reports/metricUtils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MetricCardProps {
  title: string;
  value: number;
  average: number;
  format?: 'number' | 'percent' | 'currency';
  decimals?: number;
  lowerIsBetter?: boolean;
}

const MetricCard = ({ 
  title, 
  value, 
  average, 
  format = 'number',
  decimals = 0,
  lowerIsBetter = false
}: MetricCardProps) => {
  // Calculate the percentage difference
  const difference = calculatePercentageDifference(value, average);
  const { text, color } = getMetricComparisonText(value, average, title);
  
  // Determine if this is better or worse based on lowerIsBetter flag
  const isPositive = (lowerIsBetter && difference < 0) || (!lowerIsBetter && difference > 0);
  
  // Format the value based on type
  const formatValue = (val: number): string => {
    switch (format) {
      case 'percent':
        return `${(val * 100).toFixed(decimals)}%`;
      case 'currency':
        return `$${val.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        })}`;
      case 'number':
      default:
        return val.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        });
    }
  };

  return (
    <Card className="overflow-hidden border border-gray-100">
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-600 mb-1 flex items-center">
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
          <span className="text-2xl font-bold">{formatValue(value)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Archetype avg: {formatValue(average)}
          </span>
          <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-amber-600'}`}>
            {isPositive ? (
              <ArrowUp className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDown className="h-3 w-3 mr-1" />
            )}
            <span className="text-xs font-medium">{text}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MetricCard;
