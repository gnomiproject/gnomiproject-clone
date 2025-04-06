
import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
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
  const [messages, setMessages] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  
  useEffect(() => {
    if (!isVisible) return;
    
    // Reset messages when becoming visible
    setMessages([]);
    setProgress(0);
    
    // Add a new message approximately every second
    const interval = setInterval(() => {
      setMessages(prev => {
        if (prev.length < loadingMessages.length) {
          return [...prev, loadingMessages[prev.length]];
        }
        return prev;
      });
      
      setProgress(prev => {
        const newProgress = Math.min(prev + (100 / loadingMessages.length), 95);
        // Show a toast notification at 50% progress
        if (prev < 50 && newProgress >= 50) {
          toast({
            title: "Halfway there!",
            description: "Still analyzing your organizational data...",
          });
        }
        return newProgress;
      });
    }, 850);
    
    return () => clearInterval(interval);
  }, [isVisible, toast]);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-100 dark:border-gray-800 animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Analyzing Your Responses</h2>
          <p className="text-gray-600 dark:text-gray-400">Please wait while we determine your organizational archetype</p>
        </div>
        
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-100 dark:border-gray-700 border-dashed rounded-full animate-spin"></div>
            <div 
              className="absolute inset-0 border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" 
              style={{ animationDirection: 'reverse', animationDuration: '1s' }}
            ></div>
          </div>
        </div>
        
        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full mb-8 overflow-hidden">
          <div 
            className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <ScrollArea className="h-48 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 space-y-3">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={cn(
                  "flex items-center p-2 rounded-md",
                  "transform transition-all duration-500",
                  index === messages.length - 1 ? "bg-blue-50 dark:bg-blue-900/20" : ""
                )}
                style={{
                  animationDelay: `${index * 100}ms`, 
                  opacity: 0, 
                  animation: "messageSlideIn 0.5s ease-out forwards"
                }}
              >
                <div className="mr-3 text-green-500 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{message}</p>
              </div>
            ))}
            {messages.length < loadingMessages.length && (
              <div className="flex items-center p-2 animate-pulse">
                <div className="w-5 h-5 mr-3 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default CalculationLoader;
