
import React, { useState, useCallback } from 'react';
import ReportContainer from './components/ReportContainer';

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
  
  // Prevent rapid navigation clicks that could cause render loops
  const handleSafeNavigate = useCallback((sectionId: string) => {
    if (isNavigating) return; // Prevent rapid navigation
    
    setIsNavigating(true);
    
    // Simple timeout to prevent navigation spam
    setTimeout(() => {
      setIsNavigating(false);
    }, 500);
  }, [isNavigating]);

  return (
    <ReportContainer
      reportData={reportData}
      userData={userData}
      averageData={averageData}
      isAdminView={isAdminView}
      debugInfo={debugInfo}
    />
  );
};

export default DeepDiveReport;
