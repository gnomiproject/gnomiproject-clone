
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const loadingMessages = [
  "Comparing your responses to 400+ companies...",
  "Analyzing industry-specific benchmarks...",
  "Evaluating geographic distribution patterns...",
  "Calculating healthcare cost implications...",
  "Identifying strategic priority matches...",
  "Determining organizational archetype alignment...",
  "Finalizing your personalized healthcare strategy profile...",
  "Preparing your custom archetype report..."
];

interface CalculationLoaderProps {
  isVisible: boolean;
}

const CalculationLoader: React.FC<CalculationLoaderProps> = ({ isVisible }) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  
  useEffect(() => {
    if (!isVisible) return;
    
    // Reset when becoming visible
    setCurrentMessage(0);
    setProgress(0);
    
    // Progress the message and progress bar
    const interval = setInterval(() => {
      setCurrentMessage(prev => {
        if (prev < loadingMessages.length - 1) {
          return prev + 1;
        }
        return prev;
      });
      
      setProgress(prev => {
        return Math.min(prev + (100 / loadingMessages.length), 95);
      });
    }, 850);
    
    return () => clearInterval(interval);
  }, [isVisible]);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-100 dark:border-gray-800 animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Analyzing Your Responses</h2>
          <p className="text-muted-foreground">Please wait while we determine your organizational archetype</p>
        </div>
        
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div 
              className="w-20 h-20 rounded-full bg-primary/20 animate-pulse"
            ></div>
            <div 
              className="absolute inset-0 w-20 h-20 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" 
              style={{ animationDuration: '1s' }}
            ></div>
          </div>
        </div>
        
        <div className="h-2 bg-secondary rounded-full mb-6 overflow-hidden">
          <div 
            className="h-2 bg-gradient-to-r from-primary to-blue-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="text-center h-8">
          <div className="text-lg font-medium text-foreground marquee-text">
            {loadingMessages[currentMessage]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculationLoader;
