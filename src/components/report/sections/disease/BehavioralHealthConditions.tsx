
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPercent } from '@/utils/formatters';
import { Brain } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BehavioralHealthConditionsProps {
  reportData: any;
  averageData: any;
}

const BehavioralHealthConditions = ({ reportData, averageData }: BehavioralHealthConditionsProps) => {
  // Check if we have valid data
  if (!reportData) return null;

  // Define behavioral health conditions
  const conditions = [
    { id: 'Dise_Mental Health Disorder Prevalence', label: 'Mental Health Disorders' },
    { id: 'Dise_Substance Use Disorder Prevalence', label: 'Substance Use Disorders' },
    { id: 'Dise_Anxiety Prevalence', label: 'Anxiety' },
    { id: 'Dise_Major Recurrent Depression Prevalence', label: 'Major Depression' },
    { id: 'Dise_PTSD Prevalence', label: 'PTSD' },
  ];

  // Format data for the chart
  const chartData = conditions.map(condition => ({
    name: condition.label,
    population: reportData[condition.id] ? Math.round(reportData[condition.id] * 1000) / 10 : 0,
    benchmark: averageData && averageData[condition.id] ? 
               Math.round(averageData[condition.id] * 1000) / 10 : 0
  }));

  // Determine if this archetype has higher than average behavioral health prevalence
  const hasHigherThanAverage = conditions.some(condition => {
    const value = reportData[condition.id] || 0;
    const avgValue = averageData && averageData[condition.id] ? averageData[condition.id] : 0;
    return value > avgValue * 1.1; // 10% higher considered significant
  });

  return (
    <Card>
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          <span>Behavioral Health Conditions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Behavioral health conditions frequently co-occur with physical health conditions and can significantly
            impact healthcare costs and outcomes if not properly addressed.
          </p>
          {hasHigherThanAverage && (
            <div className="mt-2 p-3 bg-purple-50 border border-purple-100 rounded-md">
              <p className="text-sm text-purple-700">
                <strong>Note:</strong> This population has higher than average prevalence of behavioral health conditions,
                suggesting a need for increased mental health support and services.
              </p>
            </div>
          )}
        </div>
        
        <div className="h-72 w-full">
          <ChartContainer
            config={{
              population: { color: "#8b5cf6" },
              benchmark: { color: "#c4b5fd" }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
                barSize={20}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tickSize={0}
                  tick={(props) => {
                    const { x, y, payload } = props;
                    return (
                      <g transform={`translate(${x},${y})`}>
                        <text 
                          x={0} 
                          y={0} 
                          dy={16} 
                          textAnchor="end" 
                          fill="#666"
                          transform="rotate(-45)"
                          fontSize={12}
                        >
                          {payload.value}
                        </text>
                      </g>
                    );
                  }}
                  scale="point"
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis 
                  label={{ value: '%', angle: -90, position: 'insideLeft' }}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-2 border border-gray-200 shadow-md rounded-md">
                          <p className="font-medium">{label}</p>
                          <p className="text-purple-600">
                            Your Population: {payload[0].value}%
                          </p>
                          <p className="text-purple-400">
                            Benchmark: {payload[1].value}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  payload={[
                    { value: 'Your Population', type: 'square', color: '#8b5cf6' },
                    { value: 'Benchmark', type: 'square', color: '#c4b5fd' }
                  ]}
                />
                <Bar dataKey="population" name="Your Population" fill="#8b5cf6" />
                <Bar dataKey="benchmark" name="Benchmark" fill="#c4b5fd" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        
        <div className="mt-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 font-medium">Condition</th>
                <th className="text-right py-2 font-medium">Prevalence</th>
                <th className="text-right py-2 font-medium">Benchmark</th>
                <th className="text-right py-2 font-medium">Difference</th>
              </tr>
            </thead>
            <tbody>
              {conditions.map(condition => {
                const value = reportData[condition.id] || 0;
                const avgValue = averageData && averageData[condition.id] ? averageData[condition.id] : 0;
                const diff = value - avgValue;
                const diffClass = diff > 0 ? "text-amber-600" : diff < 0 ? "text-green-600" : "text-gray-600";
                
                return (
                  <tr key={condition.id} className="border-b border-gray-100">
                    <td className="py-2">{condition.label}</td>
                    <td className="text-right py-2">{formatPercent(value)}</td>
                    <td className="text-right py-2">{formatPercent(avgValue)}</td>
                    <td className={`text-right py-2 ${diffClass}`}>
                      {diff > 0 ? '+' : ''}{formatPercent(diff)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default BehavioralHealthConditions;
