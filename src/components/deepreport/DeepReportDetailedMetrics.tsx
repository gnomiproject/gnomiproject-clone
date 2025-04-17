import React, { useState } from 'react';
import { DeepReportData } from '@/pages/ArchetypeDeepReport';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, LineChart, CircleAlert, PieChart, Users, Building } from 'lucide-react';
import {
  Bar,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface DeepReportDetailedMetricsProps {
  reportData: DeepReportData;
}

const DeepReportDetailedMetrics = ({ reportData }: DeepReportDetailedMetricsProps) => {
  const { archetypeData, deepDiveReport } = reportData;
  const [selectedCategory, setSelectedCategory] = useState('Demographics');
  
  if (!deepDiveReport?.data_details) {
    return (
      <div className="text-center py-12">
        <CircleAlert className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Detailed Metrics Not Available</h3>
        <p className="text-gray-500">There are no detailed metrics available for this archetype.</p>
      </div>
    );
  }
  
  const categories = Object.keys(deepDiveReport.data_details).filter(
    key => Array.isArray(deepDiveReport.data_details[key]) && 
    ['Demographics', 'Cost', 'Utilization', 'Disease', 'SDOH', 'MentalHealth'].includes(key)
  );
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Demographics':
        return <Users className="h-4 w-4" />;
      case 'Cost':
        return <PieChart className="h-4 w-4" />;
      case 'Utilization':
        return <BarChart className="h-4 w-4" />;
      case 'Disease':
        return <LineChart className="h-4 w-4" />;
      case 'SDOH':
        return <Building className="h-4 w-4" />;
      case 'MentalHealth':
        return <CircleAlert className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getChartData = (category: string) => {
    if (!deepDiveReport.data_details[category] || !Array.isArray(deepDiveReport.data_details[category])) {
      return [];
    }

    return deepDiveReport.data_details[category]
      .slice(0, 10)
      .map((item: any) => ({
        name: item.Metric ? (item.Metric.length > 15 ? `${item.Metric.substring(0, 15)}...` : item.Metric) : 'Unknown',
        fullName: item.Metric || 'Unknown',
        archetypeValue: item["Archetype Value"] || 0,
        averageValue: item["Archetype Average"] || 0,
        difference: item.Difference || 0,
      }));
  };

  // Get color from archetype data for chart
  const archetypeColor = `#${archetypeData?.hexColor?.replace('#', '') || '9b87f5'}`;
  const averageColor = '#8E9196';

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Detailed Metrics Analysis
          </CardTitle>
          <CardDescription>
            In-depth breakdown of key metrics across different categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue={categories[0] || 'Demographics'} 
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 lg:grid-cols-6 mb-8">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="flex items-center gap-1">
                  {getCategoryIcon(category)}
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {categories.map((category) => (
              <TabsContent key={category} value={category} className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>{category} Overview</CardTitle>
                    <CardDescription>
                      {category === 'Demographics' && 'Population and workforce characteristics'}
                      {category === 'Cost' && 'Financial metrics and cost drivers'}
                      {category === 'Utilization' && 'Service utilization patterns'}
                      {category === 'Disease' && 'Prevalence of health conditions'}
                      {category === 'SDOH' && 'Social determinants of health factors'}
                      {category === 'MentalHealth' && 'Mental health conditions and care'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-10">
                      <h4 className="text-sm font-medium mb-4">Top Metrics Comparison</h4>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart
                            data={getChartData(category)}
                            layout="vertical"
                            margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis 
                              dataKey="name" 
                              type="category"
                              width={150}
                              tick={{ fontSize: 12 }}
                            />
                            <Tooltip 
                              formatter={(value, name) => {
                                // Add type checking before calling toFixed
                                const formattedValue = typeof value === 'number' 
                                  ? value.toFixed(2) 
                                  : value;
                                return [formattedValue, name === 'archetypeValue' ? 'Archetype' : 'Average'];
                              }}
                              labelFormatter={(label) => {
                                const dataItem = getChartData(category).find(item => item.name === label);
                                return dataItem?.fullName || label;
                              }}
                            />
                            <Legend />
                            <Bar 
                              name="Archetype" 
                              dataKey="archetypeValue" 
                              fill={archetypeColor} 
                            />
                            <Bar 
                              name="Average" 
                              dataKey="averageValue" 
                              fill={averageColor} 
                            />
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed {category} Data</CardTitle>
                    <CardDescription>
                      Complete metrics with comparison to archetype average
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[200px]">Metric</TableHead>
                          <TableHead className="text-right">Archetype Value</TableHead>
                          <TableHead className="text-right">Average</TableHead>
                          <TableHead className="text-right">Difference</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {deepDiveReport.data_details[category]?.map((item: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.Metric}</TableCell>
                            <TableCell className="text-right">
                              {typeof item["Archetype Value"] === 'number' ? 
                                item["Archetype Value"]?.toFixed(2) : 
                                item["Archetype Value"] || 'N/A'}
                            </TableCell>
                            <TableCell className="text-right">
                              {typeof item["Archetype Average"] === 'number' ? 
                                item["Archetype Average"]?.toFixed(2) : 
                                item["Archetype Average"] || 'N/A'}
                            </TableCell>
                            <TableCell className={`text-right ${item.Difference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {item.Difference > 0 ? '+' : ''}
                              {typeof item.Difference === 'number' ? 
                                item.Difference?.toFixed(2) : 
                                item.Difference || 'N/A'}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
            
            {categories.length === 0 && (
              <div className="text-center py-12">
                <CircleAlert className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Metrics Categories Available</h3>
                <p className="text-gray-500">There are no metric categories available for this archetype.</p>
              </div>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeepReportDetailedMetrics;
