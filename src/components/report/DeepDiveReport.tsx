
import React from 'react';
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
