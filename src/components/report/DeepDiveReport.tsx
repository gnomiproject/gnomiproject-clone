
import React, { useEffect, useState } from 'react';
import { Section } from '@/components/shared/Section';
import ExecutiveSummary from './sections/ExecutiveSummary';
import ArchetypeProfile from './sections/ArchetypeProfile';
import ReportIntroduction from './sections/ReportIntroduction';
import SwotAnalysis from './sections/SwotAnalysis';
import DemographicsSection from './sections/DemographicsSection';
import CostAnalysis from './sections/CostAnalysis';
import UtilizationPatterns from './sections/UtilizationPatterns';
import DiseaseManagement from './sections/DiseaseManagement';
import CareGaps from './sections/CareGaps';
import RiskFactors from './sections/RiskFactors';
import Recommendations from './sections/Recommendations';
import ContactSection from './sections/ContactSection';
import ReportDebugTools from './ReportDebugTools';
import LeftNavigation from './navigation/LeftNavigation';
import { useReactToPrint } from 'react-to-print';
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeepDiveReportProps {
  reportData: any;
  userData?: any;
  averageData?: any;
  isAdminView?: boolean;
  debugInfo?: any;
}

const DeepDiveReport: React.FC<DeepDiveReportProps> = ({ 
  reportData, 
  userData, 
  averageData, 
  isAdminView = false,
  debugInfo
}) => {
  const reportRef = React.useRef<HTMLDivElement>(null);
  const [showPrintButton, setShowPrintButton] = useState(false);

  // Setup print handler
  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
    documentTitle: `Healthcare Archetype Report - ${reportData?.archetype_name || 'Unknown'}`,
    onBeforeGetContent: () => {
      document.body.classList.add('printing');
      return Promise.resolve();
    },
    onAfterPrint: () => {
      document.body.classList.remove('printing');
    }
  });

  // Show print button only after report is fully loaded
  useEffect(() => {
    if (reportData) {
      setShowPrintButton(true);
    }
  }, [reportData]);

  // Store the theme color from report data
  const themeColor = reportData?.hexColor || reportData?.hex_color || "#4B5563";

  // Debug info
  const isDebugMode = isAdminView || window.location.search.includes('debug=true');

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Left navigation only on larger screens */}
      <div className="hidden lg:block fixed left-0 top-0 h-full print:hidden">
        <LeftNavigation sections={[
          { id: 'introduction', label: 'Introduction' },
          { id: 'executive-summary', label: 'Executive Summary' },
          { id: 'archetype-profile', label: 'Archetype Profile' },
          { id: 'swot-analysis', label: 'SWOT Analysis' },
          { id: 'demographics', label: 'Demographics' },
          { id: 'cost-analysis', label: 'Cost Analysis' },
          { id: 'utilization-patterns', label: 'Utilization Patterns' },
          { id: 'disease-management', label: 'Disease Management' },
          { id: 'care-gaps', label: 'Care Gaps' },
          { id: 'risk-factors', label: 'Risk & SDOH Factors' },
          { id: 'recommendations', label: 'Recommendations' },
          { id: 'contact', label: 'Contact' }
        ]} />
      </div>
      
      {/* Print button */}
      {showPrintButton && (
        <div className="fixed bottom-6 right-6 z-10 print:hidden">
          <Button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-white border shadow-md hover:bg-gray-50"
          >
            <Printer size={18} />
            <span>Print Report</span>
          </Button>
        </div>
      )}

      {/* Main report content */}
      <div 
        className="lg:pl-64 py-6 print:py-0 print:pl-0"
        ref={reportRef}
      >
        <div className="max-w-5xl mx-auto px-4 print:px-8">
          <Section id="introduction">
            <ReportIntroduction reportData={reportData} userData={userData} />
          </Section>
          
          <Section id="executive-summary">
            <ExecutiveSummary reportData={reportData} />
          </Section>
          
          <Section id="archetype-profile">
            <ArchetypeProfile reportData={reportData} />
          </Section>
          
          <Section id="swot-analysis">
            <SwotAnalysis reportData={reportData} />
          </Section>
          
          <Section id="demographics">
            <DemographicsSection reportData={reportData} averageData={averageData} />
          </Section>
          
          <Section id="cost-analysis">
            <CostAnalysis reportData={reportData} averageData={averageData} />
          </Section>
          
          <Section id="utilization-patterns">
            <UtilizationPatterns reportData={reportData} averageData={averageData} />
          </Section>
          
          <Section id="disease-management">
            <DiseaseManagement reportData={reportData} averageData={averageData} />
          </Section>
          
          <Section id="care-gaps">
            <CareGaps reportData={reportData} averageData={averageData} />
          </Section>
          
          <Section id="risk-factors">
            <RiskFactors reportData={reportData} averageData={averageData} />
          </Section>
          
          <Section id="recommendations">
            <Recommendations reportData={reportData} />
          </Section>
          
          <Section id="contact">
            <ContactSection userData={userData} />
          </Section>

          {/* Debug tools for admin and debug mode */}
          {isDebugMode && (
            <Section id="debug" className="print:hidden">
              <ReportDebugTools 
                reportData={reportData} 
                userData={userData}
                averageData={averageData}
                debugInfo={debugInfo}
              />
            </Section>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeepDiveReport;
