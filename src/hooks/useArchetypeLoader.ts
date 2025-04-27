
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Archetype {
  id: string;
  code: string;
  name: string;
  status: 'pending' | 'success' | 'error';
  lastUpdated: string | null;
}

export const useArchetypeLoader = () => {
  const [archetypes, setArchetypes] = useState<Archetype[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const loadArchetypes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Try first to get data from Analysis_Archetype_Full_Reports
      console.log('Fetching archetypes from Analysis_Archetype_Full_Reports...');
      const { data: reportData, error: reportError } = await supabase
        .from('Analysis_Archetype_Full_Reports')
        .select('archetype_id, last_updated');
      
      if (reportError) {
        console.warn('Error fetching from Analysis_Archetype_Full_Reports:', reportError);
      }
      
      // Get core archetypes data
      console.log('Fetching archetypes from Core_Archetype_Overview...');
      const { data, error: archError } = await supabase
        .from('Core_Archetype_Overview')
        .select('id, name, family_id');
        
      if (archError) {
        throw new Error(`Failed to load archetypes: ${archError.message}`);
      }
      
      if (!data || data.length === 0) {
        setError('No archetypes found in the database');
        setArchetypes([]);
        return;
      }
      
      // Map core data and report status
      const mappedData = data.map(arch => {
        const reportEntry = reportData?.find(r => r.archetype_id === arch.id);
        const code = arch.id.toUpperCase(); // Could be overridden if there's a custom code field
        
        return {
          id: arch.id,
          code: code,
          name: arch.name,
          status: reportEntry ? 'success' : 'pending',
          lastUpdated: reportEntry?.last_updated 
            ? new Date(reportEntry.last_updated).toLocaleString() 
            : null
        } as Archetype;
      });
      
      setArchetypes(mappedData);
      console.log(`Loaded ${mappedData.length} archetypes`);
      
    } catch (err) {
      console.error('Error in loadArchetypes:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error loading archetypes';
      setError(errorMessage);
      
      toast.error('Failed to load archetypes', {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  const refreshArchetypes = () => {
    setIsRefreshing(true);
    loadArchetypes();
  };
  
  // Initial load
  useEffect(() => {
    // Don't auto-load archetypes on mount - this will be triggered 
    // after successful DB connection check
  }, []);
  
  return {
    archetypes,
    setArchetypes,
    isLoading,
    isRefreshing,
    error,
    loadArchetypes,
    refreshArchetypes
  };
};
