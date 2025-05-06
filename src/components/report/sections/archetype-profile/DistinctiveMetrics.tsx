
import React from 'react';
import { Card } from '@/components/ui/card';
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown, Info } from 'lucide-react';
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

  // Helper to format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0 
    }).format(value);
  };

  // Helper to format percentage values
  const formatPercent = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value);
  };

  // Helper to determine if a metric should be displayed as a percentage
  const isPercentMetric = (metricName: string) => {
    return metricName.toLowerCase().includes('percent') || 
           metricName.toLowerCase().includes('prevalence') || 
           metricName.toLowerCase().includes('rate');
  };

  // Helper to determine if a metric should be displayed as currency
  const isCurrencyMetric = (metricName: string) => {
    return metricName.toLowerCase().includes('cost') || 
           metricName.toLowerCase().includes('amount') || 
           metricName.toLowerCase().includes('salary') || 
           metricName.toLowerCase().includes('spend');
  };

  // Helper to format the metric value based on its type
  const formatMetricValue = (metricName: string, value: number) => {
    if (isCurrencyMetric(metricName)) {
      return formatCurrency(value);
    } else if (isPercentMetric(metricName)) {
      return formatPercent(value);
    } else {
      return value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
  };

  // Helper to get category badge color
  const getCategoryColor = (category: string) => {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('demographic')) return 'bg-blue-100 text-blue-800';
    if (categoryLower.includes('disease') || categoryLower.includes('prevalence')) return 'bg-amber-100 text-amber-800';
    if (categoryLower.includes('cost')) return 'bg-green-100 text-green-800';
    if (categoryLower.includes('benefit')) return 'bg-purple-100 text-purple-800';
    if (categoryLower.includes('utilization')) return 'bg-indigo-100 text-indigo-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="p-6">
      <h4 className="text-xl font-semibold mb-4">Key Distinctive Metrics</h4>
      
      <div className="grid grid-cols-1 gap-4">
        {topMetrics.map((metric, index) => {
          // Extract values, with fallbacks for different property naming conventions
          const metricName = metric.Metric || metric.metric || '';
          const metricValue = metric["Archetype Value"] || metric.archetype_value || 0;
          const averageValue = metric["Archetype Average"] || metric.archetype_average || 0;
          const difference = metric.Difference || metric.difference || 0;
          const category = metric.Category || metric.category || '';
          const significance = metric.Significance || metric.significance || '';
          
          // Determine if lower is better for this metric
          const lowerIsBetter = isLowerBetter(metricName);
          
          // Determine if this is positive or negative
          const isPositive = (difference > 0 && !lowerIsBetter) || (difference < 0 && lowerIsBetter);
          
          // Format the difference as a percentage with sign
          const formattedDifference = `${difference > 0 ? '+' : ''}${Math.abs(difference).toFixed(1)}%`;
          
          // Determine color for the comparison text
          const differenceColor = isPositive ? "text-green-600" : "text-amber-600";

          return (
            <div key={index} className="bg-white rounded-lg border shadow-sm overflow-hidden transition-all hover:shadow-md">
              <div className="p-4 border-b">
                <div className="flex justify-between items-start">
                  <h5 className="font-semibold text-gray-900">{metricName}</h5>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(category)}`}>
                    {category}
                  </span>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Your Value</p>
                    <p className="text-2xl font-bold">{formatMetricValue(metricName, metricValue)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Average</p>
                    <p className="text-xl">{formatMetricValue(metricName, averageValue)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-4">
                  {isPositive ? (
                    <div className="p-1.5 rounded-full bg-green-100">
                      <ArrowUp className="text-green-600" size={16} />
                    </div>
                  ) : (
                    <div className="p-1.5 rounded-full bg-amber-100">
                      <ArrowDown className="text-amber-600" size={16} />
                    </div>
                  )}
                  <span className={`text-sm font-medium ${differenceColor}`}>
                    {formattedDifference} difference from average
                  </span>
                </div>
                
                {significance && (
                  <div className="mt-3 flex items-start gap-2 text-gray-600 bg-blue-50 p-2 rounded">
                    <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{significance}</p>
                  </div>
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
