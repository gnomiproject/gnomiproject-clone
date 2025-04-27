
import React, { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

const loadingMessages = [
  "Preparing your personalized insights...",
  "Generating archetype details...",
  "Assembling your report...",
  "Almost there..."
];

const ArchetypeLoadingSkeleton = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4 w-full p-6 bg-white rounded-lg shadow border">
      <div className="flex items-center justify-center mb-4">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin mr-3" />
        <div className="h-6 min-w-[200px]">
          <p className="text-base text-blue-700 animate-pulse">
            {loadingMessages[messageIndex]}
          </p>
        </div>
      </div>
      
      <Skeleton className="h-8 w-3/4 mb-4" />
      <Skeleton className="h-32 w-full" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    </div>
  );
};

export default ArchetypeLoadingSkeleton;
