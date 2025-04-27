
import React from 'react';
import { formatNumber } from '@/utils/formatters';

interface MetricCardProps {
  title: string;
  value: number;
  format: 'number' | 'percent' | 'currency';
  decimals?: number;
  suffix?: string;
}

const MetricCard = ({ 
  title, 
  value, 
  format, 
  decimals = 0,
  suffix = ''
}: MetricCardProps) => {
  const formattedValue = formatNumber(value, format, decimals);
  
  return (
    <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <div className="text-2xl font-bold">
        {formattedValue} {suffix && <span className="text-sm font-normal ml-1">{suffix}</span>}
      </div>
    </div>
  );
};

export default MetricCard;
