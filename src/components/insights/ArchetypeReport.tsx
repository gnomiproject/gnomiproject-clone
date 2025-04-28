
import React from 'react';
import { ArchetypeId, ArchetypeDetailedData } from '@/types/archetype';
import ArchetypeNavTabs from './components/ArchetypeNavTabs';
import ArchetypeHeader from './components/ArchetypeHeader';
import OverviewTab from './tabs/OverviewTab';
import MetricsTab from './tabs/MetricsTab';
import SwotTab from './tabs/SwotTab';
import DiseaseAndCareTab from './tabs/DiseaseAndCareTab';
import DeepDiveRequestForm from '@/components/results/DeepDiveRequestForm';

interface ArchetypeReportProps {
  archetypeId: ArchetypeId;
  reportData: ArchetypeDetailedData;
  assessmentResult?: any;
  assessmentAnswers?: any;
  hideRequestSection?: boolean;
}

const ArchetypeReport = ({ 
  archetypeId, 
  reportData, 
  assessmentResult,
  assessmentAnswers,
  hideRequestSection = false
}: ArchetypeReportProps) => {
  const [activeTab, setActiveTab] = React.useState('overview');

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <ArchetypeHeader 
        name={reportData.name || 'Unknown Archetype'} 
        family={reportData.familyName || ''}
        color={reportData.hexColor || reportData.color || '#4B5563'} 
      />
      
      <ArchetypeNavTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="p-4 md:p-6">
        {activeTab === 'overview' && <OverviewTab reportData={reportData} />}
        {activeTab === 'metrics' && <MetricsTab reportData={reportData} />}
        {activeTab === 'swot' && <SwotTab reportData={reportData} />}
        {activeTab === 'disease-and-care' && <DiseaseAndCareTab reportData={reportData} />}
      </div>

      {!hideRequestSection && (
        <div className="border-t border-gray-100">
          <DeepDiveRequestForm
            archetypeId={archetypeId}
            assessmentResult={assessmentResult}
            assessmentAnswers={assessmentAnswers}
            archetypeData={reportData}
          />
        </div>
      )}
    </div>
  );
};

export default ArchetypeReport;
