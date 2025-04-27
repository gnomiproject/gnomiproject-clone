
import React from 'react';
import { Card } from '@/components/ui/card';
import { ArchetypeDetailedData } from '@/types/archetype';
import ExecutiveSummary from './ExecutiveSummary';
import SwotAnalysis from './SwotAnalysis';
import MetricsAnalysis from './MetricsAnalysis';

interface InsightsReportContentProps {
  archetype: ArchetypeDetailedData;
}

const InsightsReportContent = ({ archetype }: InsightsReportContentProps) => {
  return (
    <div className="max-w-7xl mx-auto py-8 space-y-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {archetype.name} Insights Report
          </h1>
          <p className="text-gray-500 mt-2">
            Comprehensive analysis and strategic recommendations
          </p>
        </div>
      </div>

      <div className="grid gap-8">
        <ExecutiveSummary archetypeData={archetype} />
        <SwotAnalysis archetypeData={archetype} />
        <MetricsAnalysis archetypeData={archetype} />
      </div>
    </div>
  );
};

export default InsightsReportContent;
