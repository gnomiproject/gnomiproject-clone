
import React from 'react';
import { Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatNumber } from '@/utils/formatters';

interface WorkforceCompositionChartProps {
  reportData: any;
  averageData: any;
}

const WorkforceCompositionChart: React.FC<WorkforceCompositionChartProps> = ({ reportData, averageData }) => {
  // Prepare data for the chart
  const chartData = [
    {
      name: 'Employees',
      'Your Value': reportData["Demo_Average Employees"] || 0,
      'Archetype Average': averageData["Demo_Average Employees"] || 0
    },
    {
      name: 'Members',
      'Your Value': reportData["Demo_Average Members"] || 0,
      'Archetype Average': averageData["Demo_Average Members"] || 0
    },
    {
      name: 'Female Population (%)',
      'Your Value': (reportData["Demo_Average Percent Female"] || 0) * 100,
      'Archetype Average': (averageData["Demo_Average Percent Female"] || 0) * 100
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Users className="mr-2 h-5 w-5 text-blue-600" />
          Workforce Composition
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatNumber(value as number, 'number', 0)} />
              <Legend />
              <Bar dataKey="Your Value" fill="#3b82f6" />
              <Bar dataKey="Archetype Average" fill="#94a3b8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p>
            This archetype has an average of {formatNumber(reportData["Demo_Average Employees"] || 0, 'number', 0)} employees 
            and {formatNumber(reportData["Demo_Average Members"] || 0, 'number', 0)} total members. 
            Women represent approximately {formatNumber(reportData["Demo_Average Percent Female"] || 0, 'percent', 1)} of the workforce.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkforceCompositionChart;
