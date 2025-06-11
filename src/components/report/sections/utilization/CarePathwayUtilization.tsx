
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBar } from 'lucide-react';
import { formatNumber } from '@/utils/formatters';
import MetricComparisonCard from '@/components/shared/MetricComparisonCard';

interface CarePathwayUtilizationProps {
  reportData: any;
  averageData: any;
}

const CarePathwayUtilization = ({
  reportData,
  averageData
}: CarePathwayUtilizationProps) => {
  // Safety check for data
  if (!reportData || !averageData) {
    return (
      <Card className="mt-4">
        <CardContent className="p-6">
          <p className="text-gray-500">No utilization data available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <ChartBar className="mr-2 h-5 w-5 text-blue-600" />
          Care Pathway Utilization
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <p className="text-gray-600 mb-6 leading-relaxed">
          This analysis shows how members utilize primary, specialty, emergency, and urgent care services compared to the archetype average (a weighted average across all healthcare archetypes).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <MetricComparisonCard
            title="Primary Care Visits"
            value={reportData["Util_PCP Visits per 1k Members"] || 0}
            average={averageData["Util_PCP Visits per 1k Members"] || 0}
            unit="per 1,000"
            metricKey="Util_PCP Visits per 1k Members"
          />
          <MetricComparisonCard
            title="Specialist Visits" 
            value={reportData["Util_Specialist Visits per 1k Members"] || 0}
            average={averageData["Util_Specialist Visits per 1k Members"] || 0}
            unit="per 1,000"
            metricKey="Util_Specialist Visits per 1k Members"
          />
          <MetricComparisonCard
            title="Emergency Visits"
            value={reportData["Util_Emergency Visits per 1k Members"] || 0} 
            average={averageData["Util_Emergency Visits per 1k Members"] || 0}
            unit="per 1,000"
            metricKey="Util_Emergency Visits per 1k Members"
          />
          <MetricComparisonCard
            title="Urgent Care Visits"
            value={reportData["Util_Urgent Care Visits per 1k Members"] || 0}
            average={averageData["Util_Urgent Care Visits per 1k Members"] || 0}
            unit="per 1,000"
            metricKey="Util_Urgent Care Visits per 1k Members"
          />
          <MetricComparisonCard
            title="Telehealth Adoption"
            value={(reportData["Util_Telehealth Adoption"] || 0) * 100}
            average={(averageData["Util_Telehealth Adoption"] || 0) * 100}
            unit="%"
            metricKey="Util_Telehealth Adoption"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CarePathwayUtilization;
