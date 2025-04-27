
import React, { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { ArchetypeId } from '@/types/archetype';
import useReportGeneration from '@/hooks/useReportGeneration';
import DatabaseConnectionStatus from './insights/DatabaseConnectionStatus';

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

const InsightsReportGenerator: React.FC = () => {
  // Change 'idle' to 'unchecked' to match the expected type
  const [connectionStatus, setConnectionStatus] = useState<'unchecked' | 'checking' | 'connected' | 'error'>('unchecked');
  const [timeoutWarning, setTimeoutWarning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [archetypes, setArchetypes] = useState<ArchetypeListItem[]>([]);
  const { generateAllReports, isGenerating } = useReportGeneration();

  const checkDatabaseConnection = async () => {
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
              id: item.id || '',
              name: item.name || '',
              familyId: item.family_id || '',
              description: item.short_description || '',
              status: 'idle' as const,
              lastUpdated: null,
              hasReport: false
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

  const handleGenerateAllReports = async () => {
    try {
      if (connectionStatus !== 'connected') {
        const connected = await checkDatabaseConnection();
        if (!connected) {
          toast.error("Please establish database connection first");
          return;
        }
      }
      
      const results = await generateAllReports();
      toast.success("Reports generation completed", {
        description: `Generated ${results.succeeded} reports successfully.`
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error("Error generating reports", {
        description: errorMessage,
      });
    }
  };

  // Return JSX here
  return (
    <div className="space-y-6">
      <DatabaseConnectionStatus 
        status={connectionStatus}
        error={error || undefined}
        onRetry={checkDatabaseConnection}
        timeoutWarning={timeoutWarning}
      />
      
      {connectionStatus === 'connected' && (
        <div className="space-y-4">
          <button 
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            onClick={handleGenerateAllReports}
            disabled={isGenerating}
          >
            {isGenerating ? "Generating Reports..." : "Generate All Reports"}
          </button>
          
          {archetypes.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-medium">Found {archetypes.length} archetypes</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InsightsReportGenerator;
