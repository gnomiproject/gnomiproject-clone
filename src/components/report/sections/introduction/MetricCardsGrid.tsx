
import React from 'react';
import MetricCard from './MetricCard';

interface Metric {
  name: string;
  value: number;
  average: number;
}

interface MetricsData {
  cost: Metric;
  risk: Metric;
  emergency: Metric;
  specialist: Metric;
}

interface MetricCardsGridProps {
  metrics: MetricsData;
}

const MetricCardsGrid = ({ metrics }: MetricCardsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Cost Metric */}
      <MetricCard 
        title={metrics.cost.name}
        value={metrics.cost.value}
        average={metrics.cost.average}
        format="currency"
        lowerIsBetter={true}
      />
      
      {/* Risk Metric */}
      <MetricCard 
        title={metrics.risk.name}
        value={metrics.risk.value}
        average={metrics.risk.average}
        format="number"
        decimals={2}
        lowerIsBetter={true}
      />
      
      {/* Emergency Visits Metric */}
      <MetricCard 
        title={metrics.emergency.name}
        value={metrics.emergency.value}
        average={metrics.emergency.average}
        lowerIsBetter={true}
      />
      
      {/* Specialist Visits Metric */}
      <MetricCard 
        title={metrics.specialist.name}
        value={metrics.specialist.value}
        average={metrics.specialist.average}
        lowerIsBetter={false}
      />
    </div>
  );
};

export default MetricCardsGrid;
