
import React from 'react';
import { Card } from '@/components/ui/card';
import { ArrowUp, ArrowDown, BadgeDollarSign, BadgePercent } from 'lucide-react';
import { useDistinctiveMetrics } from '@/hooks/archetype/useDistinctiveMetrics';
import { formatFieldValue } from '@/utils/reports/fieldFormatters';
import { formatNumber } from '@/utils/formatters';
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

  // Helper to get category badge color
  const getCategoryColor = (category: string) => {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('demographic')) return 'bg-blue-100 text-blue-800';
    if (categoryLower.includes('disease') || categoryLower.includes('prevalence')) return 'bg-amber-100 text-amber-800';
    if (categoryLower.includes('cost')) return 'bg-green-100 text-green-800';
    if (categoryLower.includes('benefit')) return 'bg-purple-100 text-purple-800';
    if (categoryLower.includes('utilization')) return 'bg-indigo-100 text-indigo-800';
    if (categoryLower.includes('sdoh')) return 'bg-teal-100 text-teal-800';
    return 'bg-gray-100 text-gray-800';
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
          const difference = metric.Difference || metric.difference || 0;
          const category = metric.Category || metric.category || '';
          
          // Determine if lower is better for this metric
          const lowerIsBetter = isLowerBetter(metricName);
          
          // Determine if this is positive or negative
          const isPositive = (difference > 0 && !lowerIsBetter) || (difference < 0 && lowerIsBetter);
          
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
          const formattedDifference = `${difference > 0 ? '+' : ''}${Math.abs(difference).toFixed(1)}%`;
          
          return (
            <div key={index} className="bg-white rounded-lg border shadow-sm overflow-hidden hover:shadow transition-shadow duration-200">
              <div className="p-4 border-b flex justify-between items-center">
                <h5 className="font-semibold text-gray-900 text-sm line-clamp-2">{metricName}</h5>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(category)}`}>
                  {category}
                </span>
              </div>
              
              <div className="p-4 bg-gray-50">
                <div className="flex justify-between items-baseline mb-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Your Value</p>
                    <p className="text-xl font-bold flex items-center">
                      {isCurrencyMetric(metricName) && <BadgeDollarSign className="h-4 w-4 mr-1 opacity-70" />}
                      {isPercentMetric(metricName) && <BadgePercent className="h-4 w-4 mr-1 opacity-70" />}
                      {formattedValue}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Average</p>
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
                    {formattedDifference} from average
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
