
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
import { calculatePercentageDifference, getMetricComparisonText } from '@/utils/reports/metricUtils';

interface MetricsAnalysisProps {
  archetypeData: ArchetypeDetailedData;
  averageData?: any;
}

const MetricsAnalysis = ({ archetypeData, averageData }: MetricsAnalysisProps) => {
  // Get the average data or use default values
  const averages = averageData || {
    "Risk_Average Risk Score": 1.0,
    "SDOH_Average SDOH": 0.5,
    "Util_Emergency Visits per 1k Members": 150,
    "Util_Specialist Visits per 1k Members": 1326.63
  };
  
  // Transform metrics data for visualization with correct comparison to average
  const metricsData = [
    {
      name: 'Risk Score',
      value: archetypeData['Risk_Average Risk Score'],
      average: averages['Risk_Average Risk Score'],
      percentDiff: calculatePercentageDifference(
        archetypeData['Risk_Average Risk Score'] || 0, 
        averages['Risk_Average Risk Score'] || 1
      ),
      fill: '#8884d8'
    },
    {
      name: 'SDOH Score',
      value: archetypeData['SDOH_Average SDOH'],
      average: averages['SDOH_Average SDOH'],
      percentDiff: calculatePercentageDifference(
        archetypeData['SDOH_Average SDOH'] || 0,
        averages['SDOH_Average SDOH'] || 0.5
      ),
      fill: '#82ca9d'
    },
    {
      name: 'Emergency Visits',
      value: archetypeData['Util_Emergency Visits per 1k Members'],
      average: averages['Util_Emergency Visits per 1k Members'],
      percentDiff: calculatePercentageDifference(
        archetypeData['Util_Emergency Visits per 1k Members'] || 0,
        averages['Util_Emergency Visits per 1k Members'] || 150
      ),
      fill: '#ff8042'
    },
    {
      name: 'Specialist Visits',
      value: archetypeData['Util_Specialist Visits per 1k Members'],
      average: averages['Util_Specialist Visits per 1k Members'],
      percentDiff: calculatePercentageDifference(
        archetypeData['Util_Specialist Visits per 1k Members'] || 0,
        averages['Util_Specialist Visits per 1k Members'] || 1326.63
      ),
      fill: '#ffc658'
    }
  ];

  // Custom tooltip component for the chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const { text, color } = getMetricComparisonText(data.value, data.average, data.name);
      
      return (
        <div className="bg-white p-3 border rounded shadow-sm">
          <p className="font-medium">{data.name}</p>
          <p>Value: {data.value}</p>
          <p>Average: {data.average}</p>
          <p className={color}>{text}</p>
        </div>
      );
    }
    return null;
  };

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
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricsAnalysis;
