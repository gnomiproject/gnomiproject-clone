
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, BarChart } from 'lucide-react';
import { formatNumber } from '@/utils/formatters';
import { calculatePercentageDifferenceSync, isLowerBetter } from '@/utils/reports/metricUtils';

interface EnhancedDistinctiveMetricsProps {
  distinctiveMetrics?: any[];
  topDistinctiveMetrics?: any[];
  archetypeId: string;
  archetypeColor?: string;
}

const EnhancedDistinctiveMetrics: React.FC<EnhancedDistinctiveMetricsProps> = ({
  distinctiveMetrics = [],
  topDistinctiveMetrics = [],
  archetypeId,
  archetypeColor = '#6E59A5'
}) => {
  // Combine and prioritize data sources
  const getMetricsData = () => {
    // First try distinctive_metrics array
    if (distinctiveMetrics && distinctiveMetrics.length > 0) {
      return distinctiveMetrics.slice(0, 6); // Show up to 6 metrics
    }
    
    // Fall back to top_distinctive_metrics
    if (topDistinctiveMetrics && topDistinctiveMetrics.length > 0) {
      return topDistinctiveMetrics.slice(0, 6);
    }
    
    return [];
  };

  const metrics = getMetricsData();

  if (metrics.length === 0) {
    return null;
  }

  // Helper functions for metric formatting
  const isPercentMetric = (metricName: string) => {
    const name = metricName.toLowerCase();
    return name.includes('percent') || 
           name.includes('prevalence') || 
           name.includes('rate') ||
           name.includes('access') ||
           name.includes('sdoh');
  };

  const isCurrencyMetric = (metricName: string) => {
    const name = metricName.toLowerCase();
    return name.includes('cost') || 
           name.includes('amount') || 
           name.includes('salary') || 
           name.includes('spend') ||
           name.includes('paid') ||
           name.includes('savings');
  };

  const getCategoryColor = (category: string) => {
    const categoryColors: { [key: string]: string } = {
      'Cost': '#ef4444',
      'Utilization': '#3b82f6',
      'Demographics': '#10b981',
      'Disease': '#f59e0b',
      'SDOH': '#8b5cf6',
      'Risk': '#ec4899',
      'Gaps': '#06b6d4'
    };
    return categoryColors[category] || archetypeColor;
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <BarChart className="h-5 w-5" style={{ color: archetypeColor }} />
          Distinctive Metrics Analysis
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Key metrics where your archetype differs significantly from the healthcare average
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric, index) => {
            // Extract values with flexible property naming
            const metricName = metric.Metric || metric.metric || metric.name || '';
            const metricValue = metric["Archetype Value"] || metric.archetype_value || metric.value || 0;
            const averageValue = metric["Archetype Average"] || metric.archetype_average || metric.average || 0;
            const category = metric.Category || metric.category || 'General';
            const significance = metric.Significance || metric.significance || '';
            
            // Calculate percentage difference
            const percentDiff = calculatePercentageDifferenceSync(metricValue, averageValue);
            
            // Determine if lower is better
            const lowerIsBetter = isLowerBetter(metricName);
            const isPositive = (percentDiff > 0 && !lowerIsBetter) || (percentDiff < 0 && lowerIsBetter);
            
            // Format values
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

            const formattedDifference = `${Math.abs(percentDiff).toFixed(1)}%`;
            const categoryColor = getCategoryColor(category);

            return (
              <div key={index} className="bg-white rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
                {/* Category header */}
                <div className="px-4 py-2 border-b" style={{ backgroundColor: `${categoryColor}10` }}>
                  <span className="text-xs font-medium uppercase tracking-wide" 
                        style={{ color: categoryColor }}>
                    {category}
                  </span>
                </div>
                
                <div className="p-4">
                  {/* Metric name */}
                  <h5 className="font-semibold text-gray-900 text-sm mb-3 leading-tight">
                    {metricName}
                  </h5>
                  
                  {/* Values comparison */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Your Value</p>
                      <p className="text-lg font-bold text-gray-900">
                        {formattedValue}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Industry Avg</p>
                      <p className="text-sm text-gray-700">{formattedAverage}</p>
                    </div>
                  </div>
                  
                  {/* Difference indicator */}
                  <div className={`flex items-center justify-center gap-1 py-1.5 px-3 rounded-full text-xs font-medium ${
                    isPositive 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {isPositive ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )}
                    <span>{formattedDifference} difference</span>
                  </div>
                  
                  {/* Significance note */}
                  {significance && (
                    <div className="mt-2 text-xs text-gray-500 italic">
                      {significance}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Data source note */}
        <div className="mt-6 p-3 bg-gray-50 rounded-lg border">
          <p className="text-xs text-gray-600">
            <strong>Note:</strong> These metrics represent the most significant differences between your archetype 
            and the broader healthcare industry average. Values are calculated using statistical significance testing 
            to identify meaningful variations.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedDistinctiveMetrics;
