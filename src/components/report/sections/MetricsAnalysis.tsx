
import React from 'react';
import { ArchetypeDetailedData } from '@/types/archetype';
import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export interface MetricsAnalysisProps {
  reportData?: ArchetypeDetailedData;
  averageData?: any;
  archetypeData?: ArchetypeDetailedData;  // Added for backward compatibility
}

const MetricsAnalysis: React.FC<MetricsAnalysisProps> = ({ 
  reportData,
  averageData,
  archetypeData  // Support both prop patterns
}) => {
  // Use reportData as primary, fall back to archetypeData
  const data = reportData || archetypeData;
  
  if (!data) {
    return (
      <div className="space-y-6">
        <SectionTitle title="Metrics Analysis" />
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600">No metrics data available for this archetype.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Sample metrics data - in a real implementation, this would come from the database
  const metricsData = [
    { name: 'Cost PMPY', value: data['Cost_Medical & RX Paid Amount PMPY'] || 5000, average: averageData?.['Cost_Medical & RX Paid Amount PMPY'] || 4500 },
    { name: 'ER Visits', value: data['Util_Emergency Visits per 1k Members'] || 180, average: averageData?.['Util_Emergency Visits per 1k Members'] || 150 },
    { name: 'Specialist Visits', value: data['Util_Specialist Visits per 1k Members'] || 3200, average: averageData?.['Util_Specialist Visits per 1k Members'] || 3000 },
    { name: 'Risk Score', value: data['Risk_Average Risk Score'] || 1.0, average: averageData?.['Risk_Average Risk Score'] || 1.0 },
  ];

  return (
    <div className="space-y-6">
      <SectionTitle title="Metrics Analysis" />
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <p className="text-gray-600 mb-6">
          This section provides a detailed analysis of key metrics for {data.name || data.archetype_name}, compared to the archetype average (a weighted average across all healthcare archetypes).
        </p>
        
        <div className="mt-6 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={metricsData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" name="Your Archetype" fill="#8884d8" />
              <Bar dataKey="average" name="Archetype Average" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {metricsData.map((metric, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-4">
                <h3 className="font-medium text-lg">{metric.name}</h3>
                <div className="flex justify-between mt-2">
                  <div>
                    <p className="text-sm text-gray-500">Your value</p>
                    <p className="text-xl font-bold">{metric.value.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Archetype average</p>
                    <p className="text-lg">{metric.average.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-2">
                  {metric.value > metric.average ? (
                    <p className="text-amber-600 text-sm">
                      {Math.round((metric.value / metric.average - 1) * 100)}% higher than archetype average
                    </p>
                  ) : (
                    <p className="text-green-600 text-sm">
                      {Math.round((1 - metric.value / metric.average) * 100)}% lower than archetype average
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MetricsAnalysis;
