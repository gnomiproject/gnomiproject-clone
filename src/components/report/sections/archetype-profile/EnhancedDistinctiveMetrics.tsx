
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
  // SIMPLIFIED function to get metrics - use database property names directly
  const getMetrics = () => {
    console.log('[EnhancedDistinctiveMetrics] Raw inputs:', {
      distinctiveMetrics,
      topDistinctiveMetrics,
      archetypeId
    });

    // First prioritize distinctiveMetrics prop (should contain parsed array from database)
    if (distinctiveMetrics && Array.isArray(distinctiveMetrics) && distinctiveMetrics.length > 0) {
      console.log('[EnhancedDistinctiveMetrics] Using distinctiveMetrics array:', distinctiveMetrics);
      return distinctiveMetrics;
    }
    
    // Then try topDistinctiveMetrics as fallback
    if (topDistinctiveMetrics) {
      let parsedMetrics = [];
      
      if (Array.isArray(topDistinctiveMetrics)) {
        parsedMetrics = topDistinctiveMetrics;
      } else if (typeof topDistinctiveMetrics === 'string') {
        try {
          parsedMetrics = JSON.parse(topDistinctiveMetrics);
        } catch (error) {
          console.error('[EnhancedDistinctiveMetrics] Error parsing topDistinctiveMetrics string:', error);
          return [];
        }
      } else if (typeof topDistinctiveMetrics === 'object') {
        parsedMetrics = [topDistinctiveMetrics];
      }
      
      console.log('[EnhancedDistinctiveMetrics] Using topDistinctiveMetrics:', parsedMetrics);
      return Array.isArray(parsedMetrics) ? parsedMetrics : [];
    }
    
    console.log('[EnhancedDistinctiveMetrics] No metrics found');
    return [];
  };

  const metrics = getMetrics();

  console.log('[EnhancedDistinctiveMetrics] Final metrics to display:', metrics);

  if (metrics.length === 0) {
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
          <p className="text-gray-600">No distinctive metrics available for this archetype.</p>
        </CardContent>
      </Card>
    );
  }

  // Helper function to determine if higher values are worse for a metric
  const isHigherWorse = (metricName: string): boolean => {
    const higherWorseTerms = [
      'sdoh', 'risk', 'cost', 'emergency', 'inpatient', 'readmission', 
      'mortality', 'complication', 'infection', 'error', 'avoidable', 
      'preventable', 'unnecessary', 'fraud', 'waste', 'abuse'
    ];
    
    const metricNameLower = metricName.toLowerCase();
    return higherWorseTerms.some(term => metricNameLower.includes(term));
  };

  // Helper function to get the significance icon with proper color logic
  const getSignificanceIcon = (difference: number, metricName: string) => {
    const higherIsWorse = isHigherWorse(metricName);
    
    if (difference > 0) {
      // Value is higher than average
      return higherIsWorse ? 
        <ArrowUp className="h-4 w-4 text-red-600" /> : 
        <ArrowUp className="h-4 w-4 text-green-600" />;
    }
    if (difference < 0) {
      // Value is lower than average
      return higherIsWorse ? 
        <ArrowDown className="h-4 w-4 text-green-600" /> : 
        <ArrowDown className="h-4 w-4 text-red-600" />;
    }
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  // Helper function to get the difference color with proper logic
  const getDifferenceColor = (difference: number, metricName: string) => {
    const higherIsWorse = isHigherWorse(metricName);
    
    if (difference > 0) {
      // Value is higher than average
      return higherIsWorse ? 'text-red-600' : 'text-green-600';
    }
    if (difference < 0) {
      // Value is lower than average
      return higherIsWorse ? 'text-green-600' : 'text-red-600';
    }
    return 'text-gray-600';
  };

  // Helper function to format percentage
  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  // Calculate percentage difference safely
  const calculatePercentageDifference = (value: number, average: number): number => {
    if (!value || !average || average === 0) return 0;
    return ((value - average) / average) * 100;
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
            // SIMPLIFIED property access - use database property names directly
            const metricName = metric.metric || 'Unknown Metric';
            const metricValue = metric.value || 0;
            const averageValue = metric.average || 0;
            const category = metric.category || '';
            
            // Calculate the percentage difference
            const percentDiff = calculatePercentageDifference(metricValue, averageValue);
            
            console.log(`[EnhancedDistinctiveMetrics] Metric ${index} processed:`, {
              raw: metric,
              metricName,
              metricValue,
              averageValue,
              percentDiff,
              category,
              isHigherWorse: isHigherWorse(metricName)
            });

            return (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 text-sm leading-tight">
                    {metricName}
                  </h4>
                  {getSignificanceIcon(percentDiff, metricName)}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Your Archetype:</span>
                    <span className="font-medium">
                      {typeof metricValue === 'number' 
                        ? (metricValue < 1 ? formatPercentage(metricValue) : metricValue.toLocaleString())
                        : metricValue || 'N/A'
                      }
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Archetype Average:</span>
                    <span className="font-medium">
                      {typeof averageValue === 'number' 
                        ? (averageValue < 1 ? formatPercentage(averageValue) : averageValue.toLocaleString())
                        : averageValue || 'N/A'
                      }
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Difference:</span>
                    <span className={`font-medium ${getDifferenceColor(percentDiff, metricName)}`}>
                      {percentDiff !== 0
                        ? `${percentDiff > 0 ? '+' : ''}${percentDiff.toFixed(1)}%`
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
