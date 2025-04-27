import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import useReportGeneration from '@/hooks/useReportGeneration';
import ReportDetailView from './ReportDetailView';
import DatabaseConnectionStatus from './insights/DatabaseConnectionStatus';
import GenerationResults from './insights/GenerationResults';
import ArchetypeList from './insights/ArchetypeList';
import { useArchetypeLoader, ArchetypeListItem } from '@/hooks/useArchetypeLoader';
import { ReportActions } from './reports/ReportActions';
import { GenerationResult } from '@/types/reports';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface InsightsReportGeneratorProps {
  initialConnectionStatus?: boolean;
}

export function InsightsReportGenerator({ initialConnectionStatus }: InsightsReportGeneratorProps) {
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
  const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null);
  const [viewReportOpen, setViewReportOpen] = useState(false);
  const queryClient = useQueryClient();
  
  // Use the connection status from the parent with a fallback to "unchecked"
  const [connectionStatus, setConnectionStatus] = useState<'unchecked' | 'checking' | 'connected' | 'error'>(
    initialConnectionStatus === true ? 'connected' : 
    initialConnectionStatus === false ? 'error' : 
    'unchecked'
  );
  
  const [error, setError] = useState<string | null>(null);
  const [timeoutWarning, setTimeoutWarning] = useState(false);
  
  const { generateAllReports, isGenerating } = useReportGeneration();
  const { 
    archetypes, 
    setArchetypes,
    isLoading: archetypesLoading, 
    isRefreshing,
    error: archetypesError,
    loadArchetypes 
  } = useArchetypeLoader();
  
  // Use React Query to fetch archetypes list only when the component needs it
  const { data: archetypesData, refetch: refetchArchetypes } = useQuery({
    queryKey: ['archetypes-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('level3_report_data')
        .select('archetype_id, archetype_name, family_id, short_description')
        .order('archetype_id', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    // Only run if we have a valid connection
    enabled: connectionStatus === 'connected',
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes - fixed from cacheTime
    retry: 1,
    onSuccess: (data) => {
      // Update our local archetypes state with the fetched data
      const formattedArchetypes = data.map(item => ({
        id: item.archetype_id,
        name: item.archetype_name || '',
        familyId: item.family_id || '',
        description: item.short_description || '',
        status: 'idle' as const,
        lastUpdated: null
      }));
      setArchetypes(formattedArchetypes);
    },
    onError: (error) => {
      console.error("Error fetching archetypes:", error);
      toast.error("Error loading archetypes", {
        description: (error as Error).message,
      });
    }
  });

  // If we have initialConnectionStatus, make sure we load archetypes when component mounts
  useEffect(() => {
    if (connectionStatus === 'connected' && !archetypes.length) {
      refetchArchetypes();
    }
  }, [connectionStatus]);

  // Add timeout warning after 5 seconds if still checking
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (connectionStatus === 'checking') {
      timeoutId = setTimeout(() => {
        setTimeoutWarning(true);
      }, 5000); // 5 seconds
    } else {
      setTimeoutWarning(false);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [connectionStatus]);

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
      
      // Load archetypes if we're connected
      await refetchArchetypes();
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

  const handleGenerateReports = async () => {
    setError(null);
    setGenerationResult(null);

    try {
      toast.message("Starting Report Generation", {
        description: "This process may take some time. Please wait...",
      });
      
      setArchetypes(prev => prev.map(a => ({ 
        ...a, 
        status: 'pending' as const 
      })));
      
      const results = await generateAllReports();
      console.log("Report generation completed with results:", results);
      
      setArchetypes(prev => {
        return prev.map(archetype => ({
          ...archetype,
          status: results.archetypeIds.includes(archetype.id) ? 'success' : 'error',
          lastUpdated: results.archetypeIds.includes(archetype.id) ? new Date().toLocaleString() : archetype.lastUpdated
        }));
      });
      
      setGenerationResult(results);
      
      if (results.succeeded > 0) {
        toast.success("Report Generation Complete", {
          description: `Processed ${results.succeeded} of ${results.total} archetypes successfully.`,
        });
      } else {
        toast.error("Report Generation Failed", {
          description: 'No archetypes were processed successfully.',
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      toast.error("Error Generating Reports", {
        description: errorMessage,
      });
    }
  };

  const handleViewReport = (archetypeId: string) => {
    setSelectedArchetype(archetypeId);
    setViewReportOpen(true);
  };

  const copyReportUrl = (archetypeId: string) => {
    const url = `${window.location.origin}/insights/report/${archetypeId}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Insights report URL copied to clipboard");
    }).catch(err => {
      console.error('Failed to copy URL:', err);
      toast.error("Failed to copy URL");
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Insights Report Generator</h2>
        <p className="text-gray-600">
          Generate and update insights reports for all archetypes based on their metrics data.
        </p>
      </div>
      
      <DatabaseConnectionStatus 
        status={connectionStatus}
        error={error || undefined}
        onRetry={checkDatabaseConnection}
        timeoutWarning={timeoutWarning}
      />
      
      {error && error !== 'No archetypes found in the database' && connectionStatus !== 'error' && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {generationResult && <GenerationResults result={generationResult} />}
      
      <ReportActions 
        onGenerateReports={handleGenerateReports}
        onRefresh={() => refetchArchetypes()}
        isGenerating={isGenerating}
        isLoading={archetypesLoading}
        isRefreshing={isRefreshing}
        connectionStatus={connectionStatus === 'connected' ? 'connected' : connectionStatus === 'checking' ? 'checking' : connectionStatus === 'error' ? 'error' : null}
      />

      <div className="rounded-md border">
        <ArchetypeList
          archetypes={archetypes}
          isLoading={archetypesLoading}
          error={archetypesError}
          onViewReport={handleViewReport}
          onCopyReportUrl={copyReportUrl}
        />
      </div>

      <ReportDetailView 
        archetypeId={selectedArchetype} 
        isOpen={viewReportOpen}
        onClose={() => setViewReportOpen(false)}
      />
    </div>
  );
}

export default InsightsReportGenerator;
