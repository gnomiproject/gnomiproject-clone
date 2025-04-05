
import React, { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

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
      
      setProgress(prev => Math.min(prev + (100 / loadingMessages.length), 95));
    }, 850);
    
    return () => clearInterval(interval);
  }, [isVisible]);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Analyzing Your Responses</h2>
          <p className="text-gray-600">Please wait while we determine your organizational archetype</p>
        </div>
        
        <div className="flex justify-center mb-6">
          <div className="animate-spin">
            <Loader size={36} className="text-blue-600" />
          </div>
        </div>
        
        <div className="h-2 bg-gray-200 rounded-full mb-6">
          <div 
            className="h-2 bg-blue-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <ScrollArea className="h-48 border rounded-md p-4 bg-gray-50">
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className="flex items-center animate-fade-in"
              >
                <div className="mr-3 text-green-500">✓</div>
                <p>{message}</p>
              </div>
            ))}
            {messages.length < loadingMessages.length && (
              <div className="flex items-center">
                <Skeleton className="h-4 w-4 rounded-full mr-3" />
                <Skeleton className="h-4 w-full" />
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default CalculationLoader;
