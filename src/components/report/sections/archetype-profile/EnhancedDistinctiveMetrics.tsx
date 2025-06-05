
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { DistinctiveMetric } from '@/types/archetype';

interface EnhancedDistinctiveMetricsProps {
  distinctiveMetrics?: DistinctiveMetric[];
  topDistinctiveMetrics?: any;
  archetypeId: string;
  archetypeColor?: string;
}

const EnhancedDistinctiveMetrics: React.FC<EnhancedDistinctiveMetricsProps> = ({
  distinctiveMetrics = [],
  topDistinctiveMetrics,
  archetypeId,
  archetypeColor = '#6E59A5'
}) => {
  // Helper function to safely parse metrics with improved property handling
  const parseMetrics = () => {
    if (distinctiveMetrics && Array.isArray(distinctiveMetrics) && distinctiveMetrics.length > 0) {
      return distinctiveMetrics;
    }
    
    if (topDistinctiveMetrics) {
      if (Array.isArray(topDistinctiveMetrics)) {
        return topDistinctiveMetrics;
      }
      if (typeof topDistinctiveMetrics === 'string') {
        try {
          return JSON.parse(topDistinctiveMetrics);
        } catch {
          return [];
        }
      }
    }
    
    return [];
  };

  const metrics = parseMetrics();

  if (metrics.length === 0) {
    return null;
  }

  // Helper function to get the significance icon
  const getSignificanceIcon = (difference: number) => {
    if (difference > 0) return <ArrowUp className="h-4 w-4 text-green-600" />;
    if (difference < 0) return <ArrowDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  // Helper function to get the difference color
  const getDifferenceColor = (difference: number) => {
    if (difference > 0) return 'text-green-600';
    if (difference < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  // Helper function to format percentage
  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  // Helper function to get metric value with fallback property names
  const getMetricValue = (metric: any, primaryKey: string, fallbackKey: string) => {
    return metric[primaryKey] ?? metric[fallbackKey] ?? 0;
  };

  return (
    <Card className="border-l-4" style={{ borderLeftColor: archetypeColor }}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5" style={{ color: archetypeColor }} />
          Distinctive Metrics
        </CardTitle>
        <p className="text-sm text-gray-600">
          Key metrics where {archetypeId} differs significantly from the archetype average
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.slice(0, 6).map((metric, index) => {
            // Handle both property naming conventions
            const metricName = metric.metric || metric.Metric || 'Unknown Metric';
            const metricValue = getMetricValue(metric, 'value', 'archetype_value');
            const averageValue = getMetricValue(metric, 'average', 'archetype_average');
            const difference = getMetricValue(metric, 'difference', 'Difference');
            const category = metric.category || metric.Category || '';

            return (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 text-sm leading-tight">
                    {metricName}
                  </h4>
                  {getSignificanceIcon(difference)}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Your Value:</span>
                    <span className="font-medium">
                      {typeof metricValue === 'number' 
                        ? (metricValue < 1 ? formatPercentage(metricValue) : metricValue.toLocaleString())
                        : 'N/A'
                      }
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Archetype Average:</span>
                    <span className="font-medium">
                      {typeof averageValue === 'number' 
                        ? (averageValue < 1 ? formatPercentage(averageValue) : averageValue.toLocaleString())
                        : 'N/A'
                      }
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Difference:</span>
                    <span className={`font-medium ${getDifferenceColor(difference)}`}>
                      {difference 
                        ? `${difference > 0 ? '+' : ''}${(difference * 100).toFixed(1)}%`
                        : 'N/A'
                      }
                    </span>
                  </div>
                  
                  {category && (
                    <div className="pt-2 border-t border-gray-200">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {category}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {metrics.length > 6 && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              + {metrics.length - 6} more distinctive metrics available
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedDistinctiveMetrics;
