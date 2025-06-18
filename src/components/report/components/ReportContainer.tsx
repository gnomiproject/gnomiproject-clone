
import React, { useState, useRef, useCallback, useEffect } from 'react';
import LeftNavigation from '../navigation/LeftNavigation';
import PrintButton from './PrintButton';
import { useReportNavigation } from '../hooks/useReportNavigation';
import { debounce } from '@/utils/debounce';
import { useRenderPerformance } from '@/components/shared/PerformanceMonitor';
import ReportBodyContent from './ReportBodyContent';

// Create sections array for LeftNavigation - Ensure this matches exactly with section IDs in ReportSections.tsx
const REPORT_SECTIONS = [
  { id: 'introduction', name: 'Introduction' },
  { id: 'archetype-profile', name: 'Archetype Profile' },
  { id: 'demographics', name: 'Demographics' },
  { id: 'utilization-patterns', name: 'Utilization Patterns' },
  { id: 'disease-management', name: 'Disease Management' },
  { id: 'care-gaps', name: 'Care Gaps' },
  { id: 'risk-factors', name: 'Risk Factors' },
  { id: 'cost-analysis', name: 'Cost Analysis' },
  { id: 'swot-analysis', name: 'SWOT Analysis' },
  { id: 'recommendations', name: 'Recommendations' },
  { id: 'about-report', name: 'About This Report' },
];

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
  children?: React.ReactNode;
  hideNavbar?: boolean;
  hideDebugTools?: boolean;
}

const ReportContainer: React.FC<ReportContainerProps> = ({ 
  reportData, 
  userData, 
  averageData, 
  isAdminView = false,
  debugInfo,
  onNavigate,
  children,
  hideNavbar = false,
  hideDebugTools = false
}) => {
  // Enhanced debug logging
  console.log('[ReportContainer] Rendering with:', { 
    hasReportData: !!reportData, 
    hasUserData: !!userData,
    hasChildren: !!children,
    hideNavbar,
    hideDebugTools,
    reportName: reportData?.name || reportData?.archetype_name,
    childrenType: children ? typeof children : 'none'
  });
  
  // Use React.memo to prevent unnecessary re-renders
  const MemoizedReportContainer = React.memo(() => {
    // Track performance without affecting component behavior
    useRenderPerformance('ReportContainer');
    
    const reportRef = useRef<HTMLDivElement>(null);
    
    // Use the passed onNavigate function if provided, otherwise use the hook
    const { activeSectionId, handleNavigate, isNavigating } = useReportNavigation();
    
    // State for debug tools
    const [showDebugData, setShowDebugData] = useState(false);
    const [showDiagnostics, setShowDiagnostics] = useState(false);
    
    // Debounce navigation to prevent rapid successive clicks
    const debouncedNavigate = useCallback(
      debounce((sectionId: string) => {
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
    
    const handleRefreshData = useCallback(() => {
      // Refresh specific data instead of reloading the whole page
      console.log("Refreshing report data without page reload");
      // We'll use more targeted data fetching instead of window.location.reload()
      document.dispatchEvent(new CustomEvent('refreshReportData'));
    }, []);

    if (!reportData) {
      console.error("[ReportContainer] No report data available");
      return (
        <div className="p-8 bg-red-50 border border-red-200 rounded text-center">
          <h2 className="text-xl font-bold text-red-700">Report Data Missing</h2>
          <p className="mt-2 text-red-600">Unable to load report data. Please try refreshing the data.</p>
          <button 
            onClick={handleRefreshData} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Refresh Data
          </button>
        </div>
      );
    }
    
    // Log children structure if provided
    useEffect(() => {
      if (children) {
        console.log('[ReportContainer] Children provided:', {
          type: typeof children,
          isReactElement: React.isValidElement(children),
          childrenProps: React.isValidElement(children) ? (children as React.ReactElement).props : 'Not an element'
        });
      }
    }, [children]);

    return (
      <div className="relative min-h-screen bg-gray-50">
        {/* Left navigation only on larger screens with adjusted position */}
        {!hideNavbar && (
          <div className="hidden lg:block fixed left-0 top-16 h-full print:hidden z-10"> 
            <LeftNavigation 
              activeSectionId={activeSectionId}
              onNavigate={debouncedNavigate}
              sections={REPORT_SECTIONS}
            />
          </div>
        )}
        
        {/* Print button */}
        <PrintButton 
          contentRef={reportRef} 
          documentTitle={`Healthcare Archetype Report - ${reportData?.archetype_name || reportData?.name || 'Unknown'}`} 
        />

        {/* Main report content with proper spacing */}
        <div 
          className={`${!hideNavbar ? 'lg:pl-64' : ''} print:py-0 print:pl-0 pt-16`}
          ref={reportRef}
        >
          <div className="container mx-auto p-6">
            {children ? (
              <>
                {console.log('[ReportContainer] Rendering children directly')}
                {children}
              </>
            ) : (
              <>
                {console.log('[ReportContainer] Rendering ReportBodyContent')}
                <ReportBodyContent
                  reportData={reportData}
                  userData={userData}
                  averageData={averageData}
                  isAdminView={isAdminView}
                  debugInfo={debugInfo}
                  showDebugData={showDebugData}
                  showDiagnostics={showDiagnostics}
                  setShowDebugData={setShowDebugData}
                  setShowDiagnostics={setShowDiagnostics}
                  handleRefreshData={handleRefreshData}
                  isDebugMode={isDebugMode}
                  hideDebugTools={hideDebugTools}
                />
              </>
            )}
          </div>
        </div>
        
        {/* Debug Element - always present but only visible in debug mode and never in print */}
        <div className={`fixed bottom-4 right-4 z-50 print:hidden ${isDebugMode && !hideDebugTools ? 'block' : 'hidden'}`}>
          <button
            onClick={() => console.log("Debug Data:", { reportData, userData, averageData, activeSectionId })}
            className="bg-gray-800 text-white px-3 py-1 rounded text-xs shadow-lg"
          >
            Log Debug Data
          </button>
        </div>
      </div>
    );
  });
  
  // Return the memoized container
  return <MemoizedReportContainer />;
};

export default React.memo(ReportContainer);
