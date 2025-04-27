
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Archetype } from '@/types/reports';

export const useArchetypeLoader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [archetypes, setArchetypes] = useState<Archetype[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadArchetypes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setIsRefreshing(true);
    
    try {
      console.log("Fetching archetypes from Core_Archetype_Overview...");
      
      const { data: archetypeData, error: archetypesError } = await supabase
        .from('Core_Archetype_Overview')
        .select('id, name');
      
      if (archetypesError) {
        throw new Error(archetypesError.message);
      }
      
      if (!archetypeData || archetypeData.length === 0) {
        setError("No archetypes found in the database");
        setArchetypes([]);
        return;
      }

      const archetypeArray: Archetype[] = archetypeData.map(archetype => ({
        id: archetype.id,
        name: archetype.name || 'Unnamed Archetype',
        code: archetype.id.toUpperCase(),
        lastUpdated: null,
        status: 'pending'
      }));

      // Check existing reports
      const { data: reportData } = await supabase
        .from('Analysis_Archetype_Full_Reports')
        .select('archetype_id, last_updated');

      if (reportData) {
        archetypeArray.forEach(archetype => {
          const report = reportData.find(r => r.archetype_id === archetype.id);
          if (report) {
            archetype.lastUpdated = report.last_updated;
            archetype.status = report.last_updated ? 'success' : 'pending';
          }
        });
      }

      // Sort archetypes by code
      archetypeArray.sort((a, b) => a.code.localeCompare(b.code));
      
      setArchetypes(archetypeArray);
      toast.success("Archetype status refreshed", {
        description: `Found ${archetypeArray.length} archetypes`
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      toast.error("Error Loading Archetypes", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  return {
    archetypes,
    setArchetypes,
    isLoading,
    isRefreshing,
    error,
    loadArchetypes
  };
};
