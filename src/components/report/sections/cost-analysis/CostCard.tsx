
import React from 'react';
import { DollarSign } from 'lucide-react';
import { formatNumber } from '@/utils/formatters';

interface CostCardProps { 
  title: string; 
  value: number; 
  average: number; 
  icon?: React.ReactNode;
  betterDirection?: 'higher' | 'lower';
}

const CostCard = ({ 
  title, 
  value, 
  average, 
  icon = <DollarSign className="h-5 w-5" />,
  betterDirection = 'lower'
}: CostCardProps) => {
  const formattedValue = formatNumber(value, 'currency', 0);
  const { text, type } = formatComparison(value, average, betterDirection);
  
  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center mb-2">
        <div className={`p-2 rounded-lg mr-3 ${
          type === 'positive' ? 'bg-green-100' : 
          type === 'negative' ? 'bg-red-100' : 'bg-gray-100'
        }`}>
          {icon}
        </div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <div className="mt-2">
        <div className="text-2xl font-bold">
          {formattedValue}
        </div>
        <p className={`text-sm mt-1 ${
          type === 'positive' ? 'text-green-600' : 
          type === 'negative' ? 'text-red-600' : 'text-gray-600'
        }`}>
          {text}
        </p>
      </div>
    </div>
  );
};

// Format comparison text and determine if it's positive or negative
const formatComparison = (value: number, benchmark: number, betterDirection: 'higher' | 'lower' = 'higher'): { text: string; type: 'positive' | 'negative' | 'neutral' } => {
  if (!value || !benchmark) {
    return { text: 'No comparison data', type: 'neutral' };
  }
  
  const diff = value - benchmark;
  const percentDiff = (diff / benchmark) * 100;
  
  if (Math.abs(percentDiff) < 1) {
    return { text: 'On par with population average', type: 'neutral' };
  }
  
  const direction = diff > 0 ? 'higher' : 'lower';
  
  // Format the benchmark/average value
  const formattedAverage = `$${benchmark.toLocaleString()}`;
    
  const text = `${Math.abs(percentDiff).toFixed(1)}% ${direction} than average (${formattedAverage})`;
  
  // Determine if this is positive or negative based on the direction
  const isPositive = 
    (betterDirection === 'higher' && diff > 0) || 
    (betterDirection === 'lower' && diff < 0);
  
  return { 
    text, 
    type: isPositive ? 'positive' : 'negative'
  };
};

export default CostCard;
