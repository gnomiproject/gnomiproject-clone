
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCallback } from 'react';
import { ArchetypeId } from '@/types/archetype';

/**
 * Hook to fetch basic archetype data with efficient caching
 */
export const useArchetypeBasics = () => {
  // Use a longer cache time to prevent unnecessary refetching
  const { data: archetypes, isLoading, error } = useQuery({
    queryKey: ['archetype-basics'],
    queryFn: async () => {
      console.log('[RLS Test] Fetching archetype basics...');
      
      // First try to retrieve from local storage cache
      const cachedData = sessionStorage.getItem('archetypes_cache');
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          const cacheTimestamp = parsedData.timestamp;
          
          // Use cache if it's less than 1 hour old
          if (Date.now() - cacheTimestamp < 3600000) {
            console.log('[Performance] Using cached archetype data');
            return parsedData.data;
          }
        } catch (e) {
          console.warn('Cache parsing error:', e);
        }
      }
      
      // If no valid cache, fetch from Supabase
      const { data, error } = await supabase
        .from('Core_Archetype_Overview')
        .select('*');
      
      if (error) throw error;
      
      if (data) {
        console.log('[RLS Test] Successfully fetched archetypes, count:', data.length);
        
        // Cache the fresh data
        sessionStorage.setItem('archetypes_cache', JSON.stringify({
          data,
          timestamp: Date.now()
        }));
      }
      
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000,   // Keep unused data for 10 minutes
  });

  const { data: families, isLoading: familiesLoading } = useQuery({
    queryKey: ['family-basics'],
    queryFn: async () => {
      console.log('[RLS Test] Fetching family basics...');
      
      // Try cache first
      const cachedData = sessionStorage.getItem('families_cache');
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          if (Date.now() - parsedData.timestamp < 3600000) {
            console.log('[Performance] Using cached family data');
            return parsedData.data;
          }
        } catch (e) {
          console.warn('Cache parsing error:', e);
        }
      }
      
      const { data, error } = await supabase
        .from('Core_Archetype_Families')
        .select('*');
      
      if (error) throw error;
      
      if (data) {
        console.log('[RLS Test] Successfully fetched families, count:', data.length);
        sessionStorage.setItem('families_cache', JSON.stringify({
          data,
          timestamp: Date.now()
        }));
      }
      
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const getFamilyById = useCallback((id: 'a' | 'b' | 'c') => {
    return families?.find((family) => family.id === id);
  }, [families]);

  // Add the missing functions
  const getArchetypeById = useCallback((id: ArchetypeId) => {
    return archetypes?.find((archetype) => archetype.id === id);
  }, [archetypes]);

  const getArchetypesByFamily = useCallback((familyId: 'a' | 'b' | 'c') => {
    return archetypes?.filter((archetype) => archetype.family_id === familyId) || [];
  }, [archetypes]);

  return {
    archetypes,
    families,
    isLoading: isLoading || familiesLoading,
    error,
    getFamilyById,
    // Add these properties to fix the TypeScript errors
    getArchetypeById,
    getArchetypesByFamily,
    allArchetypes: archetypes || []
  };
};

export default useArchetypeBasics;
