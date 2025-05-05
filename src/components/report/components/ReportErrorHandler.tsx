
import React from 'react';

interface ReportErrorHandlerProps {
  archetypeName: string;
  onRetry: () => void;
}

const ReportErrorHandler: React.FC<ReportErrorHandlerProps> = ({ 
  archetypeName, 
  onRetry 
}) => {
  return (
    <div className="container mx-auto p-6">
      <div className="bg-red-50 text-red-700 p-4 rounded-lg">
        <h2 className="text-xl font-bold">Report Data Missing</h2>
        <p>Unable to load report data from level4_report_secure. Please try refreshing the page.</p>
        <button 
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry Loading
        </button>
      </div>
    </div>
  );
};

export default ReportErrorHandler;
