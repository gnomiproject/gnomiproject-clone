
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, Download } from 'lucide-react';
import ExecutiveSummary from './sections/ExecutiveSummary';
import MetricsAnalysis from './sections/MetricsAnalysis';
import SwotAnalysis from './sections/SwotAnalysis';
import Recommendations from './sections/Recommendations';
import DiseaseManagement from './sections/DiseaseManagement';
import CostAnalysis from './sections/CostAnalysis';
import { ArchetypeDetailedData } from '@/types/archetype';

interface DeepDiveReportProps {
  archetypeData: ArchetypeDetailedData;
  loading?: boolean;
}

const DeepDiveReport = ({ archetypeData, loading }: DeepDiveReportProps) => {
  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {archetypeData.name} Deep Dive Report
        </h1>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Print Report
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        <ExecutiveSummary archetypeData={archetypeData} />
        <MetricsAnalysis archetypeData={archetypeData} />
        <SwotAnalysis archetypeData={archetypeData} />
        <CostAnalysis archetypeData={archetypeData} />
        <DiseaseManagement archetypeData={archetypeData} />
        <Recommendations archetypeData={archetypeData} />
      </div>
    </div>
  );
};

export default DeepDiveReport;
