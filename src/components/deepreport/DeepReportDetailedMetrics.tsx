
import React, { useState, useEffect } from 'react';
import { DeepReportData } from '@/pages/ArchetypeDeepReport';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, LineChart, CircleAlert, PieChart, Users, Building, InfoIcon } from 'lucide-react';
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
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { Tooltip as UITooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { useDistinctiveMetrics } from '@/hooks/archetype/useDistinctiveMetrics';

interface DeepReportDetailedMetricsProps {
  reportData: DeepReportData;
}

const DeepReportDetailedMetrics = ({ reportData }: DeepReportDetailedMetricsProps) => {
  const { archetypeData, deepDiveReport } = reportData;
  const [selectedCategory, setSelectedCategory] = useState('Demographics');
  const [sdohMetrics, setSdohMetrics] = useState<any[]>([]);
  const [isLoadingSdoh, setIsLoadingSdoh] = useState(false);
  
  // Use the hook to fetch SDOH metrics
  const { fetchSdohMetrics } = useDistinctiveMetrics();

  // Fetch SDOH metrics when component mounts
  useEffect(() => {
    const loadSdohMetrics = async () => {
      if (archetypeData?.id) {
        setIsLoadingSdoh(true);
        const data = await fetchSdohMetrics(archetypeData.id);
        setSdohMetrics(data);
        setIsLoadingSdoh(false);
      }
    };
    
    loadSdohMetrics();
  }, [archetypeData?.id, fetchSdohMetrics]);
  
  // Check if we have data to display
  if (!deepDiveReport?.data_details && sdohMetrics.length === 0) {
    return (
      <div className="text-center py-12">
        <CircleAlert className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Detailed Metrics Not Available</h3>
        <p className="text-gray-500">There are no detailed metrics available for this archetype.</p>
      </div>
    );
  }
  
  // Create a combined data structure with both original data and sdoh metrics
  const combinedDataDetails = { ...(deepDiveReport?.data_details || {}) };
  
  // Add SDOH data if not already present
  if (sdohMetrics.length > 0 && !combinedDataDetails.SDOH) {
    combinedDataDetails.SDOH = sdohMetrics;
  }
  
  const categories = Object.keys(combinedDataDetails).filter(
    key => Array.isArray(combinedDataDetails[key]) && 
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
    if (!combinedDataDetails[category] || !Array.isArray(combinedDataDetails[category])) {
      return [];
    }

    return combinedDataDetails[category]
      .slice(0, 10)
      .map((item: any) => ({
        name: item.Metric ? (item.Metric.length > 15 ? `${item.Metric.substring(0, 15)}...` : item.Metric) : 'Unknown',
        fullName: item.Metric || 'Unknown',
        archetypeValue: item["Archetype Value"] || item["Archetype_Value"] || 0,
        averageValue: item["Archetype Average"] || item["Archetype_Average"] || 0,
        difference: item.Difference || 0,
        definition: item.definition || null,
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
                    {isLoadingSdoh && category === 'SDOH' ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">Loading SDOH metrics...</p>
                      </div>
                    ) : (
                      <TooltipProvider>
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
                            {combinedDataDetails[category]?.map((item: any, index: number) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center">
                                    {item.Metric}
                                    {item.definition && (
                                      <UITooltip>
                                        <TooltipTrigger asChild>
                                          <button className="ml-2 inline-flex items-center">
                                            <InfoIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-sm">
                                          <p>{item.definition}</p>
                                        </TooltipContent>
                                      </UITooltip>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  {typeof item["Archetype Value"] === 'number' ? 
                                    item["Archetype Value"]?.toFixed(2) : 
                                    (typeof item["Archetype_Value"] === 'number' ? 
                                      item["Archetype_Value"]?.toFixed(2) : 
                                      item["Archetype Value"] || item["Archetype_Value"] || 'N/A')}
                                </TableCell>
                                <TableCell className="text-right">
                                  {typeof item["Archetype Average"] === 'number' ? 
                                    item["Archetype Average"]?.toFixed(2) : 
                                    (typeof item["Archetype_Average"] === 'number' ? 
                                      item["Archetype_Average"]?.toFixed(2) : 
                                      item["Archetype Average"] || item["Archetype_Average"] || 'N/A')}
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
                      </TooltipProvider>
                    )}
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
