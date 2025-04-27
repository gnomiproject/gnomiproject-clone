
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RefreshCw, Loader2, AlertTriangle } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import useReportGeneration from '@/hooks/useReportGeneration';
import ReportDetailView from './ReportDetailView';
import DatabaseConnectionStatus from './insights/DatabaseConnectionStatus';
import GenerationResults from './insights/GenerationResults';
import ArchetypeList, { Archetype } from './insights/ArchetypeList';

export function InsightsReportGenerator() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [archetypes, setArchetypes] = useState<Archetype[]>([]);
  const [generationResult, setGenerationResult] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null);
  const [viewReportOpen, setViewReportOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error' | null>(null);
  const { generateAllReports, isGenerating } = useReportGeneration();

  useEffect(() => {
    checkDatabaseConnection();
  }, []);

  const checkDatabaseConnection = async () => {
    try {
      setConnectionStatus('checking');
      console.log("Testing database connection...");
      
      const { data, error } = await supabase
        .from('Core_Archetype_Overview')
        .select('count(*)', { count: 'exact', head: true });
      
      if (error) {
        console.error("Database connection error:", error);
        setConnectionStatus('error');
        setError(`Database connection error: ${error.message}`);
        toast.error("Database Connection Failed", {
          description: error.message,
        });
        return false;
      }
      
      console.log("Database connection successful");
      setConnectionStatus('connected');
      toast.success("Database Connection Successful");
      loadArchetypes();
      return true;
    } catch (err) {
      console.error("Error testing database:", err);
      setConnectionStatus('error');
      setError(`Connection error: ${(err as Error).message}`);
      toast.error("Connection Error", {
        description: (err as Error).message,
      });
      return false;
    }
  };

  const loadArchetypes = async () => {
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

      const archetypeArray = archetypeData.map(archetype => ({
        id: archetype.id,
        name: archetype.name || 'Unnamed Archetype',
        code: archetype.id.toUpperCase(),
        lastUpdated: null,
        status: 'pending' as const
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
            // Fix: Change 'success' to 'pending' to match the expected type
            archetype.status = 'success' as 'pending' | 'success' | 'error';
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
  };

  const handleGenerateReports = async () => {
    // Fix: Remove setIsGenerating(true) as it's not defined in this scope
    // The isGenerating state is managed by the useReportGeneration hook
    setError(null);
    setGenerationResult(null);

    try {
      toast.message("Starting Report Generation", {
        description: "This process may take some time. Please wait...",
      });
      
      setArchetypes(prev => prev.map(a => ({ ...a, status: 'pending' })));
      
      const results = await generateAllReports();
      console.log("Report generation completed with results:", results);
      
      setArchetypes(prev => {
        return prev.map(archetype => ({
          ...archetype,
          status: results.archetypeIds.includes(archetype.id) ? 'success' as const : 'error' as const,
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
        connectionStatus={connectionStatus}
        error={error}
        onCheckConnection={checkDatabaseConnection}
      />
      
      {error && error !== 'No archetypes found in the database' && connectionStatus !== 'error' && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {generationResult && <GenerationResults result={generationResult} />}
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Button 
          onClick={handleGenerateReports} 
          disabled={isGenerating || isLoading || connectionStatus === 'error' || !connectionStatus}
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Reports...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate All Reports
            </>
          )}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={loadArchetypes}
          disabled={isLoading || isGenerating || connectionStatus === 'error' || !connectionStatus || isRefreshing}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? "Refreshing..." : "Refresh Status"}
        </Button>
      </div>

      <div className="rounded-md border">
        <ArchetypeList
          archetypes={archetypes}
          isLoading={isLoading}
          error={error}
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
