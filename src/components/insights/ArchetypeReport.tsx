
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArchetypeId, ArchetypeDetailedData } from '@/types/archetype';
import ArchetypeNavTabs from './components/ArchetypeNavTabs';
import ArchetypeHeader from './components/ArchetypeHeader';
import OverviewTab from './tabs/OverviewTab';
import MetricsTab from './tabs/MetricsTab';
import SwotTab from './tabs/SwotTab';
import DiseaseAndCareTab from './tabs/DiseaseAndCareTab';
import ArchetypeFooter from './components/ArchetypeFooter';
import PremiumReport from '@/components/results/PremiumReport'; 

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
  const navigate = useNavigate();

  // If in "request" mode, show the premium report form
  const isRequestMode = window.location.pathname.includes('/insights/report/');
  
  if (isRequestMode) {
    return (
      <div className="p-4 md:p-6">
        <PremiumReport 
          archetypeId={archetypeId} 
          assessmentResult={assessmentResult}
          assessmentAnswers={assessmentAnswers}
          archetypeData={reportData}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <ArchetypeHeader 
        archetypeName={reportData.name || 'Unknown Archetype'} 
        familyName={reportData.familyName || ''}
        familyColor={reportData.hexColor || reportData.color || '#4B5563'} 
      />
      <ArchetypeNavTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="p-4 md:p-6">
        {activeTab === 'overview' && <OverviewTab data={reportData} />}
        {activeTab === 'metrics' && <MetricsTab data={reportData} />}
        {activeTab === 'swot' && <SwotTab data={reportData} />}
        {activeTab === 'disease-and-care' && <DiseaseAndCareTab data={reportData} />}
      </div>

      {!hideRequestSection && (
        <ArchetypeFooter archetypeHexColor={reportData.hexColor || reportData.color || '#4B5563'} />
      )}
    </div>
  );
};

export default ArchetypeReport;
