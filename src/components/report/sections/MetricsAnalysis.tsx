
import React from 'react';
import { ArchetypeDetailedData } from '@/types/archetype';
import SectionTitle from '@/components/shared/SectionTitle';

export interface MetricsAnalysisProps {
  reportData: ArchetypeDetailedData;
  averageData: any;
}

const MetricsAnalysis: React.FC<MetricsAnalysisProps> = ({ 
  reportData,
  averageData 
}) => {
  return (
    <div className="space-y-6">
      <SectionTitle title="Metrics Analysis" />
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <p className="text-gray-600">
          This section provides a detailed analysis of key metrics for {reportData.name || reportData.archetype_name}.
        </p>
        
        {/* Metrics content would be displayed here */}
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Detailed metrics content will be displayed in this section.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MetricsAnalysis;
