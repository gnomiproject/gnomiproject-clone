
import React from 'react';
import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GeographicPresenceProps {
  states: number;
  averageStates: number;
}

const GeographicPresence: React.FC<GeographicPresenceProps> = ({ states, averageStates }) => {
  // Calculate the percentage of states covered (out of 50)
  const percentageCoverage = states ? (states / 50) * 100 : 0;
  
  // Determine if this is a national or regional presence
  const presenceType = states > 25 ? 'National' : 'Regional';
  
  // Compare to average
  const comparisonText = states > averageStates 
    ? `${Math.round(states - averageStates)} more states than average (${Math.round(averageStates)})`
    : `${Math.round(averageStates - states)} fewer states than average (${Math.round(averageStates)})`;
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <MapPin className="mr-2 h-5 w-5 text-blue-600" />
          Geographic Presence
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Present in</span>
            <span className="text-2xl font-bold">{Math.round(states) || 'N/A'} states</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${percentageCoverage}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>Regional</span>
            <span>National</span>
          </div>
          
          <div className="text-sm">
            <p>
              <span className="font-medium text-blue-700">{presenceType} presence</span>, covering
              approximately {percentageCoverage.toFixed(0)}% of the US.
            </p>
            <p className="mt-1 text-gray-600">{comparisonText}</p>
          </div>
          
          <div className="border-t pt-3 mt-3">
            <h4 className="font-medium text-sm mb-2">Geographic Impact</h4>
            <p className="text-sm text-gray-700">
              Geographic distribution affects healthcare costs, provider networks, and employee access
              to care. {states > averageStates 
                ? 'Wider geographic distribution may require more complex benefits administration.'
                : 'More concentrated geography may allow for focused provider networks.'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeographicPresence;
