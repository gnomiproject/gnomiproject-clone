
import React, { useState } from 'react';
import { DeepReportData } from '@/pages/ArchetypeDeepReport';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getArchetypeColorHex } from '@/data/colors';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CircleAlert, Users, LineChart, PieChart, BarChart2 } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, LabelList } from 'recharts';

interface DeepReportDetailedMetricsProps {
  reportData: DeepReportData;
}

const DeepReportDetailedMetrics: React.FC<DeepReportDetailedMetricsProps> = ({ reportData }) => {
  const { archetypeData, deepDiveReport } = reportData;
  const [activeCategory, setActiveCategory] = useState<string>('Demographics');
  
  if (!archetypeData) {
    return <div>Loading archetype data...</div>;
  }
  
  const archetypeColor = getArchetypeColorHex(archetypeData.id);
  
  // Get all data categories from the deep dive report
  const dataCategories = deepDiveReport?.data_details
    ? Object.keys(deepDiveReport.data_details)
    : ['Demographics', 'Cost', 'Utilization', 'Disease'];
  
  // Get metrics for the active category
  const activeMetrics = deepDiveReport?.data_details?.[activeCategory] || [];
  
  // Transform metrics for chart display
  const chartData = activeMetrics.map((metric: any) => ({
    name: metric.Metric,
    value: metric["Archetype Value"],
    average: metric["Archetype Average"],
    difference: metric.Difference
  }));
  
  return (
    <div className="mb-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Detailed Metrics</h1>
        <div 
          className="h-1 w-24 rounded-full mb-6"
          style={{ backgroundColor: archetypeColor }}
        ></div>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Metrics Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-6">
            These detailed metrics provide a comprehensive view of the {archetypeData.name} archetype.
            Metrics are compared to the average across all archetypes, highlighting significant variations
            that define this archetype's unique characteristics.
          </p>
          
          <Tabs 
            defaultValue={dataCategories[0]} 
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
              <TabsTrigger value="Demographics" className="flex items-center gap-2">
                <Users className="h-4 w-4" /> Demographics
              </TabsTrigger>
              <TabsTrigger value="Cost" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" /> Cost
              </TabsTrigger>
              <TabsTrigger value="Utilization" className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" /> Utilization
              </TabsTrigger>
              <TabsTrigger value="Disease" className="flex items-center gap-2">
                <LineChart className="h-4 w-4" /> Disease
              </TabsTrigger>
            </TabsList>
            
            {dataCategories.map((category) => (
              <TabsContent key={category} value={category}>
                {deepDiveReport?.data_details?.[category] && deepDiveReport.data_details[category].length > 0 ? (
                  <div>
                    {/* Chart visualization */}
                    <div className="h-80 mb-8">
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
                          >
                            <LabelList dataKey="value" position="top" formatter={(value: number) => value.toFixed(1)} />
                          </Bar>
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
                    
                    {/* Metrics table */}
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Metric</TableHead>
                          <TableHead className="text-right">Value</TableHead>
                          <TableHead className="text-right">Average</TableHead>
                          <TableHead className="text-right">Difference</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {deepDiveReport.data_details[category].map((metric: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{metric.Metric}</TableCell>
                            <TableCell className="text-right">{Number(metric["Archetype Value"]).toFixed(2)}</TableCell>
                            <TableCell className="text-right">{Number(metric["Archetype Average"]).toFixed(2)}</TableCell>
                            <TableCell className={`text-right ${Number(metric.Difference) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {Number(metric.Difference) > 0 ? '+' : ''}{Number(metric.Difference).toFixed(2)}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <CircleAlert className="h-12 w-12 text-amber-500 mb-4" />
                    <h4 className="text-lg font-semibold mb-2">No {category} Data Available</h4>
                    <p className="text-gray-500">The {category.toLowerCase()} metrics for this archetype are still being generated.</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Data interpretation */}
      <Card>
        <CardHeader>
          <CardTitle>Data Interpretation</CardTitle>
        </CardHeader>
        <CardContent>
          {deepDiveReport?.summary_analysis ? (
            <div className="prose max-w-none text-gray-700">
              <p className="mb-6">These metrics should be interpreted in the context of the archetype's overall profile:</p>
              <p className="whitespace-pre-line">{deepDiveReport.summary_analysis}</p>
            </div>
          ) : (
            <div className="prose max-w-none text-gray-700">
              <p className="mb-6">These metrics should be interpreted in the context of the archetype's overall profile:</p>
              <p>
                The {archetypeData.name} archetype represents a distinctive pattern of healthcare utilization and cost. 
                Understanding these metrics in relation to each other provides a comprehensive view of this population's 
                healthcare needs and opportunities for optimization.
              </p>
              <p>
                When reviewing these metrics, consider how they interact with each other and reflect underlying 
                characteristics of the population. For example, higher specialist utilization paired with lower 
                emergency utilization may indicate effective care navigation.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DeepReportDetailedMetrics;
