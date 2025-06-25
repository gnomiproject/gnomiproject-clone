
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Archetype, ArchetypeFamily, ArchetypeId, FamilyId } from '@/types/archetype';

// Global request deduplication map to prevent duplicate requests
const pendingRequests = new Map<string, Promise<any>>();

// Helper function to create deduplicated requests
const createDeduplicated = <T>(key: string, fetcher: () => Promise<T>): Promise<T> => {
  if (pendingRequests.has(key)) {
    console.log(`[useArchetypeBasics] Deduplicating request for: ${key}`);
    return pendingRequests.get(key);
  }
  
  const promise = fetcher().finally(() => {
    pendingRequests.delete(key);
  });
  
  pendingRequests.set(key, promise);
  return promise;
};

export const useArchetypeBasics = () => {
  // Consistent query keys - use the same keys across the entire app
  const ARCHETYPE_QUERY_KEY = ['archetypes'] as const;
  const FAMILY_QUERY_KEY = ['families'] as const;
  
  // Use React Query with enhanced deduplication
  const archetypesQuery = useQuery({
    queryKey: ARCHETYPE_QUERY_KEY,
    queryFn: () => createDeduplicated('archetypes', async () => {
      console.log('[useArchetypeBasics] Fetching archetypes...');
      
      const { data: archetypes, error } = await supabase
        .from('Core_Archetype_Overview')
        .select('*');

      if (error) {
        console.error('[useArchetypeBasics] Error fetching archetypes:', error);
        throw error;
      }

      console.log('[useArchetypeBasics] Successfully fetched archetypes:', archetypes?.length || 0);

      return archetypes.map((archetype): Archetype => ({
        id: archetype.id as ArchetypeId,
        name: archetype.name,
        family_id: archetype.family_id as FamilyId,
        short_description: archetype.short_description,
        long_description: archetype.long_description,
        hex_color: archetype.hex_color,
        key_characteristics: archetype.key_characteristics ? 
          (Array.isArray(archetype.key_characteristics) 
            ? archetype.key_characteristics.map(item => String(item))
            : typeof archetype.key_characteristics === 'string'
              ? archetype.key_characteristics.split('\n')
              : []) 
          : [],
        industries: archetype.industries
      }));
    }),
    staleTime: Infinity, // Never consider stale in development
    gcTime: Infinity,    // Keep in cache indefinitely
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 0,
    networkMode: 'online',
  });

  const familiesQuery = useQuery({
    queryKey: FAMILY_QUERY_KEY,
    queryFn: () => createDeduplicated('families', async () => {
      console.log('[useArchetypeBasics] Fetching families...');
      
      const { data: families, error } = await supabase
        .from('Core_Archetype_Families')
        .select('*');

      if (error) {
        console.error('[useArchetypeBasics] Error fetching families:', error);
        throw error;
      }

      console.log('[useArchetypeBasics] Successfully fetched families:', families?.length || 0);

      return families.map((family): ArchetypeFamily => ({
        id: family.id as FamilyId,
        name: family.name,
        short_description: family.short_description || '',
        hex_color: family.hex_color,
        common_traits: Array.isArray(family.common_traits) 
          ? family.common_traits.map(item => String(item))
          : [],
        industries: family.industries,
        long_description: family.long_description,
        description: family.short_description || family.long_description || '',
        commonTraits: Array.isArray(family.common_traits) 
          ? family.common_traits.map(item => String(item))
          : []
      }));
    }),
    staleTime: Infinity, // Never consider stale in development
    gcTime: Infinity,    // Keep in cache indefinitely
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 0,
    networkMode: 'online',
  });

  const archetypeData = archetypesQuery.data || [];
  const familyData = familiesQuery.data || [];
  const error = archetypesQuery.error || familiesQuery.error;
  const isLoading = archetypesQuery.isLoading || familiesQuery.isLoading;

  // Helper functions
  const getArchetypeById = (id: ArchetypeId) => {
    return archetypeData.find(archetype => archetype.id === id) || null;
  };

  const getArchetypesByFamily = (familyId: string) => {
    return archetypeData.filter(archetype => archetype.family_id === familyId) || [];
  };

  const getFamilyById = (id: FamilyId) => {
    return familyData.find(family => family.id === id) || null;
  };

  return {
    archetypes: archetypeData,
    families: familyData,
    getArchetypeById,
    getArchetypesByFamily,
    getFamilyById,
    isLoading,
    error,
    allArchetypes: archetypeData
  };
};
