
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
  // Helper function to safely parse metrics
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

  return (
    <Card className="border-l-4" style={{ borderLeftColor: archetypeColor }}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5" style={{ color: archetypeColor }} />
          Distinctive Metrics
        </CardTitle>
        <p className="text-sm text-gray-600">
          Key metrics where {archetypeId} differs significantly from the population average
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.slice(0, 6).map((metric, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900 text-sm leading-tight">
                  {metric.metric || 'Unknown Metric'}
                </h4>
                {getSignificanceIcon(metric.difference || 0)}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Your Value:</span>
                  <span className="font-medium">
                    {typeof metric.archetype_value === 'number' 
                      ? (metric.archetype_value < 1 ? formatPercentage(metric.archetype_value) : metric.archetype_value.toLocaleString())
                      : 'N/A'
                    }
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Average:</span>
                  <span className="font-medium">
                    {typeof metric.archetype_average === 'number' 
                      ? (metric.archetype_average < 1 ? formatPercentage(metric.archetype_average) : metric.archetype_average.toLocaleString())
                      : 'N/A'
                    }
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Difference:</span>
                  <span className={`font-medium ${getDifferenceColor(metric.difference || 0)}`}>
                    {metric.difference 
                      ? `${metric.difference > 0 ? '+' : ''}${(metric.difference * 100).toFixed(1)}%`
                      : 'N/A'
                    }
                  </span>
                </div>
                
                {metric.category && (
                  <div className="pt-2 border-t border-gray-200">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {metric.category}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
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
