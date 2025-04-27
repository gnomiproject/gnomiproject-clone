
import React from 'react';
import { Loader2 } from 'lucide-react';

const ReportLoadingState = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
      <h2 className="text-xl font-semibold mb-2">Loading Your Report</h2>
      <p className="text-gray-600">Please wait while we prepare your report...</p>
    </div>
  );
};

export default ReportLoadingState;
