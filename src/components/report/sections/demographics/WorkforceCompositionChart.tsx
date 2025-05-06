
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface WorkforceCompositionChartProps {
  percentFemale: number;
  averagePercentFemale: number;
  archetype: string;
}

const WorkforceCompositionChart: React.FC<WorkforceCompositionChartProps> = ({
  percentFemale,
  averagePercentFemale,
  archetype
}) => {
  // Format gender data for the chart
  const genderData = [
    { name: 'Female', value: percentFemale || 0 },
    { name: 'Male', value: 100 - (percentFemale || 0) }
  ];
  
  // Comparison data for the archetype vs average
  const comparisonData = [
    { name: `${archetype} (Female %)`, value: percentFemale || 0 },
    { name: 'Average (Female %)', value: averagePercentFemale || 0 }
  ];
  
  const COLORS = ['#8884d8', '#82ca9d'];
  
  return (
    <div className="bg-white rounded-lg border p-4 h-full">
      <h3 className="text-lg font-medium mb-4">Workforce Composition</h3>
      
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2">
          <h4 className="text-sm font-medium mb-2 text-center">Gender Distribution</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => {
                    // Fix: Add type guard before calling toFixed
                    const formattedPercent = typeof percent === 'number' 
                      ? `${(percent * 100).toFixed(0)}%` 
                      : `${percent}%`;
                    return `${name}: ${formattedPercent}`;
                  }}
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => {
                    // Fix: Add type guard before calling toFixed
                    return typeof value === 'number' 
                      ? `${value.toFixed(1)}%` 
                      : `${value}%`;
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="md:w-1/2 mt-4 md:mt-0">
          <h4 className="text-sm font-medium mb-2">Demographic Summary</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span>Female Employees:</span>
              <span className="font-semibold">{percentFemale ? percentFemale.toFixed(1) : 'N/A'}%</span>
            </li>
            <li className="flex justify-between">
              <span>Average Female %:</span>
              <span className="font-semibold">{averagePercentFemale ? averagePercentFemale.toFixed(1) : 'N/A'}%</span>
            </li>
            <li className="flex justify-between">
              <span>Difference:</span>
              <span className="font-semibold text-gray-600">
                {percentFemale && averagePercentFemale
                  ? (percentFemale > averagePercentFemale ? '+' : '') + 
                    (percentFemale - averagePercentFemale).toFixed(1) + '%'
                  : 'N/A'}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WorkforceCompositionChart;
