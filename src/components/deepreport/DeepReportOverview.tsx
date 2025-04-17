
import React from 'react';
import { DeepReportData } from '@/pages/ArchetypeDeepReport';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Users, Building, Globe, DollarSign, Heart, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DeepReportOverviewProps {
  reportData: DeepReportData;
}

const DeepReportOverview = ({ reportData }: DeepReportOverviewProps) => {
  const { archetypeData, familyData, deepDiveReport } = reportData;
  
  const industries = deepDiveReport?.data_details?.Industries || [];
  const demographics = deepDiveReport?.data_details?.Demographics || [];
  
  // Helper function to find metric value
  const getMetricValue = (category: string, metricName: string) => {
    if (!deepDiveReport?.data_details?.[category]) return null;
    
    const metric = deepDiveReport.data_details[category].find((m: any) => 
      m.Metric === metricName || m.Metric.toLowerCase().includes(metricName.toLowerCase())
    );
    
    return metric;
  };
  
  return (
    <div className="space-y-8" id="overview-section">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Archetype Overview</CardTitle>
          <CardDescription>
            Comprehensive profile of {archetypeData?.name || 'archetype'} ({archetypeData?.id.toUpperCase() || 'ID'})
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Archetype Summary */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Summary</h3>
            <div className="prose max-w-none">
              <p>{archetypeData?.standard?.overview || 'No overview available.'}</p>
              <p>{archetypeData?.standard?.fullDescription || ''}</p>
            </div>
          </div>

          <Separator />
          
          {/* Family Context */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Family Context</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className={`h-8 w-8 rounded-full bg-archetype-${archetypeData?.id}/10 flex items-center justify-center border-2 border-archetype-${archetypeData?.id}`}>
                <span className="text-sm font-bold text-archetype-${archetypeData?.id}">{archetypeData?.id?.charAt(0)}</span>
              </div>
              <div>
                <div className="font-medium">{familyData?.name || 'Family information unavailable'}</div>
              </div>
            </div>
            <p className="text-gray-700">{familyData?.description || 'No family description available.'}</p>
          </div>

          <Separator />
          
          {/* Industry Profile */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Industry Profile</h3>
            {industries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {industries.map((industry: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span>{industry}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No industry data available</p>
            )}
          </div>
          
          <Separator />

          {/* Key Characteristics */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Key Characteristics</h3>
            {archetypeData?.standard?.keyCharacteristics?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {archetypeData.standard.keyCharacteristics.map((trait: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-md">
                    <div className={`h-5 w-5 rounded-full bg-archetype-${archetypeData.id} text-white flex items-center justify-center mt-0.5`}>
                      <span className="text-xs">{index + 1}</span>
                    </div>
                    <div>{trait}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No key characteristics available</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Detailed Analysis Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Detailed Analysis Overview</CardTitle>
          <CardDescription>
            Key metrics across multiple domains
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="demographics">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6">
              <TabsTrigger value="demographics">Demographics</TabsTrigger>
              <TabsTrigger value="cost">Cost Analysis</TabsTrigger>
              <TabsTrigger value="utilization">Utilization</TabsTrigger>
              <TabsTrigger value="sdoh">SDOH</TabsTrigger>
              <TabsTrigger value="disease">Disease</TabsTrigger>
            </TabsList>
            
            <TabsContent value="demographics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Family Size */}
                <Card className="bg-gray-50">
                  <CardContent className="pt-6">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Average Family Size</h4>
                        <div className="text-2xl font-bold mt-1">
                          {getMetricValue('Demographics', 'Average Family Size')?.["Archetype Value"]?.toFixed(1) || 'N/A'}
                        </div>
                      </div>
                      <Users className="h-10 w-10 text-blue-500/20" />
                    </div>
                    <div className="text-xs mt-2">
                      {getMetricValue('Demographics', 'Average Family Size')?.Difference > 0 ? 
                        <span className="text-green-600">+{getMetricValue('Demographics', 'Average Family Size')?.Difference.toFixed(1)}%</span> : 
                        <span className="text-red-600">{getMetricValue('Demographics', 'Average Family Size')?.Difference.toFixed(1)}%</span>
                      } vs average ({getMetricValue('Demographics', 'Average Family Size')?.["Archetype Average"]?.toFixed(1)})
                    </div>
                  </CardContent>
                </Card>
                
                {/* Gender Composition */}
                <Card className="bg-gray-50">
                  <CardContent className="pt-6">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Gender Composition</h4>
                        <div className="text-2xl font-bold mt-1">
                          {getMetricValue('Demographics', 'Female')?.["Archetype Value"]?.toFixed(1) || 'N/A'}% Female
                        </div>
                      </div>
                      <Users className="h-10 w-10 text-purple-500/20" />
                    </div>
                    <div className="text-xs mt-2">
                      {getMetricValue('Demographics', 'Female')?.Difference > 0 ? 
                        <span className="text-green-600">+{getMetricValue('Demographics', 'Female')?.Difference.toFixed(1)}%</span> : 
                        <span className="text-red-600">{getMetricValue('Demographics', 'Female')?.Difference.toFixed(1)}%</span>
                      } vs average ({getMetricValue('Demographics', 'Female')?.["Archetype Average"]?.toFixed(1)}%)
                    </div>
                  </CardContent>
                </Card>
                
                {/* Average Age */}
                <Card className="bg-gray-50">
                  <CardContent className="pt-6">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Average Age</h4>
                        <div className="text-2xl font-bold mt-1">
                          {getMetricValue('Demographics', 'Age')?.["Archetype Value"]?.toFixed(1) || 'N/A'}
                        </div>
                      </div>
                      <Users className="h-10 w-10 text-amber-500/20" />
                    </div>
                    <div className="text-xs mt-2">
                      {getMetricValue('Demographics', 'Age')?.Difference > 0 ? 
                        <span className="text-green-600">+{getMetricValue('Demographics', 'Age')?.Difference.toFixed(1)}%</span> : 
                        <span className="text-red-600">{getMetricValue('Demographics', 'Age')?.Difference.toFixed(1)}%</span>
                      } vs average ({getMetricValue('Demographics', 'Age')?.["Archetype Average"]?.toFixed(1)})
                    </div>
                  </CardContent>
                </Card>
                
                {/* Geographic Footprint */}
                <Card className="bg-gray-50">
                  <CardContent className="pt-6">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Geographic Footprint</h4>
                        <div className="text-2xl font-bold mt-1">
                          {getMetricValue('Demographics', 'Geographic')?.["Archetype Value"]?.toFixed(0) || 'N/A'} Locations
                        </div>
                      </div>
                      <Globe className="h-10 w-10 text-green-500/20" />
                    </div>
                    <div className="text-xs mt-2">
                      Primarily in {deepDiveReport?.data_details?.RegionalData?.[0]?.["Primary Region"] || 'N/A'}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="cost" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Paid PEPY */}
                <Card className="bg-gray-50">
                  <CardContent className="pt-6">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Paid PEPY</h4>
                        <div className="text-2xl font-bold mt-1">
                          ${getMetricValue('Cost', 'Paid PEPY')?.["Archetype Value"]?.toFixed(0) || 'N/A'}
                        </div>
                      </div>
                      <DollarSign className="h-10 w-10 text-green-500/20" />
                    </div>
                    <div className="text-xs mt-2">
                      {getMetricValue('Cost', 'Paid PEPY')?.Difference > 0 ? 
                        <span className="text-red-600">+{getMetricValue('Cost', 'Paid PEPY')?.Difference.toFixed(1)}%</span> : 
                        <span className="text-green-600">{getMetricValue('Cost', 'Paid PEPY')?.Difference.toFixed(1)}%</span>
                      } vs average (${getMetricValue('Cost', 'Paid PEPY')?.["Archetype Average"]?.toFixed(0)})
                    </div>
                  </CardContent>
                </Card>
                
                {/* Risk Score */}
                <Card className="bg-gray-50">
                  <CardContent className="pt-6">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Risk Score</h4>
                        <div className="text-2xl font-bold mt-1">
                          {getMetricValue('Cost', 'Risk Score')?.["Archetype Value"]?.toFixed(2) || archetypeData?.enhanced?.riskProfile?.score || 'N/A'}
                        </div>
                      </div>
                      <AlertTriangle className="h-10 w-10 text-amber-500/20" />
                    </div>
                    <div className="text-xs mt-2">
                      {archetypeData?.enhanced?.riskProfile?.comparison || 'No comparison data available'}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Paid/Allowed Ratio */}
                <Card className="bg-gray-50">
                  <CardContent className="pt-6">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Paid/Allowed Ratio</h4>
                        <div className="text-2xl font-bold mt-1">
                          {getMetricValue('Cost', 'Paid/Allowed Ratio')?.["Archetype Value"]?.toFixed(2) || 'N/A'}
                        </div>
                      </div>
                      <DollarSign className="h-10 w-10 text-blue-500/20" />
                    </div>
                    <div className="text-xs mt-2">
                      {getMetricValue('Cost', 'Paid/Allowed Ratio')?.Difference > 0 ? 
                        <span className="text-green-600">+{getMetricValue('Cost', 'Paid/Allowed Ratio')?.Difference.toFixed(1)}%</span> : 
                        <span className="text-red-600">{getMetricValue('Cost', 'Paid/Allowed Ratio')?.Difference.toFixed(1)}%</span>
                      } vs average ({getMetricValue('Cost', 'Paid/Allowed Ratio')?.["Archetype Average"]?.toFixed(2)})
                    </div>
                  </CardContent>
                </Card>
                
                {/* Pharmacy Costs */}
                <Card className="bg-gray-50">
                  <CardContent className="pt-6">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Pharmacy Costs</h4>
                        <div className="text-2xl font-bold mt-1">
                          ${getMetricValue('Cost', 'Pharmacy')?.["Archetype Value"]?.toFixed(0) || 'N/A'}
                        </div>
                      </div>
                      <Heart className="h-10 w-10 text-red-500/20" />
                    </div>
                    <div className="text-xs mt-2">
                      {getMetricValue('Cost', 'Pharmacy')?.Difference > 0 ? 
                        <span className="text-red-600">+{getMetricValue('Cost', 'Pharmacy')?.Difference.toFixed(1)}%</span> : 
                        <span className="text-green-600">{getMetricValue('Cost', 'Pharmacy')?.Difference.toFixed(1)}%</span>
                      } vs average (${getMetricValue('Cost', 'Pharmacy')?.["Archetype Average"]?.toFixed(0)})
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="utilization" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Primary Care */}
                <Card className="bg-gray-50">
                  <CardContent className="pt-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Primary Care Visits</h4>
                      <div className="text-2xl font-bold mt-1">
                        {getMetricValue('Utilization', 'Primary Care')?.["Archetype Value"]?.toFixed(1) || 'N/A'}/1K
                      </div>
                      <div className="text-xs mt-2">
                        {getMetricValue('Utilization', 'Primary Care')?.Difference > 0 ? 
                          <span className="text-green-600">+{getMetricValue('Utilization', 'Primary Care')?.Difference.toFixed(1)}%</span> : 
                          <span className="text-red-600">{getMetricValue('Utilization', 'Primary Care')?.Difference.toFixed(1)}%</span>
                        } vs average
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Specialist Care */}
                <Card className="bg-gray-50">
                  <CardContent className="pt-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Specialist Visits</h4>
                      <div className="text-2xl font-bold mt-1">
                        {getMetricValue('Utilization', 'Specialist')?.["Archetype Value"]?.toFixed(1) || 'N/A'}/1K
                      </div>
                      <div className="text-xs mt-2">
                        {getMetricValue('Utilization', 'Specialist')?.Difference > 0 ? 
                          <span className="text-green-600">+{getMetricValue('Utilization', 'Specialist')?.Difference.toFixed(1)}%</span> : 
                          <span className="text-red-600">{getMetricValue('Utilization', 'Specialist')?.Difference.toFixed(1)}%</span>
                        } vs average
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Emergency Visits */}
                <Card className="bg-gray-50">
                  <CardContent className="pt-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Emergency Visits</h4>
                      <div className="text-2xl font-bold mt-1">
                        {getMetricValue('Utilization', 'Emergency')?.["Archetype Value"]?.toFixed(1) || 'N/A'}/1K
                      </div>
                      <div className="text-xs mt-2">
                        {getMetricValue('Utilization', 'Emergency')?.Difference > 0 ? 
                          <span className="text-red-600">+{getMetricValue('Utilization', 'Emergency')?.Difference.toFixed(1)}%</span> : 
                          <span className="text-green-600">{getMetricValue('Utilization', 'Emergency')?.Difference.toFixed(1)}%</span>
                        } vs average
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Inpatient Care */}
                <Card className="bg-gray-50">
                  <CardContent className="pt-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Inpatient Admissions</h4>
                      <div className="text-2xl font-bold mt-1">
                        {getMetricValue('Utilization', 'Inpatient')?.["Archetype Value"]?.toFixed(1) || 'N/A'}/1K
                      </div>
                      <div className="text-xs mt-2">
                        {getMetricValue('Utilization', 'Inpatient')?.Difference > 0 ? 
                          <span className="text-red-600">+{getMetricValue('Utilization', 'Inpatient')?.Difference.toFixed(1)}%</span> : 
                          <span className="text-green-600">{getMetricValue('Utilization', 'Inpatient')?.Difference.toFixed(1)}%</span>
                        } vs average
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Preventive Care */}
                <Card className="bg-gray-50">
                  <CardContent className="pt-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Preventive Visits</h4>
                      <div className="text-2xl font-bold mt-1">
                        {getMetricValue('Utilization', 'Preventive')?.["Archetype Value"]?.toFixed(1) || 'N/A'}/1K
                      </div>
                      <div className="text-xs mt-2">
                        {getMetricValue('Utilization', 'Preventive')?.Difference > 0 ? 
                          <span className="text-green-600">+{getMetricValue('Utilization', 'Preventive')?.Difference.toFixed(1)}%</span> : 
                          <span className="text-red-600">{getMetricValue('Utilization', 'Preventive')?.Difference.toFixed(1)}%</span>
                        } vs average
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Non-Utilizers */}
                <Card className="bg-gray-50">
                  <CardContent className="pt-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Non-Utilizers</h4>
                      <div className="text-2xl font-bold mt-1">
                        {getMetricValue('Utilization', 'Non-Utilizer')?.["Archetype Value"]?.toFixed(1) || 'N/A'}%
                      </div>
                      <div className="text-xs mt-2">
                        {getMetricValue('Utilization', 'Non-Utilizer')?.Difference > 0 ? 
                          <span className="text-green-600">+{getMetricValue('Utilization', 'Non-Utilizer')?.Difference.toFixed(1)}%</span> : 
                          <span className="text-red-600">{getMetricValue('Utilization', 'Non-Utilizer')?.Difference.toFixed(1)}%</span>
                        } vs average
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="sdoh" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gray-50 col-span-full">
                  <CardContent className="pt-6">
                    <h3 className="font-medium mb-2">SDOH Profile</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Social Determinants of Health (SDOH) factors that influence health outcomes for this archetype.
                    </p>
                    {deepDiveReport?.data_details?.SDOH ? (
                      <div className="space-y-4">
                        {deepDiveReport.data_details.SDOH.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between items-center">
                            <div className="text-sm">{item.Metric}</div>
                            <div className="flex items-center">
                              <div className="w-24 bg-gray-200 h-2 rounded-full overflow-hidden mr-3">
                                <div 
                                  className="bg-blue-500 h-full" 
                                  style={{ width: `${Math.min(Math.max(item["Archetype Value"] * 10, 0), 100)}%` }}
                                ></div>
                              </div>
                              <div className="text-sm font-medium">
                                {item["Archetype Value"]?.toFixed(1)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-8">
                        <p className="text-gray-500">No SDOH data available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="disease" className="space-y-4">
              <div className="grid grid-cols-1 gap-6">
                {/* Disease Prevalence */}
                <Card className="bg-gray-50">
                  <CardContent className="pt-6">
                    <h3 className="font-medium mb-3">Top Conditions</h3>
                    {deepDiveReport?.data_details?.Disease ? (
                      <div className="space-y-3">
                        {deepDiveReport.data_details.Disease.slice(0, 5).map((condition: any, index: number) => (
                          <div key={index} className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${index < 3 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                                {index + 1}
                              </div>
                              <div className="ml-2">{condition.Metric}</div>
                            </div>
                            <div>
                              <Badge variant={condition.Difference > 0 ? 'destructive' : 'outline'} className="ml-2">
                                {condition.Difference > 0 ? '+' : ''}{condition.Difference.toFixed(1)}%
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-8">
                        <p className="text-gray-500">No disease prevalence data available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Mental Health Conditions */}
                <Card className="bg-gray-50">
                  <CardContent className="pt-6">
                    <h3 className="font-medium mb-3">Mental Health Conditions</h3>
                    {deepDiveReport?.data_details?.MentalHealth ? (
                      <div className="space-y-3">
                        {deepDiveReport.data_details.MentalHealth.map((condition: any, index: number) => (
                          <div key={index} className="flex justify-between items-center">
                            <div>{condition.Metric}</div>
                            <div className="flex items-center">
                              <div className="text-sm mr-3">{condition["Archetype Value"]?.toFixed(1)}%</div>
                              <Badge variant={condition.Difference > 0 ? 'destructive' : 'outline'}>
                                {condition.Difference > 0 ? '+' : ''}{condition.Difference.toFixed(1)}%
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-8">
                        <p className="text-gray-500">No mental health data available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeepReportOverview;
