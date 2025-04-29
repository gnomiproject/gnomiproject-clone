
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ArchetypeDetailedData, ArchetypeId, FamilyId } from '@/types/archetype';
import { useArchetypes } from './useArchetypes';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from "@/hooks/use-toast";
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
  const [archetypeData, setArchetypeData] = useState<ArchetypeDetailedData | null>(null);
  const [familyData, setFamilyData] = useState<any | null>(null);
  const [dataSource, setDataSource] = useState<string>(''); 
  const { getArchetypeEnhanced, getFamilyById } = useArchetypes();
  const queryClient = useQueryClient();
  
  // Add processing guard to prevent redundant processing
  const processingRef = useRef(false);
  const processedDataRef = useRef<string | null>(null);
  
  // Use React Query for data fetching with proper caching and no conditional hook usage
  const { 
    isLoading, 
    error, 
    refetch,
    data 
  } = useQuery({
    queryKey: ['archetype', archetypeId, skipCache],
    queryFn: () => fetchArchetypeData(archetypeId, skipCache),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep unused data for 10 minutes
    retry: 1, // Only retry once
    enabled: Boolean(archetypeId), // Only run query if archetypeId is provided
    refetchOnWindowFocus: false, // Prevent refetching when window regains focus
    refetchOnMount: false, // Prevent refetching on component mount if data exists
  });
  
  // Process data on success - defined as a callback to avoid recreating on each render
  const processData = useCallback((data: any) => {
    // Guard against redundant processing
    const dataHash = data ? JSON.stringify(data.archetype_id) : 'null';
    if (processedDataRef.current === dataHash) {
      console.log(`Skipping redundant processing for ${archetypeId}`);
      return;
    }
    
    console.log(`Processing data for ${archetypeId} (hash: ${dataHash})`);
    processedDataRef.current = dataHash;
    
    if (processingRef.current) {
      console.log(`Already processing data for ${archetypeId}, skipping`);
      return;
    }
    
    processingRef.current = true;
    
    try {
      if (data) {
        // Process database data
        const { archetypeData: formattedData, familyData: processedFamilyData, dataSource: source } = 
          processArchetypeData(data, getFamilyById, getArchetypeEnhanced);
        
        setArchetypeData(formattedData);
        setFamilyData(processedFamilyData);
        setDataSource(source);
      } else {
        // Fallback to original archetype data structure
        const { archetypeData: fallbackData, familyData: fallbackFamilyData, dataSource: fallbackSource } = 
          processFallbackData(archetypeId, getArchetypeEnhanced, getFamilyById);
        
        setArchetypeData(fallbackData);
        setFamilyData(fallbackFamilyData);
        setDataSource(fallbackSource);
      }
    } finally {
      // Always reset the processing flag even if there's an error
      processingRef.current = false;
    }
  }, [getFamilyById, getArchetypeEnhanced, archetypeId]);

  // Handle errors - defined as a callback to avoid recreating on each render
  const handleError = useCallback((error: Error) => {
    console.error("Error fetching archetype data:", error);
    
    // Fallback to original archetype data structure on error
    const { archetypeData: fallbackData, familyData: fallbackFamilyData, dataSource: fallbackSource } = 
      processFallbackData(archetypeId, getArchetypeEnhanced, getFamilyById);
    
    setArchetypeData(fallbackData);
    setFamilyData(fallbackFamilyData);
    setDataSource(fallbackSource);
  }, [getFamilyById, getArchetypeEnhanced, archetypeId]);

  // Force refresh data
  const refreshData = async () => {
    // Use standard toast method with title and description
    toast({
      title: "Refreshing Archetype Data",
      description: "Fetching the latest information..."
    });
    
    // Clear cache for this archetype
    clearArchetypeFromCache(archetypeId);
    
    // Reset processed data flag to force re-processing
    processedDataRef.current = null;
    
    // Invalidate query cache
    queryClient.invalidateQueries({
      queryKey: ['archetype', archetypeId]
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
        description: "Unable to update archetype data. Please try again.",
        variant: "destructive" // Use destructive variant for error toasts
      });
    }
  };

  // Process data in useEffect, with improved dependency array and cleanup
  useEffect(() => {
    let isMounted = true;
    
    // Only process data if component is still mounted
    if (data && isMounted) {
      processData(data);
    } else if (error && isMounted) {
      handleError(error as Error);
    }
    
    return () => {
      // Mark component as unmounted to prevent state updates
      isMounted = false;
      console.log(`Cleaning up resources for archetype ${archetypeId}`);
    };
  }, [data, error, processData, handleError, archetypeId]);

  // Cleanup function for memory management
  useEffect(() => {
    return () => {
      // Clean up any heavy data on unmount
      console.log(`Cleaning up resources for archetype ${archetypeId}`);
      processedDataRef.current = null;
    };
  }, [archetypeId]);

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(() => ({ 
    archetypeData, 
    familyData, 
    isLoading,
    error: error as Error | null,
    refetch: refetch as () => Promise<any>,
    dataSource,
    refreshData
  }), [archetypeData, familyData, isLoading, error, refetch, dataSource, refreshData]);
};
