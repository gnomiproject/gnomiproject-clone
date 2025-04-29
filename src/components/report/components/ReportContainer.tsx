
import React, { useState, useRef } from 'react';
import LeftNavigation from '../navigation/LeftNavigation';
import PrintButton from './PrintButton';
import { useReportNavigation } from '../hooks/useReportNavigation';
import ReportBody from './ReportBody';

// Create sections array for LeftNavigation
const REPORT_SECTIONS = [
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

interface ReportContainerProps {
  reportData: any;
  userData?: any;
  averageData?: any;
  isAdminView?: boolean;
  debugInfo?: any;
  onNavigate?: (sectionId: string) => void;
}

const ReportContainer: React.FC<ReportContainerProps> = ({ 
  reportData, 
  userData, 
  averageData, 
  isAdminView = false,
  debugInfo,
  onNavigate
}) => {
  const reportRef = useRef<HTMLDivElement>(null);
  // Use the passed onNavigate function if provided, otherwise use the hook
  const { activeSectionId, handleNavigate, isNavigating } = useReportNavigation();
  
  // Function to handle navigation requests
  const handleSectionNavigate = (sectionId: string) => {
    // Use the provided onNavigate function if it exists, otherwise use the hook function
    if (onNavigate) {
      onNavigate(sectionId);
    } else {
      handleNavigate(sectionId);
    }
  };
  
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

  // Store the theme color from report data
  const themeColor = reportData?.hexColor || reportData?.hex_color || "#4B5563";

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Left navigation only on larger screens */}
      <div className="hidden lg:block fixed left-0 top-0 h-full print:hidden z-10">
        <LeftNavigation 
          activeSectionId={activeSectionId}
          onNavigate={handleSectionNavigate}
          sections={REPORT_SECTIONS}
        />
      </div>
      
      {/* Print button */}
      <PrintButton 
        contentRef={reportRef} 
        documentTitle={`Healthcare Archetype Report - ${reportData?.archetype_name || 'Unknown'}`} 
      />

      {/* Main report content */}
      <div 
        className="lg:pl-64 py-6 print:py-0 print:pl-0"
        ref={reportRef}
      >
        <ReportBody
          reportData={reportData}
          userData={userData}
          averageData={averageData}
          isDebugMode={isDebugMode}
          showDebugData={showDebugData}
          showDiagnostics={showDiagnostics}
          setShowDebugData={setShowDebugData}
          setShowDiagnostics={setShowDiagnostics}
          handleRefreshData={handleRefreshData}
          isAdminView={isAdminView}
          debugInfo={debugInfo}
        />
      </div>
    </div>
  );
};

export default ReportContainer;
