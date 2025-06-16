
import React from 'react';
import { formatNumber } from '@/utils/formatters';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MetricBarProps {
  title: string;
  value: number;
  format: 'number' | 'percent' | 'currency';
  color?: string;
  isGap?: boolean;
  benchmark?: number;
  tooltipText?: string;
  maxValue?: number;
}

const MetricBar = ({ 
  title, 
  value, 
  format, 
  color = '#6b7280',
  isGap = false,
  benchmark,
  tooltipText,
  maxValue = 1
}: MetricBarProps) => {
  console.log(`[MetricBar] Rendering ${title}:`, {
    value,
    format,
    benchmark,
    color,
    tooltipText
  });

  const formattedValue = formatNumber(value, format, 1);
  const formattedBenchmark = benchmark !== undefined 
    ? formatNumber(benchmark, format, 1)
    : null;
  
  // Calculate difference for display
  const difference = benchmark !== undefined ? value - benchmark : 0;
  const percentDifference = benchmark !== undefined && benchmark !== 0 
    ? ((difference / Math.abs(benchmark)) * 100)
    : 0;
  
  const formattedDifference = Math.abs(percentDifference) >= 0.1 
    ? `${percentDifference > 0 ? '+' : ''}${percentDifference.toFixed(1)}%`
    : '±0%';
  
  console.log(`[MetricBar] ${title} formatted values:`, {
    formattedValue,
    formattedBenchmark,
    formattedDifference,
    percentDifference
  });
  
  return (
    <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-1 flex-1">
          <p className="text-sm font-medium text-gray-900">{title}</p>
          {tooltipText && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-help">
                    <Info className="h-3.5 w-3.5 text-gray-400" />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">{tooltipText}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
      
      {/* Main Value Display */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-gray-600">Archetype Value</span>
          <span className="text-lg font-bold text-gray-900">{formattedValue}</span>
        </div>
        
        {benchmark !== undefined && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-600">Archetype Average</span>
              <span className="text-sm font-semibold text-gray-700">{formattedBenchmark}</span>
            </div>
            
            <div className="flex justify-between items-center pt-1 border-t border-gray-200">
              <span className="text-xs font-medium text-gray-600">Difference</span>
              <span className="text-sm font-semibold text-gray-800">{formattedDifference}</span>
            </div>
          </>
        )}
      </div>
      
      {isGap && (
        <p className="text-xs text-gray-500 mt-2">
          {value > 0.5 ? 'Significant improvement opportunity' : 'Performing well'}
        </p>
      )}
    </div>
  );
};

export default MetricBar;
