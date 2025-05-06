
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface ReportLoadingStateProps {
  message?: string;
  archetypeName?: string;
}

const ReportLoadingState = ({ 
  message = 'Loading your report', 
  archetypeName 
}: ReportLoadingStateProps) => {
  const [loadingProgress, setLoadingProgress] = useState(30);
  const [loadingMessage, setLoadingMessage] = useState('Preparing report data...');
  
  // Simulate progress for visual feedback
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        // Gradually increase the progress with smaller increments as we get closer to 90%
        const increment = Math.max(1, Math.floor(5 * (100 - prev) / 70));
        const newValue = prev + increment;
        return newValue > 90 ? 90 : newValue; // Cap at 90% until actual load completes
      });
      
      // Change the message based on progress
      if (loadingProgress > 60 && loadingMessage === 'Preparing report data...') {
        setLoadingMessage('Formatting report content...');
      } else if (loadingProgress > 80 && loadingMessage === 'Formatting report content...') {
        setLoadingMessage('Almost ready...');
      }
    }, 800);
    
    return () => clearInterval(interval);
  }, [loadingProgress, loadingMessage]);

  return (
    <div className="min-h-[70vh] bg-gray-50 flex flex-col items-center justify-center p-6">
      <Loader2 className="h-16 w-16 text-blue-500 animate-spin mb-6" />
      <h2 className="text-2xl font-semibold mb-3 text-center">
        {message}
        {archetypeName && <span className="text-blue-600"> {archetypeName}</span>}
      </h2>
      <p className="text-gray-600 max-w-md text-center">
        Please wait while we prepare your report. This should take just a moment...
      </p>
      <div className="mt-8 max-w-md w-full">
        <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-500 ease-in-out" 
            style={{ width: `${loadingProgress}%` }}
          ></div>
        </div>
        <div className="text-center text-sm text-gray-500 mt-2">
          {loadingMessage}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ReportLoadingState);
