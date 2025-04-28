
import React from 'react';

interface MetricCardProps {
  title: string;
  value: number | undefined | null;
  format?: 'number' | 'percent' | 'currency';
  suffix?: string;
  decimals?: number;
}

const MetricCard = ({ 
  title, 
  value, 
  format = 'number',
  suffix = '',
  decimals = 0
}: MetricCardProps) => {
  
  const formatValue = (value: number | undefined | null): string => {
    if (value === undefined || value === null) {
      return 'N/A';
    }

    switch (format) {
      case 'percent':
        return `${(value * 100).toFixed(decimals)}%`;
      case 'currency':
        return `$${value.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        })}`;
      case 'number':
      default:
        return value.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        });
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
      <p className="text-gray-600 text-sm mb-1">{title}</p>
      <p className="text-2xl font-bold">
        {formatValue(value)} {suffix}
      </p>
    </div>
  );
};

export default MetricCard;
