
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArchetypeDetailedData } from '@/types/archetype';
import MetricCard from '../metrics/MetricCard';

interface MetricsTabProps {
  archetypeData: ArchetypeDetailedData;
}

const MetricsTab = ({ archetypeData }: MetricsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Demographics Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Demographics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard 
                title="Average Family Size" 
                value={archetypeData["Demo_Average Family Size"] || 0} 
                format="number" 
                decimals={1}
              />
              <MetricCard 
                title="Average Age" 
                value={archetypeData["Demo_Average Age"] || 0} 
                format="number" 
                decimals={1}
                suffix="years"
              />
              <MetricCard 
                title="Geographic Spread" 
                value={archetypeData["Demo_Average States"] || 0} 
                format="number" 
                decimals={0}
                suffix="states"
              />
            </div>
          </div>

          {/* Utilization Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Utilization Patterns</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard 
                title="ER Visits per 1k" 
                value={archetypeData["Util_Emergency Visits per 1k Members"] || 0} 
                format="number" 
                decimals={0}
              />
              <MetricCard 
                title="Specialist Visits per 1k" 
                value={archetypeData["Util_Specialist Visits per 1k Members"] || 0} 
                format="number" 
                decimals={0}
              />
              <MetricCard 
                title="Hospital Admits per 1k" 
                value={archetypeData["Util_Inpatient Admits per 1k Members"] || 0} 
                format="number" 
                decimals={0}
              />
              <MetricCard 
                title="Non-Utilizers" 
                value={archetypeData["Util_Percent of Members who are Non-Utilizers"] || 0} 
                format="percent" 
                decimals={1}
              />
            </div>
          </div>

          {/* Risk Profile Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Risk Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MetricCard 
                title="Clinical Risk Score" 
                value={archetypeData["Risk_Average Risk Score"] || 0} 
                format="number" 
                decimals={2}
              />
              <MetricCard 
                title="SDOH Risk Score" 
                value={archetypeData["SDOH_Average SDOH"] || 0} 
                format="number" 
                decimals={2}
              />
            </div>
          </div>

          {/* Cost Metrics Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Cost Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MetricCard 
                title="Total Healthcare Spend per Employee" 
                value={archetypeData["Cost_Medical & RX Paid Amount PEPY"] || 0} 
                format="currency" 
                decimals={0}
              />
              <MetricCard 
                title="Avoidable ER Potential Savings" 
                value={archetypeData["Cost_Avoidable ER Potential Savings PMPY"] || 0} 
                format="currency" 
                decimals={0}
                suffix="PMPY"
              />
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-blue-700">For detailed benchmarking and trend analysis, request the full archetype report</p>
            <Button className="mt-2 bg-blue-700 hover:bg-blue-800" size="sm">
              Request Full Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricsTab;
