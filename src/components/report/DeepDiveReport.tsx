
import React, { useState, useCallback, useMemo } from 'react';
import ReportContainer from './components/ReportContainer';
import { debounce } from '@/utils/debounce';

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
  // Add a simple state to track if navigation is in process
  const [isNavigating, setIsNavigating] = useState(false);
  
  // Use memoized values to prevent unnecessary re-renders
  const memoizedReportData = useMemo(() => reportData, [reportData]);
  const memoizedUserData = useMemo(() => userData, [userData]);
  const memoizedAverageData = useMemo(() => averageData, [averageData]);
  
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
