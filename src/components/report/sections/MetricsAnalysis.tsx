
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArchetypeDetailedData } from '@/types/archetype';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface MetricsAnalysisProps {
  archetypeData: ArchetypeDetailedData;
}

const MetricsAnalysis = ({ archetypeData }: MetricsAnalysisProps) => {
  // Transform metrics data for visualization
  const metricsData = [
    {
      name: 'Risk Score',
      value: archetypeData['Risk_Average Risk Score'],
      fill: '#8884d8'
    },
    {
      name: 'SDOH Score',
      value: archetypeData['SDOH_Average SDOH'],
      fill: '#82ca9d'
    },
    {
      name: 'Utilization',
      value: archetypeData['Util_Emergency Visits per 1k Members'],
      fill: '#ffc658'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Metrics Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metricsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricsAnalysis;
