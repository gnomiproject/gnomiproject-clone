
import React from 'react';
import { Map } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from '@/utils/formatters';
import { calculatePercentageDifference } from '@/utils/reports/metricUtils';

interface GeographicPresenceProps {
  states: number;
  averageStates: number;
}

const GeographicPresence: React.FC<GeographicPresenceProps> = ({ states, averageStates }) => {
  // Calculate percentage difference from average
  const percentDiff = calculatePercentageDifference(states, averageStates);
  const percentDiffText = `${percentDiff > 0 ? '+' : ''}${percentDiff.toFixed(1)}%`;
  
  // Determine if this is a widespread or concentrated workforce
  const isWidespread = states > averageStates;
  
  // Get color for map visualization
  const getMapColor = () => {
    if (states <= 5) return 'bg-blue-100';
    if (states <= 15) return 'bg-blue-300';
    if (states <= 30) return 'bg-blue-500';
    return 'bg-blue-700';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Map className="mr-2 h-5 w-5 text-blue-600" />
          Geographic & Age Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4">
          <div className={`h-16 w-16 rounded-md ${getMapColor()} flex items-center justify-center`}>
            <span className="text-2xl font-bold text-white">{Math.round(states)}</span>
          </div>
          <div className="ml-4">
            <h4 className="font-medium">States</h4>
            <p className="text-sm text-gray-600">
              {percentDiffText} vs. average ({Math.round(averageStates)} states)
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-gray-50 rounded-md">
            <h4 className="text-sm font-medium">Average Age</h4>
            <p className="text-xl font-semibold mt-1">{formatNumber(states, 'number', 1)} yrs</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-md">
            <h4 className="text-sm font-medium">Average Family Size</h4>
            <p className="text-xl font-semibold mt-1">{formatNumber(states, 'number', 1)}</p>
          </div>
        </div>
        
        <p className="text-sm text-gray-600">
          {isWidespread 
            ? "This archetype has a widely distributed geographic presence, which can affect healthcare costs and benefits administration across multiple regions."
            : "This archetype has a relatively concentrated geographic footprint, which may simplify benefits administration but could be impacted more by regional health trends."}
        </p>
      </CardContent>
    </Card>
  );
};

export default GeographicPresence;
