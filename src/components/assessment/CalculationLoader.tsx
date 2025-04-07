
import React, { useState, useEffect } from 'react';

// Just a single message for simplicity
const loadingMessage = "Determining your healthcare archetype...";

interface CalculationLoaderProps {
  isVisible: boolean;
}

const CalculationLoader: React.FC<CalculationLoaderProps> = ({ isVisible }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (!isVisible) return;
    
    // Reset when becoming visible
    setProgress(0);
    
    // Progress the progress bar smoothly
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 1;
      });
    }, 70); // Faster progress updates
    
    return () => clearInterval(interval);
  }, [isVisible]);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-100 dark:border-gray-800 animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Analyzing Your Responses</h2>
        </div>
        
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div 
              className="w-20 h-20 rounded-full bg-primary/20"
            ></div>
            <div 
              className="absolute inset-0 w-20 h-20 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" 
              style={{ animationDuration: '1s' }}
            ></div>
          </div>
        </div>
        
        <div className="h-2 bg-secondary/30 rounded-full mb-6 overflow-hidden">
          <div 
            className="h-2 bg-gradient-to-r from-primary to-blue-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="text-center">
          <p className="text-lg font-medium text-foreground">
            {loadingMessage}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CalculationLoader;
