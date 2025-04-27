
import React, { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { ArchetypeId } from '@/types/archetype';

// Define ArchetypeListItem type
interface ArchetypeListItem {
  id: string;
  name: string;
  familyId: string;
  description: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  lastUpdated: Date | null;
  hasReport: boolean;
}

const checkDatabaseConnection = async () => {
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'checking' | 'connected' | 'error'>('idle');
  const [timeoutWarning, setTimeoutWarning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [archetypes, setArchetypes] = useState<ArchetypeListItem[]>([]);
  
  try {
    setConnectionStatus('checking');
    setTimeoutWarning(false);
    setError(null);
    console.log("Testing database connection to Supabase...");
    
    // Set a timeout to prevent hanging connections
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timed out after 15 seconds')), 15000);
    });
    
    // Try a simple query with a fast timeout
    const queryPromise = supabase
      .from('Core_Archetype_Overview')
      .select('count(*)', { count: 'exact', head: true });
    
    // Race the query against the timeout
    const { data, error: connError } = await Promise.race([
      queryPromise,
      timeoutPromise.then(() => { throw new Error('Connection timed out'); })
    ]) as any;
    
    if (connError) {
      console.error("Database connection error:", connError);
      setConnectionStatus('error');
      setError(`Database connection error: ${connError.message}`);
      toast.error("Database Connection Failed", {
        description: connError.message,
      });
      return false;
    }
    
    console.log("Database connection successful, count result:", data);
    setConnectionStatus('connected');
    toast.success("Database Connection Successful");
    
    // Define refetchArchetypes function
    const refetchArchetypes = async () => {
      // Get archetypes from database
      const { data: archetypesData, error: archetypesError } = await supabase
        .from('Core_Archetype_Overview')
        .select('*');
      
      if (archetypesError) {
        console.error("Error fetching archetypes:", archetypesError);
        return { error: archetypesError };
      }
      
      return { data: archetypesData };
    };
    
    // Load archetypes if we're connected
    await refetchArchetypes()
      .then(result => {
        // After fetching, process the data
        if (result.data) {
          const formattedArchetypes: ArchetypeListItem[] = result.data.map(item => ({
            id: item.archetype_id || item.id,
            name: item.archetype_name || item.name || '',
            familyId: item.family_id || '',
            description: item.short_description || '',
            status: 'idle' as const,
            lastUpdated: null,
            hasReport: false // Add the missing property
          }));
          setArchetypes(formattedArchetypes);
        }
      });
    return true;
  } catch (err) {
    console.error("Error testing database:", err);
    setConnectionStatus('error');
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    setError(`Connection error: ${errorMessage}`);
    toast.error("Connection Error", {
      description: errorMessage,
    });
    return false;
  }
};

// Return the exported function
return { checkDatabaseConnection };
