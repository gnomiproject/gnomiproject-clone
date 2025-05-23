
import React from 'react';
import { Card } from '@/components/ui/card';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { useDistinctiveMetrics } from '@/hooks/archetype/useDistinctiveMetrics';
import { formatNumber } from '@/utils/formatters';
import { calculatePercentageDifferenceSync, isLowerBetter } from '@/utils/reports/metricUtils';
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
      <Card className="p-4">
        <h4 className="text-lg font-medium mb-2">Distinctive Metrics</h4>
        <div className="py-2">
          <p className="text-gray-600">Loading metrics...</p>
        </div>
      </Card>
    );
  }

  if (!topMetrics || topMetrics.length === 0) {
    return (
      <Card className="p-4">
        <h4 className="text-lg font-medium mb-2">Distinctive Metrics</h4>
        <p className="text-gray-600">No distinctive metrics available.</p>
      </Card>
    );
  }

  // Helper to determine if a metric should be displayed as a percentage
  const isPercentMetric = (metricName: string) => {
    const name = metricName.toLowerCase();
    return name.includes('percent') || 
           name.includes('prevalence') || 
           name.includes('rate') ||
           name.includes('access') ||
           name.includes('sdoh');
  };

  // Helper to determine if a metric should be displayed as currency
  const isCurrencyMetric = (metricName: string) => {
    const name = metricName.toLowerCase();
    return name.includes('cost') || 
           name.includes('amount') || 
           name.includes('salary') || 
           name.includes('spend') ||
           name.includes('paid') ||
           name.includes('savings');
  };

  return (
    <Card className="p-6">
      <h4 className="text-xl font-semibold mb-4">Key Distinctive Metrics</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topMetrics.map((metric, index) => {
          // Extract values, with fallbacks for different property naming conventions
          const metricName = metric.Metric || metric.metric || '';
          const metricValue = metric["Archetype Value"] || metric.archetype_value || 0;
          const averageValue = metric["Archetype Average"] || metric.archetype_average || 0;
          
          // Recalculate the percentage difference correctly
          const percentDiff = calculatePercentageDifferenceSync(metricValue, averageValue);
          
          // Log the calculation to help diagnose issues
          console.log(`[DistinctiveMetrics] Calculating difference for ${metricName}:`, {
            value: metricValue,
            average: averageValue,
            calculation: `((${metricValue} - ${averageValue}) / ${averageValue}) * 100 = ${percentDiff.toFixed(1)}%`
          });
          
          // Determine if lower is better for this metric
          const lowerIsBetter = isLowerBetter(metricName);
          
          // Determine if this is positive or negative
          const isPositive = (percentDiff > 0 && !lowerIsBetter) || (percentDiff < 0 && lowerIsBetter);
          
          // Format values based on their type
          const formattedValue = isCurrencyMetric(metricName) 
            ? formatNumber(metricValue, 'currency') 
            : isPercentMetric(metricName) 
              ? formatNumber(metricValue, 'number', 2)
              : formatNumber(metricValue, 'number', 1);
          
          const formattedAverage = isCurrencyMetric(metricName) 
            ? formatNumber(averageValue, 'currency') 
            : isPercentMetric(metricName) 
              ? formatNumber(averageValue, 'number', 2)
              : formatNumber(averageValue, 'number', 1);

          // Format the difference as a percentage with sign
          const formattedDifference = `${Math.abs(percentDiff).toFixed(1)}%`;
          
          return (
            <div key={index} className="bg-white rounded-lg border shadow-sm overflow-hidden hover:shadow transition-shadow duration-200">
              <div className="p-4 border-b">
                {/* Fixed height title container to ensure consistent card heights */}
                <h5 className="font-semibold text-gray-900 text-sm h-10 flex items-center">
                  {metricName}
                </h5>
              </div>
              
              <div className="p-4 bg-gray-50">
                {/* Fixed layout grid for metric values */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Your Value</p>
                    <p className="text-xl font-bold flex items-center">
                      {formattedValue}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Archetype Average</p>
                    <p className="text-lg text-gray-700">{formattedAverage}</p>
                  </div>
                </div>
                
                <div className={`flex items-center justify-center gap-1 py-1.5 px-3 rounded-full ${
                  isPositive ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {isPositive ? (
                    <ArrowUp className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowDown className="h-3.5 w-3.5" />
                  )}
                  <span className="text-xs font-medium">
                    {formattedDifference} from archetype average
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default DistinctiveMetrics;
