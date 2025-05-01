
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ArchetypeDetailedData, ArchetypeId } from '@/types/archetype';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner";
import { fetchArchetypeData } from '@/services/archetypeService';
import { processArchetypeData } from '@/utils/archetype/dataProcessing';
import { clearArchetypeFromCache } from '@/utils/archetype/cacheUtils';

interface UseGetArchetype {
  archetypeData: ArchetypeDetailedData | null;
  familyData: any | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<any>;
  dataSource: string;
  refreshData: () => Promise<void>;
}

export const useGetArchetype = (archetypeId: ArchetypeId, skipCache: boolean = false): UseGetArchetype => {
  // Use refs for mutable state that shouldn't trigger re-renders
  const archetypeDataRef = useRef<ArchetypeDetailedData | null>(null);
  const familyDataRef = useRef<any | null>(null);
  const dataSourceRef = useRef<string>('');
  
  // Use state only for values that should trigger re-renders when changed
  const [archetypeData, setArchetypeData] = useState<ArchetypeDetailedData | null>(null);
  const [familyData, setFamilyData] = useState<any | null>(null);
  const [dataSource, setDataSource] = useState<string>('');
  
  const queryClient = useQueryClient();
  
  // Add processing guard to prevent redundant processing
  const processingRef = useRef(false);
  const processedDataRef = useRef<string | null>(null);
  const processStatusRef = useRef({ complete: false, timestamp: 0 });
  
  // Use memoized query key to avoid unnecessary query invalidations
  const queryKey = useMemo(() => ['archetype', archetypeId, skipCache], [archetypeId, skipCache]);
  
  // Use React Query for data fetching with proper caching
  const { 
    isLoading, 
    error, 
    refetch,
    data,
    status
  } = useQuery({
    queryKey,
    queryFn: () => fetchArchetypeData(archetypeId, skipCache),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep unused data for 10 minutes
    retry: 1, // Only retry once
    enabled: Boolean(archetypeId), // Only run query if archetypeId is provided
    refetchOnWindowFocus: false, // Prevent refetching when window regains focus
    refetchOnMount: false, // Prevent refetching on component mount if data exists
    // Prevent excessive retries and backoff
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
  
  // Process data on success - defined as a callback to avoid recreating on each render
  const processData = useCallback((data: any) => {
    // Skip processing if no data or if processing is in progress
    if (processingRef.current) {
      return;
    }
    
    // Guard against redundant processing with a 5-minute cache
    const dataHash = data ? JSON.stringify(data.archetype_id) : 'null';
    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000;
    
    if (
      processedDataRef.current === dataHash && 
      processStatusRef.current.complete && 
      processStatusRef.current.timestamp > fiveMinutesAgo
    ) {
      return;
    }
    
    // Set processing flag to prevent concurrent processing
    processingRef.current = true;
    
    try {
      if (data) {
        // Extract family data from the level3_report_secure response
        const extractedFamilyData = {
          id: data.family_id,
          name: data.family_name,
          shortDescription: data.family_short_description,
          longDescription: data.family_long_description,
          industries: data.family_industries,
          hexColor: data.hex_color,
          commonTraits: data.common_traits
        };
        
        // Update refs first
        archetypeDataRef.current = data;
        familyDataRef.current = extractedFamilyData;
        dataSourceRef.current = 'level3_report_secure';
        
        // Then update state (triggers re-render)
        setArchetypeData(data);
        setFamilyData(extractedFamilyData);
        setDataSource('level3_report_secure');
      } else {
        // No data, just set everything to null
        archetypeDataRef.current = null;
        familyDataRef.current = null;
        dataSourceRef.current = 'No Data Available';
        
        setArchetypeData(null);
        setFamilyData(null);
        setDataSource('No Data Available');
      }
      
      // Update processing status
      processedDataRef.current = dataHash;
      processStatusRef.current = { complete: true, timestamp: now };
    } finally {
      // Always reset the processing flag even if there's an error
      processingRef.current = false;
    }
  }, []);

  // Handle errors - defined as a callback to avoid recreating on each render
  const handleError = useCallback((error: Error) => {
    console.error("Error fetching archetype data:", error);
    
    // Prevent concurrent processing
    if (processingRef.current) return;
    processingRef.current = true;
    
    try {
      // On error, set everything to null - no fallback data
      archetypeDataRef.current = null;
      familyDataRef.current = null;
      dataSourceRef.current = 'Error - Data Unavailable';
      
      setArchetypeData(null);
      setFamilyData(null);
      setDataSource('Error - Data Unavailable');
      
      // Show error toast
      toast.error(`Couldn't load data for ${archetypeId}`, {
        id: `error-data-${archetypeId}`,
        description: "The requested data could not be loaded",
        duration: 3000
      });
    } finally {
      processingRef.current = false;
    }
  }, [archetypeId]);

  // Force refresh data with debounce to prevent rapid calls
  const refreshData = useCallback(async () => {
    // Use standard toast method that's compatible with sonner
    toast.info("Refreshing Data", {
      description: "Fetching the latest archetype information..."
    });
    
    // Clear cache for this archetype
    clearArchetypeFromCache(archetypeId);
    
    // Reset processed data flag to force re-processing
    processedDataRef.current = null;
    processStatusRef.current = { complete: false, timestamp: 0 };
    
    // Invalidate query cache
    queryClient.invalidateQueries({
      queryKey: queryKey
    });
    
    try {
      await refetch();
      toast.success("Refresh Successful", {
        description: "Archetype data has been updated."
      });
    } catch (e) {
      toast.error("Refresh Failed", {
        description: "Unable to load data. Please try again later."
      });
      
      // Handle error with null data
      handleError(e as Error);
    }
  }, [archetypeId, queryClient, queryKey, refetch, handleError]);

  // Process data in useEffect, with improved dependency array and cleanup
  useEffect(() => {
    let isMounted = true;
    
    if (status === 'success' && data && isMounted) {
      processData(data);
    } else if (status === 'error' && error && isMounted) {
      handleError(error as Error);
    }
    
    return () => {
      isMounted = false;
    };
  }, [data, error, status, processData, handleError]);

  // Return memoized result to prevent unnecessary re-renders of components using this hook
  return useMemo(() => ({ 
    archetypeData, 
    familyData, 
    isLoading,
    error: error as Error | null,
    refetch: refetch as () => Promise<any>,
    dataSource,
    refreshData
  }), [
    archetypeData, 
    familyData, 
    isLoading, 
    error, 
    refetch, 
    dataSource, 
    refreshData
  ]);
};
