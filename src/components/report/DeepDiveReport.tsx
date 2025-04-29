
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
  const [activeSectionId, setActiveSectionId] = useState('introduction');

  // Setup print handler with correct properties according to react-to-print API
  const handlePrint = useReactToPrint({
    documentTitle: `Healthcare Archetype Report - ${reportData?.archetype_name || 'Unknown'}`,
    // The onBeforeGetContent and onAfterPrint need to be implemented differently
    // as they're not directly supported in the options type
    onBeforePrint: () => {
      document.body.classList.add('printing');
      return Promise.resolve(); // Return a resolved Promise to satisfy TypeScript
    },
    onAfterPrint: () => {
      document.body.classList.remove('printing');
    },
    // Use printRef instead of content
    printRef: () => reportRef.current,
  });

  // Show print button only after report is fully loaded
  useEffect(() => {
    if (reportData) {
      setShowPrintButton(true);
    }
  }, [reportData]);

  // Handle navigation
  const handleNavigate = (sectionId: string) => {
    setActiveSectionId(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Store the theme color from report data
  const themeColor = reportData?.hexColor || reportData?.hex_color || "#4B5563";

  // Debug info
  const isDebugMode = isAdminView || window.location.search.includes('debug=true');
  
  // Setup report debug tools props
  const [showDebugData, setShowDebugData] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  
  const handleRefreshData = () => {
    // Refresh data logic would go here
    console.log("Refreshing report data");
    window.location.reload();
  };

  // Create sections array for LeftNavigation
  const sections = [
    { id: 'introduction', name: 'Introduction' },
    { id: 'executive-summary', name: 'Executive Summary' },
    { id: 'archetype-profile', name: 'Archetype Profile' },
    { id: 'swot-analysis', name: 'SWOT Analysis' },
    { id: 'demographics', name: 'Demographics' },
    { id: 'cost-analysis', name: 'Cost Analysis' },
    { id: 'utilization-patterns', name: 'Utilization Patterns' },
    { id: 'disease-management', name: 'Disease Management' },
    { id: 'care-gaps', name: 'Care Gaps' },
    { id: 'risk-factors', name: 'Risk Factors' },
    { id: 'recommendations', name: 'Recommendations' },
    { id: 'contact', name: 'Contact' },
  ];

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Left navigation only on larger screens */}
      <div className="hidden lg:block fixed left-0 top-0 h-full print:hidden">
        <LeftNavigation 
          activeSectionId={activeSectionId}
          onNavigate={handleNavigate}
          sections={sections}
        />
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
            <ReportIntroduction userData={userData} />
          </Section>
          
          <Section id="executive-summary">
            <ExecutiveSummary archetypeData={reportData} />
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
            <Recommendations archetypeData={reportData} />
          </Section>
          
          <Section id="contact">
            <ContactSection userData={userData} />
          </Section>

          {/* Debug tools for admin and debug mode */}
          {isDebugMode && (
            <Section id="debug" className="print:hidden">
              <ReportDebugTools 
                showDebugData={showDebugData}
                toggleDebugData={() => setShowDebugData(!showDebugData)}
                showDiagnostics={showDiagnostics}
                toggleDiagnostics={() => setShowDiagnostics(!showDiagnostics)}
                onRefreshData={handleRefreshData}
                isAdminView={isAdminView}
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
