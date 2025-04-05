
import React from 'react';

interface StatCardProps {
  value: string;
  label: string;
  color?: string;
}

const StatCard = ({ value, label, color = 'blue-500' }: StatCardProps) => {
  // Check if the color is one of our custom archetype or family colors
  const isCustomColor = color.startsWith('archetype-') || color.startsWith('family-');
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center justify-center">
      <span className={`text-4xl md:text-5xl font-bold ${isCustomColor ? `text-${color}` : `text-${color}`}`}>
        {value}
      </span>
      <span className="text-gray-600 text-center mt-2">{label}</span>
    </div>
  );
};

export default StatCard;
