
import React from 'react';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import ReportSections from './sections/ReportSections';
import ReportErrorHandler from './components/ReportErrorHandler';

interface DeepDiveReportContentProps {
  archetype: any;
  userData?: any;
  averageData?: any;
}

const DeepDiveReportContent = ({ 
  archetype, 
  userData,
  averageData
}: DeepDiveReportContentProps) => {
  const archetypeName = archetype?.name || archetype?.archetype_name || 'Unknown';
  
  if (!archetype) {
    return <ReportErrorHandler 
      archetypeName={archetypeName} 
      onRetry={() => window.location.reload()} 
    />;
  }
  
  return (
    <div className="container mx-auto p-6">
      <ErrorBoundary>
        <ReportSections 
          reportData={archetype}
          userData={userData}
          averageData={averageData}
        />
      </ErrorBoundary>
    </div>
  );
};

export default DeepDiveReportContent;
