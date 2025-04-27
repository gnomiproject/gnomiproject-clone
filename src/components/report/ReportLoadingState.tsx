
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const ReportLoadingState = () => {
  const [loadingProgress, setLoadingProgress] = useState(30);
  
  // Simulate progress for visual feedback
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        const newValue = prev + Math.floor(Math.random() * 5) + 1;
        return newValue > 90 ? 90 : newValue; // Cap at 90% until actual load completes
      });
    }, 800);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[70vh] bg-gray-50 flex flex-col items-center justify-center p-4">
      <Loader2 className="h-16 w-16 text-blue-500 animate-spin mb-6" />
      <h2 className="text-2xl font-semibold mb-3">Loading Your Report</h2>
      <p className="text-gray-600 max-w-md text-center">
        Please wait while we prepare your report. This may take a few moments...
      </p>
      <div className="mt-8 max-w-md w-full">
        <div className="h-2 bg-blue-100 rounded overflow-hidden">
          <div 
            className="h-full bg-blue-500 animate-pulse transition-all duration-500 ease-in-out" 
            style={{ width: `${loadingProgress}%` }}
          ></div>
        </div>
        <div className="text-center text-sm text-gray-500 mt-2">
          Loading local data...
        </div>
      </div>
    </div>
  );
};

export default ReportLoadingState;
