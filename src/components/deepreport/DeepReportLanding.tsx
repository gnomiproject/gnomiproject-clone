
import React from 'react';
import { ArrowRight, ChevronDown, BarChart4, LineChart, PieChart, List, Building, Globe, Users, Briefcase, AlertCircle } from 'lucide-react';
import { DeepReportData } from '@/pages/ArchetypeDeepReport';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface DeepReportLandingProps {
  reportData: DeepReportData;
}

const DeepReportLanding = ({ reportData }: DeepReportLandingProps) => {
  const { archetypeData, familyData, deepDiveReport, distinctiveMetrics } = reportData;
  
  if (!archetypeData) {
    return <div className="text-center py-12">No archetype data available</div>;
  }

  // Top distinctive metrics for visualization
  const topMetrics = distinctiveMetrics && distinctiveMetrics.length > 0
    ? distinctiveMetrics.slice(0, 5)
    : [];
  
  // Risk score visualization
  const riskScore = archetypeData?.enhanced?.riskProfile?.score || '0';
  const riskScoreValue = parseInt(riskScore.replace(/\D/g, '')) || 50; // Extract numeric value, default to 50
  
  return (
    <div className="space-y-8">
      {/* 1. Archetype Overview Section */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className={`bg-archetype-${archetypeData.id} h-4 w-full`} />
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-baseline mb-2">
                  <h1 className="text-2xl font-bold">
                    {archetypeData.id.toUpperCase()}: {archetypeData.name}
                  </h1>
                </div>
                
                <div className="text-gray-500 mb-4">
                  Family: <span className="font-medium">{familyData?.name || 'N/A'}</span>
                </div>
                
                {deepDiveReport?.introduction && (
                  <div className="prose max-w-none">
                    <p>{deepDiveReport.introduction}</p>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {(deepDiveReport?.data_details?.Industries || []).slice(0, 5).map((industry: string, index: number) => (
                    <Badge key={index} variant="outline" className="bg-gray-100">
                      <Building className="h-3 w-3 mr-1" />
                      {industry}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-center items-center">
                <div className={`h-32 w-32 rounded-full bg-archetype-${archetypeData.id}/10 flex items-center justify-center border-4 border-archetype-${archetypeData.id}`}>
                  <span className="text-4xl font-bold text-archetype-${archetypeData.id}">{archetypeData.id}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Executive Summary Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart4 className="h-5 w-5 mr-2" />
            Executive Summary
          </CardTitle>
          <CardDescription>Key metrics and distinctive characteristics</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Visual Score Card with Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Risk Score */}
            <Card className="bg-gray-50">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Risk Score</span>
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                </div>
                <div className="text-2xl font-bold mb-2">{riskScore}</div>
                <Progress value={riskScoreValue} className="h-2" />
                <div className="text-xs text-gray-500 mt-1">
                  {archetypeData?.enhanced?.riskProfile?.comparison || 'Comparison data unavailable'}
                </div>
              </CardContent>
            </Card>

            {/* Cost Position */}
            <Card className="bg-gray-50">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Cost Position</span>
                  <PieChart className="h-4 w-4 text-blue-500" />
                </div>
                <div className="text-2xl font-bold mb-2">
                  ${deepDiveReport?.data_details?.Cost?.[0]?.["Archetype Value"]?.toFixed(0) || 'N/A'}
                </div>
                <Progress value={65} className="h-2" />
                <div className="text-xs text-gray-500 mt-1">
                  {deepDiveReport?.data_details?.Cost?.[0]?.Difference > 0 ? 
                    `${deepDiveReport?.data_details?.Cost[0]?.Difference.toFixed(1)}% above average` : 
                    `${Math.abs(deepDiveReport?.data_details?.Cost?.[0]?.Difference || 0).toFixed(1)}% below average`}
                </div>
              </CardContent>
            </Card>

            {/* Utilization Patterns */}
            <Card className="bg-gray-50">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Utilization</span>
                  <LineChart className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-2xl font-bold mb-2">
                  {deepDiveReport?.data_details?.Utilization?.[0]?.["Archetype Value"]?.toFixed(1) || 'N/A'}
                </div>
                <Progress value={50} className="h-2" />
                <div className="text-xs text-gray-500 mt-1">
                  {deepDiveReport?.data_details?.Utilization?.[0]?.["Metric"] || 'Utilization data'} per 1K
                </div>
              </CardContent>
            </Card>

            {/* SDOH Profile */}
            <Card className="bg-gray-50">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">SDOH Profile</span>
                  <Globe className="h-4 w-4 text-purple-500" />
                </div>
                <div className="text-2xl font-bold mb-2">
                  {deepDiveReport?.data_details?.SDOH?.[0]?.["Archetype Value"]?.toFixed(1) || 'N/A'}
                </div>
                <Progress value={75} className="h-2" />
                <div className="text-xs text-gray-500 mt-1">
                  Composite SDOH score
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Distinctive Metrics */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Distinctive Metrics</h3>
            {topMetrics.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-md">
                    <div className="mr-4">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${metric.Difference > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {metric.Difference > 0 ? '+' : ''}{Math.round(metric.Difference)}%
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">{metric.Metric}</div>
                      <div className="text-sm text-gray-500">
                        {metric["Archetype Value"]?.toFixed(1)} vs {metric["Archetype Average"]?.toFixed(1)} avg
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No distinctive metrics available</p>
              </div>
            )}
          </div>

          {/* At a Glance Facts */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Facts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex gap-3 p-3 bg-gray-50 rounded-md">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-sm text-gray-500">Average Family Size</div>
                  <div className="font-medium">
                    {deepDiveReport?.data_details?.Demographics?.find((d: any) => 
                      d.Metric === "Average Family Size")?.["Archetype Value"]?.toFixed(1) || 'N/A'}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 p-3 bg-gray-50 rounded-md">
                <Briefcase className="h-5 w-5 text-purple-500" />
                <div>
                  <div className="text-sm text-gray-500">Primary Industries</div>
                  <div className="font-medium">
                    {(deepDiveReport?.data_details?.Industries || []).slice(0, 2).join(', ') || 'N/A'}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 p-3 bg-gray-50 rounded-md">
                <PieChart className="h-5 w-5 text-green-500" />
                <div>
                  <div className="text-sm text-gray-500">Paid/Allowed Ratio</div>
                  <div className="font-medium">
                    {deepDiveReport?.data_details?.Cost?.find((c: any) => 
                      c.Metric === "Paid/Allowed Ratio")?.["Archetype Value"]?.toFixed(2) || 'N/A'}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 p-3 bg-gray-50 rounded-md">
                <LineChart className="h-5 w-5 text-amber-500" />
                <div>
                  <div className="text-sm text-gray-500">Risk-Cost Ratio</div>
                  <div className="font-medium">
                    {deepDiveReport?.data_details?.Cost?.find((c: any) => 
                      c.Metric === "Risk-Cost Ratio")?.["Archetype Value"]?.toFixed(2) || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Report Navigation Button */}
          <div className="mt-8 flex justify-center">
            <Button variant="outline" className="group" onClick={() => document.getElementById('overview-section')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore Full Report
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeepReportLanding;
