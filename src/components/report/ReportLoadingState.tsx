
import React from 'react';
import { Loader2 } from 'lucide-react';

const ReportLoadingState = () => {
  return (
    <div className="min-h-[70vh] bg-gray-50 flex flex-col items-center justify-center p-4">
      <Loader2 className="h-16 w-16 text-blue-500 animate-spin mb-6" />
      <h2 className="text-2xl font-semibold mb-3">Loading Your Report</h2>
      <p className="text-gray-600 max-w-md text-center">
        Please wait while we prepare your report. This may take a few moments...
      </p>
      <div className="mt-8 max-w-md">
        <div className="h-2 bg-blue-100 rounded overflow-hidden">
          <div className="h-full bg-blue-500 animate-pulse" style={{ width: '60%' }}></div>
        </div>
      </div>
    </div>
  );
};

export default ReportLoadingState;
