
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Activity, AlertTriangle, Users } from 'lucide-react';

interface Metric {
  name: string;
  value: number;
  average: number;
}

interface MetricCardsGridProps {
  metrics: {
    cost: Metric;
    risk: Metric;
    emergency: Metric;
    specialist: Metric;
  };
}

const MetricCardsGrid = ({ metrics }: MetricCardsGridProps) => {
  // CRITICAL DEBUG: Log what we're receiving
  console.log('[MetricCardsGrid] 🎯 RECEIVED METRICS:', {
    cost: { value: metrics.cost.value, average: metrics.cost.average },
    risk: { value: metrics.risk.value, average: metrics.risk.average },
    emergency: { value: metrics.emergency.value, average: metrics.emergency.average },
    specialist: { value: metrics.specialist.value, average: metrics.specialist.average }
  });

  const calculatePercentageDiff = (value: number, average: number) => {
    if (average === 0) return 0;
    return ((value - average) / average) * 100;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number, decimals: number = 0) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  };

  const MetricCard = ({ 
    title, 
    value, 
    average, 
    format, 
    icon: Icon, 
    suffix = "",
    decimals = 0 
  }: {
    title: string;
    value: number;
    average: number;
    format: 'currency' | 'number';
    icon: any;
    suffix?: string;
    decimals?: number;
  }) => {
    const percentDiff = calculatePercentageDiff(value, average);
    const isPositive = percentDiff > 0;
    const isSignificant = Math.abs(percentDiff) >= 5; // 5% threshold for significance
    
    const formattedValue = format === 'currency' 
      ? formatCurrency(value)
      : formatNumber(value, decimals) + suffix;
    
    const formattedAverage = format === 'currency'
      ? formatCurrency(average)
      : formatNumber(average, decimals) + suffix;

    // CRITICAL DEBUG: Log each card's data
    console.log(`[MetricCardsGrid] 📊 ${title}:`, {
      value, 
      average, 
      formattedValue, 
      formattedAverage,
      percentDiff: percentDiff.toFixed(1) + '%'
    });

    return (
      <Card className="relative overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-lg bg-gray-50">
              <Icon className="h-6 w-6 text-gray-600" />
            </div>
            {isSignificant && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                isPositive 
                  ? 'bg-red-100 text-red-700' 
                  : 'bg-green-100 text-green-700'
              }`}>
                {isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {Math.abs(percentDiff).toFixed(1)}%
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900">{formattedValue}</p>
              <p className="text-sm text-gray-500">
                Population Avg: {formattedAverage}
              </p>
            </div>
          </div>
          
          {isSignificant && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-600">
                {isPositive 
                  ? `${Math.abs(percentDiff).toFixed(1)}% above population average`
                  : `${Math.abs(percentDiff).toFixed(1)}% below population average`
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Key Performance Indicators</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Activity className="w-4 h-4" />
          <span>Compared to population benchmarks</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Healthcare Cost"
          value={metrics.cost.value}
          average={metrics.cost.average}
          format="currency"
          icon={DollarSign}
          suffix=" PEPY"
        />
        
        <MetricCard
          title="Risk Score"
          value={metrics.risk.value}
          average={metrics.risk.average}
          format="number"
          icon={AlertTriangle}
          decimals={2}
        />
        
        <MetricCard
          title="Emergency Visits"
          value={metrics.emergency.value}
          average={metrics.emergency.average}
          format="number"
          icon={Activity}
          suffix=" per 1K"
        />
        
        <MetricCard
          title="Specialist Visits"
          value={metrics.specialist.value}
          average={metrics.specialist.average}
          format="number"
          icon={Users}
          suffix=" per 1K"
        />
      </div>
    </div>
  );
};

export default MetricCardsGrid;
