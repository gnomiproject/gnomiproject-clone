
import React from 'react';
import { Building, FileText, TrendingUp, AlertTriangle, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from '@/utils/formatters';

interface ArchetypeProfileProps {
  reportData: any;
  averageData: any;
}

const ArchetypeProfile = ({ reportData, averageData }: ArchetypeProfileProps) => {
  // Parse key characteristics
  const keyCharacteristics = parseListData(reportData.key_characteristics);
  const industries = reportData.industries?.split(',').map((i: string) => i.trim()) || [];
  const topMetrics = reportData.top_distinctive_metrics ? 
    JSON.parse(reportData.top_distinctive_metrics) : 
    generateTopMetrics(reportData, averageData);
  
  // Gnome image
  const gnomeImage = '/assets/gnomes/gnome_magnifying.png';
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-4">Archetype Profile</h1>
          
          <div className="flex items-center gap-2 mb-6">
            <Badge 
              variant="outline" 
              className="border-blue-200 bg-blue-50 text-blue-800"
            >
              {reportData.family_name || 'Family'} Family
            </Badge>
            <h2 className="text-xl font-semibold">{reportData.archetype_name}</h2>
          </div>
          
          <div className="prose max-w-none mb-8">
            <p className="text-lg">{reportData.long_description}</p>
          </div>
        </div>
        <div className="md:w-1/3 flex justify-center">
          <img
            src={gnomeImage}
            alt="Analysis Gnome"
            className="max-h-64 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/gnomes/placeholder.svg';
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Characteristics */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-xl">
              <FileText className="mr-2 h-5 w-5 text-blue-600" />
              Key Characteristics
            </CardTitle>
          </CardHeader>
          <CardContent>
            {keyCharacteristics.length > 0 ? (
              <ul className="space-y-2">
                {keyCharacteristics.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No key characteristics available</p>
            )}
          </CardContent>
        </Card>

        {/* Common Industries */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-xl">
              <Building className="mr-2 h-5 w-5 text-blue-600" />
              Common Industries
            </CardTitle>
          </CardHeader>
          <CardContent>
            {industries.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {industries.map((industry, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {industry}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No industry data available</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Distinctive Metrics */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
            Most Distinctive Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {topMetrics.length > 0 ? topMetrics.map((metric, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{metric.name}</h4>
                  <Badge 
                    variant={metric.significance === "Unfavorable" ? "destructive" : "outline"} 
                    className={metric.significance === "Favorable" ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                  >
                    {metric.significance}
                  </Badge>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Your value:</span>
                    <span className="font-medium">{formatNumber(metric.value, metric.format)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Average:</span>
                    <span>{formatNumber(metric.average, metric.format)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Difference:</span>
                    <span className={metric.difference > 0 ? "text-red-600" : "text-green-600"}>
                      {metric.difference > 0 ? "+" : ""}{formatNumber(metric.difference, metric.format)}
                      {" "}({formatNumber(Math.abs(metric.percentDifference), 'percent')})
                    </span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-2 text-center py-6">
                <AlertTriangle className="mx-auto h-10 w-10 text-amber-500 mb-2" />
                <p className="text-lg font-medium text-gray-800">No distinctive metrics available</p>
                <p className="text-gray-600">Metric comparisons could not be generated for this archetype</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to parse list data from string or array
const parseListData = (data: any): string[] => {
  if (!data) return [];
  
  if (typeof data === 'string') {
    return data.split('\n').filter(Boolean).map(item => item.trim());
  }
  
  if (Array.isArray(data)) {
    return data.map(item => String(item).trim());
  }
  
  return [];
};

// Helper function to generate top metrics
const generateTopMetrics = (reportData: any, averageData: any): any[] => {
  if (!reportData || !averageData) return [];
  
  const metrics = [];
  const potentialMetrics = [
    { key: "Cost_Medical & RX Paid Amount PEPY", name: "Total Healthcare Cost", format: 'currency' },
    { key: "Risk_Average Risk Score", name: "Risk Score", format: 'number' },
    { key: "Util_Emergency Visits per 1k Members", name: "ER Utilization", format: 'number' },
    { key: "Util_Specialist Visits per 1k Members", name: "Specialist Utilization", format: 'number' },
    { key: "Dise_Heart Disease Prevalence", name: "Heart Disease Prevalence", format: 'percent' },
    { key: "Dise_Type 2 Diabetes Prevalence", name: "Type 2 Diabetes Prevalence", format: 'percent' },
    { key: "Gaps_Wellness Visit Adults", name: "Adult Wellness Visits", format: 'percent' }
  ];
  
  for (const metricDef of potentialMetrics) {
    if (reportData[metricDef.key] !== undefined && averageData[metricDef.key] !== undefined) {
      const value = reportData[metricDef.key];
      const avgValue = averageData[metricDef.key];
      
      if (value && avgValue) {
        const difference = value - avgValue;
        const percentDifference = avgValue !== 0 ? (difference / avgValue) * 100 : 0;
        
        let significance;
        // Logic for determining if the difference is favorable or not
        // For cost and utilization metrics, lower is better
        // For preventive care metrics, higher is better
        if (metricDef.key.startsWith("Cost_") || metricDef.key.startsWith("Util_") || 
            metricDef.key.startsWith("Dise_") || metricDef.key.startsWith("Risk_")) {
          significance = difference < 0 ? "Favorable" : "Unfavorable";
        } else {
          significance = difference > 0 ? "Favorable" : "Unfavorable";
        }
        
        metrics.push({
          name: metricDef.name,
          key: metricDef.key,
          value: value,
          average: avgValue,
          difference: difference,
          percentDifference: percentDifference,
          significance: significance,
          format: metricDef.format
        });
      }
    }
  }
  
  // Sort by absolute percentage difference
  return metrics
    .sort((a, b) => Math.abs(b.percentDifference) - Math.abs(a.percentDifference))
    .slice(0, 4);
};

export default ArchetypeProfile;
