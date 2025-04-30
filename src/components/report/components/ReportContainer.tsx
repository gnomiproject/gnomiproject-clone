
import React, { useState, useRef, Suspense, lazy, useCallback, useEffect } from 'react';
import LeftNavigation from '../navigation/LeftNavigation';
import PrintButton from './PrintButton';
import { useReportNavigation } from '../hooks/useReportNavigation';
import { debounce } from '@/utils/debounce';
import { useRenderPerformance } from '@/components/shared/PerformanceMonitor';

// Create sections array for LeftNavigation - sections have been reordered as requested
const REPORT_SECTIONS = [
  { id: 'introduction', name: 'Introduction' },
  { id: 'archetype-profile', name: 'Archetype Profile' },
  { id: 'demographics', name: 'Demographics' },
  { id: 'utilization-patterns', name: 'Utilization Patterns' },
  { id: 'disease-management', name: 'Disease Management' },
  { id: 'care-gaps', name: 'Care Gaps' },
  { id: 'risk-factors', name: 'Risk Factors' },
  { id: 'cost-analysis', name: 'Cost Analysis' },
  { id: 'recommendations', name: 'Recommendations' },
  { id: 'contact', name: 'Contact' },
];

// Lazy load ReportBody to improve initial load time
const LazyReportBody = lazy(() => import('./ReportBody'));

// Loading placeholder
const LoadingFallback = () => (
  <div className="p-12 flex flex-col items-center justify-center space-y-4">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    <p className="text-gray-600">Loading report content...</p>
  </div>
);

// Error fallback component
const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="p-8 bg-red-50 border border-red-200 rounded text-center">
    <h2 className="text-xl font-bold text-red-700">Error Loading Report</h2>
    <p className="mt-2 text-red-600">{error.message || "An unexpected error occurred."}</p>
    <button 
      onClick={() => window.location.reload()} 
      className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      Try Again
    </button>
  </div>
);

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
  // Track performance
  useRenderPerformance('ReportContainer');
  
  const reportRef = useRef<HTMLDivElement>(null);
  
  // Use the passed onNavigate function if provided, otherwise use the hook
  const { activeSectionId, handleNavigate, isNavigating } = useReportNavigation();
  
  // Track whether report body has mounted
  const [isReportBodyMounted, setIsReportBodyMounted] = useState(false);
  
  // Effect to log sections and verify they exist in DOM
  useEffect(() => {
    // Log section verification on mount
    console.log("[ReportContainer] Verifying section IDs match DOM elements");
    
    // Short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      REPORT_SECTIONS.forEach(section => {
        const element = document.getElementById(section.id);
        console.log(`Section ${section.id}: ${element ? "Found in DOM" : "NOT FOUND IN DOM"}`);
      });
      
      setIsReportBodyMounted(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Debounce navigation to prevent rapid successive clicks
  const debouncedNavigate = useCallback(
    debounce((sectionId: string) => {
      // Use the provided onNavigate function if it exists, otherwise use the hook function
      if (onNavigate) {
        console.log(`[ReportContainer] Using provided onNavigate for section: ${sectionId}`);
        onNavigate(sectionId);
      } else {
        console.log(`[ReportContainer] Using hook handleNavigate for section: ${sectionId}`);
        handleNavigate(sectionId);
      }
    }, 300),
    [onNavigate, handleNavigate]
  );
  
  // Debug info
  const isDebugMode = isAdminView || window.location.search.includes('debug=true');
  
  // Setup report debug tools props
  const [showDebugData, setShowDebugData] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  
  const handleRefreshData = useCallback(() => {
    // Refresh data logic would go here
    console.log("Refreshing report data");
    window.location.reload();
  }, []);

  // Store the theme color from report data
  const themeColor = reportData?.hexColor || reportData?.hex_color || "#4B5563";

  // Add debug logging to help troubleshoot loading issues
  console.log("[ReportContainer] Rendering with:", {
    hasReportData: !!reportData, 
    reportDataType: reportData ? typeof reportData : 'none',
    reportDataKeys: reportData ? Object.keys(reportData).slice(0, 10) : [],
    activeSectionId,
    reportSections: REPORT_SECTIONS.map(s => s.id)
  });

  if (!reportData) {
    console.error("[ReportContainer] No report data available");
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded text-center">
        <h2 className="text-xl font-bold text-red-700">Report Data Missing</h2>
        <p className="mt-2 text-red-600">Unable to load report data. Please try refreshing the page.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Left navigation only on larger screens */}
      <div className="hidden lg:block fixed left-0 top-0 h-full print:hidden z-10">
        <LeftNavigation 
          activeSectionId={activeSectionId}
          onNavigate={debouncedNavigate}
          sections={REPORT_SECTIONS}
        />
      </div>
      
      {/* Print button */}
      <PrintButton 
        contentRef={reportRef} 
        documentTitle={`Healthcare Archetype Report - ${reportData?.archetype_name || reportData?.name || 'Unknown'}`} 
      />

      {/* Main report content with improved error handling and lazy loading */}
      <div 
        className="lg:pl-64 py-6 print:py-0 print:pl-0"
        ref={reportRef}
      >
        <Suspense fallback={<LoadingFallback />}>
          <LazyReportBody
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
        </Suspense>
      </div>
      
      {/* Debug Element - always present but only visible in debug mode */}
      <div className={`fixed bottom-4 right-4 z-50 ${isDebugMode ? 'block' : 'hidden'}`}>
        <button
          onClick={() => console.log("Debug Data:", { reportData, userData, averageData, activeSectionId })}
          className="bg-gray-800 text-white px-3 py-1 rounded text-xs shadow-lg"
        >
          Log Debug Data
        </button>
      </div>
    </div>
  );
};

export default React.memo(ReportContainer);
