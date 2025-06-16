import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArchetypeDetailedData } from '@/types/archetype';
import MetricCard from '../metrics/MetricCard';
import MetricBar from '../metrics/metricsBar/MetricBar';
import { Badge } from '@/components/ui/badge';
import { formatNumber } from '@/utils/formatters';

interface MetricsTabProps {
  archetypeData: ArchetypeDetailedData;
}

const MetricsTab = ({ archetypeData }: MetricsTabProps) => {
  // COMPREHENSIVE DEBUGGING: Log all incoming data
  console.log('[MetricsTab] === DEBUGGING DISTINCTIVE METRICS ===');
  console.log('[MetricsTab] Raw archetypeData keys:', Object.keys(archetypeData || {}));
  console.log('[MetricsTab] distinctive_metrics raw:', archetypeData?.distinctive_metrics);
  console.log('[MetricsTab] distinctive_metrics type:', typeof archetypeData?.distinctive_metrics);
  console.log('[MetricsTab] distinctive_metrics length:', Array.isArray(archetypeData?.distinctive_metrics) ? archetypeData.distinctive_metrics.length : 'not array');
  
  // Check if distinctive_metrics is a JSON string that needs parsing
  let processedDistinctiveMetrics = null;
  if (archetypeData?.distinctive_metrics) {
    if (typeof archetypeData.distinctive_metrics === 'string') {
      try {
        processedDistinctiveMetrics = JSON.parse(archetypeData.distinctive_metrics);
        console.log('[MetricsTab] Parsed string distinctive_metrics:', processedDistinctiveMetrics);
      } catch (e) {
        console.error('[MetricsTab] Failed to parse distinctive_metrics string:', e);
      }
    } else if (Array.isArray(archetypeData.distinctive_metrics)) {
      processedDistinctiveMetrics = archetypeData.distinctive_metrics;
      console.log('[MetricsTab] Using array distinctive_metrics:', processedDistinctiveMetrics);
    } else if (typeof archetypeData.distinctive_metrics === 'object') {
      processedDistinctiveMetrics = archetypeData.distinctive_metrics;
      console.log('[MetricsTab] Using object distinctive_metrics:', processedDistinctiveMetrics);
    }
  }

  console.log('[MetricsTab] Final processedDistinctiveMetrics:', processedDistinctiveMetrics);
  
  // Enhanced debugging for each individual metric
  if (processedDistinctiveMetrics && Array.isArray(processedDistinctiveMetrics)) {
    console.log('[MetricsTab] Individual metrics analysis:');
    processedDistinctiveMetrics.forEach((metric, index) => {
      console.log(`[MetricsTab] Metric ${index}:`, {
        metric: metric.metric,
        value: metric.value,
        format: metric.format,
        average: metric.average,
        difference: metric.difference,
        significance: metric.significance,
        fullObject: metric
      });
    });
  }
  
  console.log('[MetricsTab] ============================================');

  // Function to get metric value from raw data
  const getMetricValue = (fieldName: string): number | undefined => {
    const value = (archetypeData as any)[fieldName];
    return typeof value === 'number' ? value : undefined;
  };

  // Mapping of metrics that are stored as decimals and need conversion to percentages
  // UPDATED: Using display names (without prefixes) to match distinctive metrics data
  const DECIMAL_PERCENTAGE_FIELDS = new Set([
    'Telehealth Adoption',
    'Mental Health Disorder Prevalence',
    'Heart Disease Prevalence',
    'Type 2 Diabetes Prevalence',
    'Hypertension Prevalence',
    'COPD Prevalence',
    'Cancer Prevalence',
    'Substance Use Disorder Prevalence',
    'Percent of Members who are Non-Utilizers'
    // NOTE: 'Access to Health Insurance' is NOT included because it's stored as percentage (90.94 = 90.94%)
  ]);

  // Function to determine the correct format and value for a metric
  const getMetricFormatAndValue = (metricName: string, value: number): { format: 'percent' | 'currency' | 'number', processedValue: number } => {
    console.log(`[MetricsTab] 🔍 DETAILED PROCESSING for "${metricName}":`, {
      originalValue: value,
      isInDecimalSet: DECIMAL_PERCENTAGE_FIELDS.has(metricName),
      isValueLessThanOne: value <= 1,
      containsPercent: metricName.toLowerCase().includes('percent'),
      containsPrevalence: metricName.toLowerCase().includes('prevalence'),
      containsAccess: metricName.toLowerCase().includes('access'),
      containsAdoption: metricName.toLowerCase().includes('adoption')
    });
    
    // Cost metrics
    if (metricName.toLowerCase().includes('cost') || metricName.toLowerCase().includes('amount') || metricName.toLowerCase().includes('paid')) {
      console.log(`[MetricsTab] ✅ Identified as currency metric: ${metricName}`);
      return { format: 'currency', processedValue: value };
    }
    
    // Percentage metrics
    if (metricName.toLowerCase().includes('percent') || 
        metricName.toLowerCase().includes('prevalence') || 
        metricName.toLowerCase().includes('access') || 
        metricName.toLowerCase().includes('adoption')) {
      
      // Check if this field is known to be stored as decimal and needs conversion
      if (DECIMAL_PERCENTAGE_FIELDS.has(metricName) && value <= 1) {
        console.log(`[MetricsTab] 🔄 Converting decimal to percentage for ${metricName}: ${value} -> ${value * 100}`);
        return { format: 'percent', processedValue: value * 100 };
      }
      
      // OTHERWISE: treat as already formatted percentage
      console.log(`[MetricsTab] ✅ Using as-is percentage for ${metricName}: ${value}`);
      return { format: 'percent', processedValue: value };
    }
    
    // Default to number format
    console.log(`[MetricsTab] ✅ Using number format for ${metricName}: ${value}`);
    return { format: 'number', processedValue: value };
  };

  // Create distinctive metrics from raw data as fallback
  const createDistinctiveMetricsFromRaw = () => {
    const rawMetrics = [
      {
        title: "Access to Health Insurance",
        field: "Bene_Access to Health Insurance",
        format: "percent" as const
      },
      {
        title: "Telehealth Adoption", 
        field: "Util_Telehealth Adoption",
        format: "percent" as const
      },
      {
        title: "Specialist Visits per 1k Members",
        field: "Util_Specialist Visits per 1k Members", 
        format: "number" as const
      },
      {
        title: "Mental Health Disorder Prevalence",
        field: "Dise_Mental Health Disorder Prevalence",
        format: "percent" as const
      },
      {
        title: "Medical & RX Paid Amount PEPY",
        field: "Cost_Medical & RX Paid Amount PEPY",
        format: "currency" as const
      }
    ];

    return rawMetrics.filter(metric => {
      const value = getMetricValue(metric.field);
      return value !== undefined && value !== null;
    }).map(metric => {
      const value = getMetricValue(metric.field)!;
      const { format, processedValue } = getMetricFormatAndValue(metric.title, value);
      
      return {
        metric: metric.title,
        value: processedValue,
        format: format,
        average: undefined,
        difference: 0,
        significance: ''
      };
    });
  };

  // Determine which distinctive metrics to use
  let distinctiveMetrics = null;
  
  if (processedDistinctiveMetrics && Array.isArray(processedDistinctiveMetrics) && processedDistinctiveMetrics.length > 0) {
    // Process the metrics with proper formatting
    distinctiveMetrics = processedDistinctiveMetrics.map(metric => {
      // Handle different possible property names and structures
      const metricName = metric.metric || metric.Metric || metric.title || 'Unknown Metric';
      let metricValue = metric.value !== undefined ? metric.value : 
                       metric.archetype_value !== undefined ? metric.archetype_value :
                       metric['Archetype Value'] !== undefined ? metric['Archetype Value'] : 0;
      
      let averageValue = metric.average !== undefined ? metric.average :
                        metric.archetype_average !== undefined ? metric.archetype_average :
                        metric['Archetype Average'] !== undefined ? metric['Archetype Average'] : undefined;
      
      const differenceValue = metric.difference !== undefined ? metric.difference :
                             metric.Difference !== undefined ? metric.Difference : 0;
      
      console.log(`[MetricsTab] 🎯 RAW METRIC BEFORE PROCESSING:`, {
        metricName,
        originalValue: metricValue,
        originalAverage: averageValue,
        originalDifference: differenceValue
      });
      
      // Use the new formatting logic
      const { format, processedValue } = getMetricFormatAndValue(metricName, metricValue);
      let processedAverage = averageValue;
      
      // Apply same processing to average if it exists
      if (averageValue !== undefined && format === 'percent' && DECIMAL_PERCENTAGE_FIELDS.has(metricName) && averageValue <= 1) {
        processedAverage = averageValue * 100;
        console.log(`[MetricsTab] 🔄 Also converting average: ${averageValue} -> ${processedAverage}`);
      }
      
      console.log(`[MetricsTab] ✅ FINAL PROCESSED METRIC:`, {
        metricName,
        originalValue: metricValue,
        processedValue: processedValue,
        originalAverage: averageValue,
        processedAverage: processedAverage,
        format: format,
        wasValueConverted: metricValue !== processedValue,
        wasAverageConverted: averageValue !== processedAverage
      });
      
      return {
        metric: metricName,
        value: processedValue,
        format: format,
        average: processedAverage,
        difference: differenceValue,
        significance: metric.significance || metric.Significance || ''
      };
    });
    
    console.log('[MetricsTab] Using processed distinctive metrics:', distinctiveMetrics.length, 'items');
    console.log('[MetricsTab] Final processed metrics:', distinctiveMetrics);
  } else {
    distinctiveMetrics = createDistinctiveMetricsFromRaw();
    console.log('[MetricsTab] Using fallback distinctive metrics:', distinctiveMetrics.length, 'items');
  }

  // Define the key metrics available in level3 data
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
    availableFields: availableMetrics.map(m => m.field),
    distinctiveMetricsCount: distinctiveMetrics?.length || 0
  });

  // Group metrics by category
  const metricsByCategory = availableMetrics.reduce((acc, metric) => {
    if (!acc[metric.category]) {
      acc[metric.category] = [];
    }
    acc[metric.category].push(metric);
    return acc;
  }, {} as Record<string, typeof availableMetrics>);

  return (
    <div className="space-y-8">
      {/* Show distinctive metrics */}
      {distinctiveMetrics && distinctiveMetrics.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Distinctive Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {distinctiveMetrics.slice(0, 6).map((metric, index) => (
                <MetricBar 
                  key={index}
                  title={metric.metric}
                  value={metric.value}
                  format={metric.format}
                  benchmark={metric.average}
                  tooltipText={metric.average ? 
                    `${metric.significance || ''} ${Math.abs(metric.difference || 0).toFixed(1)}% ${(metric.difference || 0) > 0 ? 'higher' : 'lower'} than average` :
                    'Individual archetype value'
                  }
                  color={(metric.difference || 0) > 0 ? '#3b82f6' : '#10b981'}
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
