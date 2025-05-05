
import React from 'react';
import { Card } from '@/components/ui/card';
import { ChartBar, TrendingUp, TrendingDown } from 'lucide-react';
import { useDistinctiveMetrics } from '@/hooks/archetype/useDistinctiveMetrics';
import { formatFieldValue } from '@/utils/reports/fieldFormatters';
import { calculatePercentageDifference, isLowerBetter } from '@/utils/reports/metricUtils';
import { ArchetypeId } from '@/types/archetype';

interface DistinctiveMetricsProps {
  metrics: Array<any>;
  archetypeId: string;
}

const DistinctiveMetrics: React.FC<DistinctiveMetricsProps> = ({ metrics, archetypeId }) => {
  // Use the hook to get metrics if we don't have them passed as props
  // Convert string to ArchetypeId type using type assertion if it's a valid archetype ID
  const safeArchetypeId = archetypeId as ArchetypeId;
  
  const { distinctiveMetrics: hookMetrics, isLoading } = useDistinctiveMetrics(
    // Only pass the ID if it appears to be a valid archetype ID format
    archetypeId.match(/^[a-c][1-3]$/) ? safeArchetypeId : undefined
  );
  
  // Use props metrics if available, otherwise use metrics from the hook
  const displayMetrics = metrics && metrics.length > 0 ? metrics : hookMetrics;
  
  // Limit to top 5 metrics
  const topMetrics = displayMetrics?.slice(0, 5) || [];

  if (isLoading) {
    return (
      <Card className="p-6">
        <h4 className="text-lg font-medium mb-2">Distinctive Metrics</h4>
        <div className="py-3">
          <p className="text-gray-600">Loading metrics...</p>
        </div>
      </Card>
    );
  }

  if (!topMetrics || topMetrics.length === 0) {
    return (
      <Card className="p-6">
        <h4 className="text-lg font-medium mb-2">Distinctive Metrics</h4>
        <p className="text-gray-600">No distinctive metrics available.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h4 className="text-lg font-medium mb-4">Distinctive Metrics</h4>
      
      <div className="space-y-4">
        {topMetrics.map((metric, index) => {
          // Extract values, with fallbacks for different property naming conventions
          const metricName = metric.Metric || metric.metric || '';
          const metricValue = metric["Archetype Value"] || metric.archetype_value || 0;
          const averageValue = metric["Archetype Average"] || metric.archetype_average || 0;
          const difference = metric.Difference || metric.difference || 0;
          const significance = metric.Significance || metric.significance || '';
          
          // Determine if the difference is positive for this metric
          const isPositiveDifference = difference > 0;
          
          // Determine if lower is better for this metric
          const lowerIsBetter = isLowerBetter(metricName);
          
          // Calculate percentage difference
          const percentDiff = calculatePercentageDifference(metricValue, averageValue);
          
          // Determine if this is positive or negative
          const isPositive = (percentDiff > 0 && !lowerIsBetter) || (percentDiff < 0 && lowerIsBetter);
          
          // Determine display text
          const comparisonWord = percentDiff > 0 ? "higher than" : "lower than";
          const comparisonText = `${Math.abs(percentDiff).toFixed(1)}% ${comparisonWord} average`;
          
          // Determine color for the comparison text
          const textColor = isPositive ? "text-green-600" : "text-amber-600";

          // Format values based on metric type
          const formattedValue = formatFieldValue(metricName, metricValue);
          const formattedAverage = formatFieldValue(metricName, averageValue);

          return (
            <div key={index} className="border rounded-lg overflow-hidden">
              <div className="p-4 bg-gray-50 border-b">
                <h5 className="font-medium">{metricName}</h5>
              </div>
              
              <div className="p-4">
                <div className="flex flex-col md:flex-row justify-between mb-3">
                  <div className="mb-2 md:mb-0">
                    <span className="text-sm text-gray-500">Your value</span>
                    <div className="text-lg font-semibold">{formattedValue}</div>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-500">Archetype average</span>
                    <div className="text-lg font-semibold">{formattedAverage}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-2">
                  {isPositiveDifference ? (
                    <TrendingUp className={textColor} size={18} />
                  ) : (
                    <TrendingDown className={textColor} size={18} />
                  )}
                  <span className={`text-sm ${textColor}`}>{comparisonText}</span>
                </div>
                
                {significance && (
                  <p className="mt-3 text-sm text-gray-600">{significance}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default DistinctiveMetrics;
