
import React from 'react';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import PreventiveCareGaps from './PreventiveCareGaps';
import PediatricCareGaps from './PediatricCareGaps';
import ImmunizationGaps from './ImmunizationGaps';
import ChronicConditionGaps from './ChronicConditionGaps';
import BehavioralHealthGaps from './BehavioralHealthGaps';
import CareOpportunities from './CareOpportunities';

interface CareGapsSectionProps {
  reportData: any;
  averageData: any;
}

const CareGapsSection: React.FC<CareGapsSectionProps> = ({ reportData, averageData }) => {
  if (!reportData) {
    return null;
  }

  // Get care_gaps content from reportData if available
  const careGapsContent = reportData.care_gaps || "";
  
  // Check if we have enough metrics to display
  const hasMetrics = reportData["Gaps_Wellness Visit Adults"] !== undefined || 
                     reportData["Gaps_Cancer Screening Breast"] !== undefined;

  // Gnome image path
  const gnomeImage = '/assets/gnomes/gnome_clipboard.png';

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <p className="text-lg">
            Care gaps identify missed opportunities for preventive care, chronic condition management, 
            and follow-up services. Addressing these gaps can improve health outcomes and reduce 
            long-term costs.
          </p>
        </div>
        <div className="md:w-1/3 flex justify-center">
          <img
            src={gnomeImage}
            alt="Care Gaps Analysis"
            className="max-h-64 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/gnomes/placeholder.svg';
            }}
          />
        </div>
      </div>

      {hasMetrics ? (
        <div className="space-y-6">
          {/* Care Opportunities at the top */}
          <CareOpportunities 
            reportData={reportData}
            averageData={averageData}
            careGapsContent={careGapsContent}
            className="mb-6" 
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PreventiveCareGaps reportData={reportData} averageData={averageData} />
            <PediatricCareGaps reportData={reportData} averageData={averageData} />
            <ImmunizationGaps reportData={reportData} averageData={averageData} />
            <ChronicConditionGaps reportData={reportData} averageData={averageData} />
            <BehavioralHealthGaps 
              reportData={reportData} 
              averageData={averageData}
              className="lg:col-span-2" 
            />
          </div>
        </div>
      ) : (
        <Card className="bg-blue-50 p-8 rounded-lg text-center">
          <AlertCircle className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Care Gap Data Coming Soon</h2>
          <p>Complete care gaps analysis will be available in the next report update.</p>
        </Card>
      )}
    </div>
  );
};

export default CareGapsSection;
