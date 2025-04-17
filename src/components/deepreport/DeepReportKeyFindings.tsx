
import React from 'react';
import { DeepReportData } from '@/pages/ArchetypeDeepReport';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getArchetypeColorHex } from '@/data/colors';
import { BarChart4, CircleAlert, LineChart, TrendingDown, TrendingUp } from 'lucide-react';
import { ChartContainer } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface DeepReportKeyFindingsProps {
  reportData: DeepReportData;
}

const DeepReportKeyFindings: React.FC<DeepReportKeyFindingsProps> = ({ reportData }) => {
  const { archetypeData, deepDiveReport, distinctiveMetrics } = reportData;
  
  if (!archetypeData) {
    return <div>Loading archetype data...</div>;
  }
  
  const archetypeColor = getArchetypeColorHex(archetypeData.id);
  
  // Get top 5 distinctive metrics for visualization
  const topMetrics = distinctiveMetrics && distinctiveMetrics.length > 0
    ? distinctiveMetrics.slice(0, 5)
    : [];
  
  // Transform the metrics for the chart
  const chartData = topMetrics.map(metric => ({
    name: metric.Metric,
    value: metric["Archetype Value"],
    average: metric["Archetype Average"],
    difference: metric.Difference
  }));
  
  return (
    <div className="mb-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Key Findings</h1>
        <div 
          className="h-1 w-24 rounded-full mb-6"
          style={{ backgroundColor: archetypeColor }}
        ></div>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5" style={{ color: archetypeColor }} />
            Summary of Key Findings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {deepDiveReport?.summary_analysis ? (
            <div className="prose max-w-none">
              <p className="whitespace-pre-line text-gray-700">{deepDiveReport.summary_analysis}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <CircleAlert className="h-12 w-12 text-amber-500 mb-4" />
              <h4 className="text-lg font-semibold mb-2">Key Findings Not Available</h4>
              <p className="text-gray-500">The key findings for this archetype are still being generated.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Defining Characteristics */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart4 className="h-5 w-5" style={{ color: archetypeColor }} />
            Defining Characteristics
          </CardTitle>
        </CardHeader>
        <CardContent>
          {distinctiveMetrics && distinctiveMetrics.length > 0 ? (
            <>
              <ol className="list-decimal pl-8 space-y-4 mb-8">
                {distinctiveMetrics.slice(0, 5).map((metric, i) => (
                  <li key={`key-finding-${i}`} className="text-gray-700">
                    <span className="font-medium">{metric.Metric}:</span>{" "}
                    {metric.Difference > 0 ? 
                      `${metric.Difference.toFixed(1)}% higher than average (${metric["Archetype Value"].toFixed(1)} vs ${metric["Archetype Average"].toFixed(1)})` : 
                      `${Math.abs(metric.Difference).toFixed(1)}% lower than average (${metric["Archetype Value"].toFixed(1)} vs ${metric["Archetype Average"].toFixed(1)})`
                    }
                  </li>
                ))}
              </ol>
              
              {/* Chart visualization */}
              <div className="h-80 mt-8">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end"
                      height={80}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      name="Archetype Value" 
                      dataKey="value" 
                      fill={archetypeColor} 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      name="Average" 
                      dataKey="average" 
                      fill="#8884d8" 
                      radius={[4, 4, 0, 0]} 
                      fillOpacity={0.6}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <CircleAlert className="h-12 w-12 text-amber-500 mb-4" />
              <h4 className="text-lg font-semibold mb-2">Distinctive Metrics Not Available</h4>
              <p className="text-gray-500">The distinctive metrics for this archetype are still being generated.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {distinctiveMetrics && distinctiveMetrics.length >= 3 ? (
          distinctiveMetrics.slice(0, 3).map((metric, index) => {
            const isPositive = metric.Difference > 0;
            const TrendIcon = isPositive ? TrendingUp : TrendingDown;
            const trendColor = isPositive ? 'text-emerald-500' : 'text-rose-500';
            
            return (
              <Card key={index} className="border-t-4" style={{ borderTopColor: archetypeColor }}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-gray-500 text-sm">{metric.Metric}</div>
                      <div className="text-2xl font-bold mt-1">
                        {Number(metric["Archetype Value"]).toFixed(1)}
                      </div>
                    </div>
                    <div className={`flex items-center ${trendColor}`}>
                      <TrendIcon className="h-5 w-5 mr-1" />
                      <span>{metric.Difference > 0 ? '+' : ''}{Number(metric.Difference).toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    vs. archetype average: {Number(metric["Archetype Average"]).toFixed(1)}
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="col-span-3">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center py-8">
                <CircleAlert className="h-8 w-8 text-amber-500 mb-2" />
                <p className="text-gray-500">No key performance indicators available</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Context and Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Context and Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          {deepDiveReport?.distinctive_metrics_summary ? (
            <div className="prose max-w-none text-gray-700">
              <p className="whitespace-pre-line">{deepDiveReport.distinctive_metrics_summary}</p>
            </div>
          ) : (
            <div className="py-4">
              <p className="text-gray-500">
                The key findings above represent the most distinctive characteristics of this archetype 
                compared to the overall population. These significant variations from average highlight 
                areas where tailored strategies are likely to have the greatest impact.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DeepReportKeyFindings;
