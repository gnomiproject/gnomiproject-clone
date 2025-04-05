
import React from 'react';

interface StatCardProps {
  value: string;
  label: string;
}

const StatCard = ({ value, label }: StatCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center justify-center">
      <span className="text-4xl md:text-5xl font-bold text-blue-500">{value}</span>
      <span className="text-gray-600 text-center mt-2">{label}</span>
    </div>
  );
};

export default StatCard;
