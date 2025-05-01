
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ArchetypeDetailedData, ArchetypeId, FamilyId } from '@/types/archetype';
import { useArchetypes } from './useArchetypes';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner";
import { fetchArchetypeData } from '@/services/archetypeService';
import { processArchetypeData, processFallbackData } from '@/utils/archetype/dataProcessing';
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
  const fetchFailedRef = useRef<boolean>(false);
  
  // Use state only for values that should trigger re-renders when changed
  const [archetypeData, setArchetypeData] = useState<ArchetypeDetailedData | null>(null);
  const [familyData, setFamilyData] = useState<any | null>(null);
  const [dataSource, setDataSource] = useState<string>('');
  
  const { getArchetypeEnhanced, getFamilyById } = useArchetypes();
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
  
  // Immediately try to set fallback data if we don't have any data yet
  useEffect(() => {
    if (!archetypeData && archetypeId && getArchetypeEnhanced && getFamilyById) {
      const fallbackData = getArchetypeEnhanced(archetypeId);
      if (fallbackData) {
        console.log('[useGetArchetype] Setting initial fallback data');
        const { archetypeData: initialData, familyData: initialFamilyData, dataSource: initialSource } = 
          processFallbackData(archetypeId, getArchetypeEnhanced, getFamilyById);
        
        setArchetypeData(initialData);
        setFamilyData(initialFamilyData);
        setDataSource(initialSource);
      }
    }
  }, [archetypeId, archetypeData, getArchetypeEnhanced, getFamilyById]);
  
  // Process data on success - defined as a callback to avoid recreating on each render
  const processData = useCallback((data: any) => {
    // Skip processing if no data or if processing is in progress
    if (!data || processingRef.current) {
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
        // Process database data
        const { archetypeData: formattedData, familyData: processedFamilyData, dataSource: source } = 
          processArchetypeData(data, getFamilyById, getArchetypeEnhanced);
        
        // Update refs first
        archetypeDataRef.current = formattedData;
        familyDataRef.current = processedFamilyData;
        dataSourceRef.current = source;
        
        // Then update state (triggers re-render)
        setArchetypeData(formattedData);
        setFamilyData(processedFamilyData);
        setDataSource(source);
      } else {
        // Fallback to original archetype data structure
        const { archetypeData: fallbackData, familyData: fallbackFamilyData, dataSource: fallbackSource } = 
          processFallbackData(archetypeId, getArchetypeEnhanced, getFamilyById);
        
        // Update refs first
        archetypeDataRef.current = fallbackData;
        familyDataRef.current = fallbackFamilyData;
        dataSourceRef.current = fallbackSource;
        
        // Then update state (triggers re-render)
        setArchetypeData(fallbackData);
        setFamilyData(fallbackFamilyData);
        setDataSource(fallbackSource);
      }
      
      // Update processing status
      processedDataRef.current = dataHash;
      processStatusRef.current = { complete: true, timestamp: now };
    } finally {
      // Always reset the processing flag even if there's an error
      processingRef.current = false;
    }
  }, [getFamilyById, getArchetypeEnhanced, archetypeId]);

  // Handle errors - defined as a callback to avoid recreating on each render
  const handleError = useCallback((error: Error) => {
    console.error("Error fetching archetype data:", error);
    
    // Prevent concurrent processing
    if (processingRef.current) return;
    processingRef.current = true;
    fetchFailedRef.current = true;
    
    try {
      // Fallback to original archetype data structure on error
      const { archetypeData: fallbackData, familyData: fallbackFamilyData, dataSource: fallbackSource } = 
        processFallbackData(archetypeId, getArchetypeEnhanced, getFamilyById);
      
      // Update refs first
      archetypeDataRef.current = fallbackData;
      familyDataRef.current = fallbackFamilyData;
      dataSourceRef.current = fallbackSource;
      
      // Then update state (triggers re-render)
      setArchetypeData(fallbackData);
      setFamilyData(fallbackFamilyData);
      setDataSource('Offline Data (Fallback)');
      
      // Only show this toast once
      if (fetchFailedRef.current && archetypeId) {
        toast.info("Using offline data for " + archetypeId, {
          id: `offline-data-${archetypeId}`,
          duration: 3000
        });
      }
    } finally {
      processingRef.current = false;
    }
  }, [getFamilyById, getArchetypeEnhanced, archetypeId]);

  // Force refresh data with debounce to prevent rapid calls
  const refreshData = useCallback(async () => {
    // Use standard toast method with title and description
    toast({
      title: "Refreshing Data",
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
      toast({
        title: "Refresh Successful",
        description: "Archetype data has been updated."
      });
    } catch (e) {
      toast({
        title: "Refresh Failed",
        description: "Using offline data. Check your network connection.",
        variant: "destructive" // Use destructive variant for error toasts
      });
      
      // Set fallback data when refresh fails
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
