
import React from 'react';
import { formatNumber } from '@/utils/formatters';

interface MetricBarProps {
  title: string;
  value: number;
  format: 'number' | 'percent' | 'currency';
  color?: string;
  isGap?: boolean;
}

const MetricBar = ({ 
  title, 
  value, 
  format, 
  color = '#3b82f6',
  isGap = false,
}: MetricBarProps) => {
  const barWidth = `${Math.min(value * 100, 100)}%`;
  const formattedValue = formatNumber(value, format, 1);
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm font-semibold">{formattedValue}</p>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full" 
          style={{ 
            width: barWidth,
            backgroundColor: color,
            opacity: isGap ? 0.8 : 1,
          }} 
        />
      </div>
      {isGap && (
        <p className="text-xs text-gray-500">
          {value > 0.5 ? 'Significant improvement opportunity' : 'Performing well'}
        </p>
      )}
    </div>
  );
};

export default MetricBar;
