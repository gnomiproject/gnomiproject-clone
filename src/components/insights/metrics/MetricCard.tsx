
import React from 'react';
import { formatNumber } from '@/utils/formatters';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number;
  format: 'number' | 'percent' | 'currency';
  decimals?: number;
  suffix?: string;
  change?: number;
  isPositive?: boolean;
}

const MetricCard = ({ 
  title, 
  value, 
  format, 
  decimals = 0,
  suffix = '',
  change,
  isPositive
}: MetricCardProps) => {
  const formattedValue = formatNumber(value, format, decimals);
  
  return (
    <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <div className="text-2xl font-bold flex items-baseline">
        <span>{formattedValue}</span>
        {suffix && <span className="text-sm font-normal ml-1">{suffix}</span>}
      </div>
      
      {change !== undefined && (
        <div className="flex items-center mt-2">
          {isPositive ? (
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          ) : change === 0 ? (
            <Minus className="h-4 w-4 text-gray-400 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
          )}
          <span className={`text-xs font-medium ${
            isPositive ? 'text-green-500' : change === 0 ? 'text-gray-500' : 'text-red-500'
          }`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
