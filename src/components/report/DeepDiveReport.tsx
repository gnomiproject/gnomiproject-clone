
import React, { useState, useCallback, useMemo } from 'react';
import ReportContainer from './components/ReportContainer';
import { debounce } from '@/utils/debounce';
import ReportLoadingState from './ReportLoadingState';
import ReportError from './ReportError';

interface DeepDiveReportProps {
  reportData: any;
  userData?: any;
  averageData?: any;
  isAdminView?: boolean;
  debugInfo?: any;
  isLoading?: boolean;
  error?: Error | null;
}

const DeepDiveReport: React.FC<DeepDiveReportProps> = ({ 
  reportData, 
  userData, 
  averageData, 
  isAdminView = false,
  debugInfo,
  isLoading = false,
  error = null
}) => {
  // Add a simple state to track if navigation is in process
  const [isNavigating, setIsNavigating] = useState(false);
  
  // Use memoized values to prevent unnecessary re-renders
  const memoizedReportData = useMemo(() => reportData, [reportData]);
  const memoizedUserData = useMemo(() => userData, [userData]);
  const memoizedAverageData = useMemo(() => averageData, [averageData]);

  // Add debug logging
  console.log('[DeepDiveReport] Rendering with:', {
    hasReportData: !!reportData,
    hasUserData: !!userData,
    hasAverageData: !!averageData,
    isLoading,
    hasError: !!error,
    reportDataKeys: reportData ? Object.keys(reportData).slice(0, 5) : []
  });
  
  // Show loading state if data is still loading
  if (isLoading) {
    return <ReportLoadingState />;
  }
  
  // Show error state if there's an error
  if (error) {
    return (
      <ReportError 
        title="Report Loading Error" 
        message={error.message || "We're having trouble loading your report. Please try again."}
        actionLabel="Retry Loading"
        onAction={() => window.location.reload()}
      />
    );
  }

  // Show error if no report data is available
  if (!reportData) {
    return (
      <ReportError
        title="Report Data Unavailable"
        message="We couldn't find the requested report data. Please check your access link or contact support."
        actionLabel="Return Home"
        onAction={() => window.location.href = '/'}
      />
    );
  }
  
  // Optimized debounced navigation with useCallback to prevent recreation on each render
  const handleSafeNavigate = useCallback(
    debounce((sectionId: string) => {
      if (isNavigating) return; // Prevent rapid navigation
      
      setIsNavigating(true);
      
      // Find the section element
      const sectionElement = document.getElementById(sectionId);
      if (sectionElement) {
        // Scroll to the section
        sectionElement.scrollIntoView({ behavior: 'smooth' });
        
        // Set focus to the section for accessibility
        sectionElement.setAttribute('tabindex', '-1');
        sectionElement.focus({ preventScroll: true });
      } else {
        console.warn(`[DeepDiveReport] Could not find section with id: ${sectionId}`);
      }
      
      // Reset navigation state after animation completes
      setTimeout(() => {
        setIsNavigating(false);
      }, 800);
    }, 300),
    [isNavigating]
  );

  return (
    <ReportContainer
      reportData={memoizedReportData}
      userData={memoizedUserData}
      averageData={memoizedAverageData}
      isAdminView={isAdminView}
      debugInfo={debugInfo}
      onNavigate={handleSafeNavigate}
    />
  );
};

// Use React.memo to prevent unnecessary re-renders
export default React.memo(DeepDiveReport);
