
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ArchetypeLoadingSkeleton = () => {
  return (
    <div className="space-y-4 w-full p-6 bg-white rounded-lg shadow border">
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
