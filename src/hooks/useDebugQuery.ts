
import { useEffect } from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import { useDebug } from '@/components/debug/DebugProvider';

interface DebugQueryOptions {
  tableName: string;
  fields: string[];
  queryParams?: { name: string; value: string }[];
  transformations?: { field: string; description: string; formula?: string }[];
}

export function useDebugQuery<TData>(
  queryResult: UseQueryResult<TData>,
  options: DebugQueryOptions
) {
  const { addDataSource } = useDebug();
  
  useEffect(() => {
    // Register this query with the debug system
    addDataSource({
      tableName: options.tableName,
      fields: options.fields,
      queryParams: options.queryParams,
      transformations: options.transformations
    });
    
    // Track execution time (approximation)
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      // We could track this per query if needed
    };
  }, []);
  
  return queryResult;
}
