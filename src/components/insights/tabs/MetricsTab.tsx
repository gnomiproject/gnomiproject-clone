
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArchetypeDetailedData } from '@/types/archetype';
import MetricCard from '../metrics/MetricCard';
import MetricBar from '../metrics/MetricBar';
import { Badge } from '@/components/ui/badge';

interface MetricsTabProps {
  archetypeData: ArchetypeDetailedData;
}

const MetricsTab = ({ archetypeData }: MetricsTabProps) => {
  console.log('[MetricsTab] Received data:', {
    hasDetailedMetrics: !!archetypeData.detailed_metrics,
    hasDistinctiveMetrics: !!archetypeData.distinctive_metrics,
    hasCostMetric: !!(archetypeData as any).Cost_Medical_Paid_Amount_PEPY,
    keys: Object.keys(archetypeData).filter(k => k.startsWith('Cost_') || k.startsWith('Util_')).slice(0, 5)
  });

  // Case-sensitive access to metrics from the database - try multiple property paths
  const getMetricValue = (prefix: string, field: string): number | undefined => {
    // First check for properties directly on the archetypeData object (from database)
    const directKey = `${prefix}_${field}`;
    if ((archetypeData as any)[directKey] !== undefined) {
      return (archetypeData as any)[directKey];
    }
    
    // Then check for properties in the detailed_metrics object (from JSON)
    if (archetypeData.detailed_metrics && 
        archetypeData.detailed_metrics[prefix.toLowerCase()] && 
        archetypeData.detailed_metrics[prefix.toLowerCase()][field]) {
      return archetypeData.detailed_metrics[prefix.toLowerCase()][field].value;
    }
    
    return undefined;
  };

  // Create a basic data structure for each metric category
  const metricCategories = [
    { 
      title: "Cost Metrics", 
      prefix: "Cost",
      fields: ["Medical_Paid_Amount_PEPY", "Medical_&_RX_Paid_Amount_PEPY", "RX_Paid_Amount_PEPY"]
    },
    { 
      title: "Utilization Metrics", 
      prefix: "Util",
      fields: ["Emergency_Visits_per_1k_Members", "Inpatient_Admits_per_1k_Members", "Specialist_Visits_per_1k_Members"]
    },
    { 
      title: "Risk Score", 
      prefix: "Risk",
      fields: ["Average_Risk_Score"]
    }
  ];

  return (
    <div className="space-y-8">
      {(archetypeData.distinctive_metrics || archetypeData.detailed_metrics) ? (
        <>
          {/* Display distinctive metrics if available */}
          {archetypeData.distinctive_metrics && (
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Distinctive Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {Array.isArray(archetypeData.distinctive_metrics) ? 
                    archetypeData.distinctive_metrics.slice(0, 6).map((metric, index) => (
                      <MetricBar 
                        key={index}
                        metric={metric.metric}
                        value={metric.archetype_value}
                        average={metric.archetype_average}
                        difference={metric.difference}
                        significance={metric.significance || ''}
                      />
                    )) : (
                      <p className="text-gray-500">Distinctive metrics data is not in the expected format.</p>
                    )
                  }
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Display regular metrics by category */}
          {metricCategories.map(category => {
            // Check if we have any metrics in this category
            const hasMetrics = category.fields.some(field => 
              getMetricValue(category.prefix, field) !== undefined
            );
            
            if (!hasMetrics) return null;
            
            return (
              <Card key={category.title} className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.fields.map(field => {
                      const value = getMetricValue(category.prefix, field);
                      if (value === undefined) return null;
                      
                      return (
                        <MetricCard
                          key={field}
                          title={field.replace(/_/g, ' ')}
                          value={value}
                          format={field.includes('Amount') ? 'currency' : 
                                 field.includes('Percent') ? 'percent' : 'decimal'}
                        />
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Badge variant="outline" className="mb-3">Level 3 Metrics</Badge>
          <h3 className="text-xl font-medium text-gray-800 mb-2">No Metrics Data Available</h3>
          <p className="text-gray-500 max-w-md">
            We couldn't find metrics data for this archetype. This could be because the data hasn't been generated yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default MetricsTab;
