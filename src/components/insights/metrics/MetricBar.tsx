
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
  color = '#3b82f6',
  isGap = false,
  benchmark,
  tooltipText,
  maxValue = 1
}: MetricBarProps) => {
  const normalizedValue = Math.min(value / maxValue, 1);
  const barWidth = `${Math.min(normalizedValue * 100, 100)}%`;
  const formattedValue = formatNumber(value, format, 1);
  
  const formattedBenchmark = benchmark !== undefined 
    ? formatNumber(benchmark, format, 1)
    : null;
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <p className="text-sm font-medium">{title}</p>
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
        <p className="text-sm font-semibold">{formattedValue}</p>
      </div>
      
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden relative">
        <div 
          className="h-full rounded-full" 
          style={{ 
            width: barWidth,
            backgroundColor: color,
            opacity: isGap ? 0.8 : 1,
          }} 
        />
        
        {benchmark !== undefined && (
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-gray-800"
            style={{ 
              left: `${Math.min((benchmark / maxValue) * 100, 100)}%`,
            }}
          />
        )}
      </div>
      
      {benchmark !== undefined && (
        <div className="flex justify-end">
          <p className="text-xs text-gray-500">
            Benchmark: {formattedBenchmark}
          </p>
        </div>
      )}
      
      {isGap && (
        <p className="text-xs text-gray-500">
          {value > 0.5 ? 'Significant improvement opportunity' : 'Performing well'}
        </p>
      )}
    </div>
  );
};

export default MetricBar;
