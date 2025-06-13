
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArchetypeDetailedData } from '@/types/archetype';
import MetricCard from '../metrics/MetricCard';
import MetricBar from '../metrics/MetricBar';
import { Badge } from '@/components/ui/badge';
import { formatNumber } from '@/utils/formatters';

interface MetricsTabProps {
  archetypeData: ArchetypeDetailedData;
}

const MetricsTab = ({ archetypeData }: MetricsTabProps) => {
  console.log('[MetricsTab] Received data:', {
    hasDetailedMetrics: !!archetypeData.detailed_metrics,
    hasDistinctiveMetrics: !!archetypeData.distinctive_metrics,
    hasCostMetric: !!(archetypeData as any).Cost_Medical_Paid_Amount_PEPY,
    hasLevel3Fields: !!(archetypeData as any)['Cost_Medical & RX Paid Amount PEPY'],
    keys: Object.keys(archetypeData).filter(k => k.startsWith('Cost_') || k.startsWith('Util_') || k.startsWith('Demo_') || k.startsWith('Risk_') || k.startsWith('SDOH_')).slice(0, 10)
  });

  // For level 3 insights report, we need to extract metrics directly from the raw data
  const getMetricValue = (fieldName: string): number | undefined => {
    const value = (archetypeData as any)[fieldName];
    return typeof value === 'number' ? value : undefined;
  };

  // Define the key metrics that should be available in level 3 data
  const level3Metrics = [
    {
      title: "Total Healthcare Cost",
      field: "Cost_Medical & RX Paid Amount PEPY",
      format: "currency" as const,
      category: "Cost"
    },
    {
      title: "Emergency Visits",
      field: "Util_Emergency Visits per 1k Members",
      format: "number" as const,
      category: "Utilization"
    },
    {
      title: "Specialist Visits",
      field: "Util_Specialist Visits per 1k Members", 
      format: "number" as const,
      category: "Utilization"
    },
    {
      title: "Inpatient Admits",
      field: "Util_Inpatient Admits per 1k Members",
      format: "number" as const,
      category: "Utilization"
    },
    {
      title: "Average Risk Score",
      field: "Risk_Average Risk Score",
      format: "number" as const,
      category: "Risk"
    },
    {
      title: "Average SDOH Score",
      field: "SDOH_Average SDOH",
      format: "number" as const,
      category: "Social Determinants"
    },
    {
      title: "Average Age",
      field: "Demo_Average Age",
      format: "number" as const,
      category: "Demographics"
    },
    {
      title: "Average Family Size",
      field: "Demo_Average Family Size",
      format: "number" as const,
      category: "Demographics"
    },
    {
      title: "Avoidable ER Savings",
      field: "Cost_Avoidable ER Potential Savings PMPY",
      format: "currency" as const,
      category: "Cost"
    }
  ];

  // Check which metrics have data
  const availableMetrics = level3Metrics.filter(metric => {
    const value = getMetricValue(metric.field);
    return value !== undefined && value !== null;
  });

  console.log('[MetricsTab] Available metrics:', {
    totalDefined: level3Metrics.length,
    available: availableMetrics.length,
    availableFields: availableMetrics.map(m => m.field)
  });

  // Group metrics by category
  const metricsByCategory = availableMetrics.reduce((acc, metric) => {
    if (!acc[metric.category]) {
      acc[metric.category] = [];
    }
    acc[metric.category].push(metric);
    return acc;
  }, {} as Record<string, typeof availableMetrics>);

  // If we have processed distinctive metrics, show those as well
  const hasDistinctiveMetrics = Array.isArray(archetypeData.distinctive_metrics) && archetypeData.distinctive_metrics.length > 0;

  return (
    <div className="space-y-8">
      {/* Show distinctive metrics if available (this would be from processed data) */}
      {hasDistinctiveMetrics && (
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Distinctive Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {archetypeData.distinctive_metrics!.slice(0, 6).map((metric, index) => (
                <MetricBar 
                  key={index}
                  title={metric.metric}
                  value={metric.value}
                  format={metric.metric.toLowerCase().includes('cost') ? 'currency' : 
                         (metric.metric.toLowerCase().includes('percent') ? 'percent' : 'number')}
                  benchmark={metric.average}
                  tooltipText={`${metric.significance || ''} ${Math.abs(metric.difference).toFixed(1)}% ${metric.difference > 0 ? 'higher' : 'lower'} than average`}
                  color={metric.difference > 0 ? '#3b82f6' : '#10b981'}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Show level 3 metrics organized by category */}
      {Object.keys(metricsByCategory).length > 0 ? (
        Object.entries(metricsByCategory).map(([category, metrics]) => (
          <Card key={category} className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">{category} Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {metrics.map(metric => {
                  const value = getMetricValue(metric.field);
                  if (value === undefined) return null;
                  
                  return (
                    <MetricCard
                      key={metric.field}
                      title={metric.title}
                      value={value}
                      format={metric.format}
                    />
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Badge variant="outline" className="mb-3 bg-yellow-50 text-yellow-800 hover:bg-yellow-100">Level 3 Metrics</Badge>
          <h3 className="text-xl font-medium text-gray-800 mb-2">No Metrics Data Available</h3>
          <p className="text-gray-600 max-w-md">
            We couldn't find metrics data for this archetype in the level 3 report. This could be because the data hasn't been generated yet or there's an issue with the data structure.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            <p>Looking for fields like:</p>
            <ul className="mt-2 space-y-1">
              <li>• Cost_Medical & RX Paid Amount PEPY</li>
              <li>• Util_Emergency Visits per 1k Members</li>
              <li>• Risk_Average Risk Score</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetricsTab;
