
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type ArchetypeStatus = 'idle' | 'pending' | 'success' | 'error';

export interface ArchetypeListItem {
  id: string;
  name: string;
  status: ArchetypeStatus;
  lastUpdated: string | null;
  hasReport: boolean;
}

export interface UseArchetypeLoaderResult {
  archetypes: ArchetypeListItem[];
  setArchetypes: React.Dispatch<React.SetStateAction<ArchetypeListItem[]>>;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  loadArchetypes: () => Promise<void>;
}

export function useArchetypeLoader(): UseArchetypeLoaderResult {
  const [archetypes, setArchetypes] = useState<ArchetypeListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadArchetypes = useCallback(async () => {
    const isFirstLoad = isLoading;
    if (!isFirstLoad) {
      setIsRefreshing(true);
    }
    
    setError(null);
    
    try {
      console.log('Loading archetypes from database...');
      // First check if the Analysis_Archetype_Full_Reports table exists and if archetypes have reports
      let reportData: Record<string, boolean> = {};
      
      try {
        const { data: reportsList, error: reportsError } = await supabase
          .from('Analysis_Archetype_Full_Reports')
          .select('archetype_id');
          
        if (!reportsError && reportsList) {
          reportsList.forEach(report => {
            reportData[report.archetype_id] = true;
          });
        }
      } catch (error) {
        console.warn('Error checking reports table:', error);
        // Continue even if this fails, we'll just assume no reports exist
      }
      
      // Now get the list of archetypes from Core_Archetype_Overview
      const { data: archetypesData, error: archetypesError } = await supabase
        .from('Core_Archetype_Overview')
        .select('*');
        
      if (archetypesError) {
        throw new Error(`Failed to load archetypes: ${archetypesError.message}`);
      }
      
      if (!archetypesData || archetypesData.length === 0) {
        setArchetypes([]);
        setError('No archetypes found in the database');
        if (!isFirstLoad) {
          toast.warning('No archetypes found');
        }
        return;
      }
      
      console.log(`Loaded ${archetypesData.length} archetypes`);
      
      const formattedArchetypes: ArchetypeListItem[] = archetypesData.map(archetype => ({
        id: archetype.id,
        name: archetype.name || archetype.id,
        status: 'idle' as ArchetypeStatus,
        lastUpdated: null,
        hasReport: !!reportData[archetype.id]
      }));
      
      setArchetypes(formattedArchetypes);
      
      if (!isFirstLoad) {
        toast.success(`Loaded ${archetypesData.length} archetypes`);
      }
    } catch (error) {
      console.error('Error in loadArchetypes:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load archetypes';
      setError(errorMessage);
      
      if (!isFirstLoad) {
        toast.error('Error Loading Archetypes', {
          description: errorMessage,
        });
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [isLoading]);

  useEffect(() => {
    // We don't automatically load when component mounts
    // because we want to check the database connection first
    // This will be called from the parent component after connection success
  }, []);

  return {
    archetypes,
    setArchetypes,
    isLoading,
    isRefreshing,
    error,
    loadArchetypes
  };
}
