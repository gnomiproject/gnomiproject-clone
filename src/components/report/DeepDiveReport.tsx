
import React, { useState, useCallback } from 'react';
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
  
  // Debounce navigation to prevent performance issues
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
      
      // Simple timeout to prevent navigation spam
      setTimeout(() => {
        setIsNavigating(false);
      }, 800);
    }, 300),
    [isNavigating]
  );

  return (
    <ReportContainer
      reportData={reportData}
      userData={userData}
      averageData={averageData}
      isAdminView={isAdminView}
      debugInfo={debugInfo}
      onNavigate={handleSafeNavigate}
    />
  );
};

export default React.memo(DeepDiveReport);
