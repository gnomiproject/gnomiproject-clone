
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ArchetypeLoadingSkeleton = () => {
  return (
    <div className="space-y-4 w-full">
      <div className="h-2 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
};

export default ArchetypeLoadingSkeleton;
