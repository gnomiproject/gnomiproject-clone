
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Loader2, 
  RefreshCw
} from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import generateArchetypeReports from '@/utils/archetypeReportGenerator';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface ArchetypeSummary {
  id: string;
  name: string;
  lastUpdated: string | null;
  status: 'pending' | 'success' | 'error';
}

const InsightsReportGenerator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [archetypes, setArchetypes] = useState<ArchetypeSummary[]>([]);
  const [generationResult, setGenerationResult] = useState<null | {
    total: number;
    succeeded: number;
    failed: number;
    errors?: string[];
  }>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadArchetypes();
  }, []);

  const loadArchetypes = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch all archetypes
      const { data: archetypeData, error: archetypesError } = await supabase
        .from('Core_Archetype_Overview')
        .select('id, name');
      
      if (archetypesError) throw new Error(archetypesError.message);
      
      // For each archetype, check if it has an entry in the insights reports table
      const archetypeArray: ArchetypeSummary[] = archetypeData?.map(archetype => ({
        id: archetype.id,
        name: archetype.name || 'Unnamed Archetype',
        lastUpdated: null,
        status: 'pending'
      })) || [];
      
      // Check which archetypes already have reports
      if (archetypeArray.length > 0) {
        const { data: reportData, error: reportError } = await supabase
          .from('Analysis_Archetype_Full_Reports')
          .select('archetype_id, last_updated');
        
        if (reportError) throw new Error(reportError.message);
        
        // Update status for archetypes with reports
        if (reportData && reportData.length > 0) {
          archetypeArray.forEach(archetype => {
            const report = reportData.find(r => r.archetype_id === archetype.id);
            if (report) {
              archetype.lastUpdated = new Date(report.last_updated).toLocaleString();
              archetype.status = 'success';
            }
          });
        }
      }
      
      setArchetypes(archetypeArray);
    } catch (err) {
      console.error('Error loading archetypes:', err);
      setError(typeof err === 'string' ? err : (err as Error).message || 'Unknown error occurred');
      
      toast("Error Loading Archetypes", {
        description: typeof err === 'string' ? err : (err as Error).message || 'Unknown error occurred',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReports = async () => {
    setIsGenerating(true);
    setError(null);
    setGenerationResult(null);

    try {
      toast("Starting Report Generation", {
        description: "This process may take some time. Please wait...",
      });
      
      // Update archetype status to pending
      setArchetypes(prev => prev.map(a => ({ ...a, status: 'pending' })));
      
      // Generate the reports
      const results = await generateArchetypeReports(supabase);
      console.log("Report generation completed with results:", results);
      
      // Update archetypes with new status
      setArchetypes(prev => {
        return prev.map(archetype => {
          const wasSuccessful = results.archetypeIds.includes(archetype.id);
          return {
            ...archetype,
            status: wasSuccessful ? 'success' : 'error',
            lastUpdated: wasSuccessful ? new Date().toLocaleString() : archetype.lastUpdated
          };
        });
      });
      
      setGenerationResult(results);
      
      const successMessage = results.succeeded > 0 
        ? `Processed ${results.succeeded} of ${results.total} archetypes successfully.`
        : 'No archetypes were processed successfully.';
      
      toast(results.succeeded > 0 ? "Report Generation Complete" : "Report Generation Failed", {
        description: successMessage,
        variant: results.succeeded > 0 ? "default" : "destructive",
      });
      
    } catch (error) {
      console.error('Error generating reports:', error);
      setError(typeof error === 'string' ? error : (error as Error).message || 'Unknown error occurred');
      
      toast("Error Generating Reports", {
        description: typeof error === 'string' ? error : (error as Error).message || 'Unknown error occurred',
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Insights Report Generator</h2>
        <p className="text-gray-600">
          Generate and update insights reports for all archetypes based on their metrics data.
        </p>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {generationResult && (
        <Alert variant={generationResult.succeeded > 0 ? "default" : "destructive"}>
          {generationResult.succeeded > 0 ? 
            <CheckCircle className="h-4 w-4" /> : 
            <XCircle className="h-4 w-4" />
          }
          <AlertTitle>
            Report Generation {generationResult.succeeded > 0 ? "Complete" : "Failed"}
          </AlertTitle>
          <AlertDescription>
            <p className="mt-2">
              Successfully processed {generationResult.succeeded} of {generationResult.total} archetypes.
              {generationResult.failed > 0 && ` Failed to process ${generationResult.failed} archetypes.`}
            </p>
            {generationResult.errors && generationResult.errors.length > 0 && (
              <details className="mt-2">
                <summary className="font-medium cursor-pointer">View errors</summary>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  {generationResult.errors.map((err, i) => (
                    <li key={i} className="text-sm">{err}</li>
                  ))}
                </ul>
              </details>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex items-center gap-4">
        <Button 
          onClick={handleGenerateReports} 
          disabled={isGenerating || isLoading}
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
          disabled={isLoading || isGenerating}
        >
          Refresh Status
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Archetype</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading archetypes...
                  </div>
                </TableCell>
              </TableRow>
            ) : archetypes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  No archetypes found
                </TableCell>
              </TableRow>
            ) : (
              archetypes.map(archetype => (
                <TableRow key={archetype.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText size={16} />
                      <span title={archetype.id}>{archetype.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      archetype.status === 'success' ? "success" : 
                      archetype.status === 'error' ? "destructive" : 
                      "outline"
                    }>
                      {archetype.status === 'success' ? 'Generated' : 
                       archetype.status === 'error' ? 'Failed' : 
                       'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {archetype.lastUpdated || 'Never'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InsightsReportGenerator;
