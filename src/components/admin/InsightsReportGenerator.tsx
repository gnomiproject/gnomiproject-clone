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
  RefreshCw,
  Eye,
  ExternalLink,
  Copy
} from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import generateArchetypeReports from '@/utils/reports/archetypeReportGenerator';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import ReportDetailView from './ReportDetailView';
import { Link } from 'react-router-dom';
import { getSecureReportUrl } from '@/utils/tokenGenerator';

interface ArchetypeSummary {
  id: string;
  name: string;
  lastUpdated: string | null;
  status: 'pending' | 'success' | 'error';
  code?: string; // Added archetype code property
}

export function InsightsReportGenerator() {
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
  const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null);
  const [viewReportOpen, setViewReportOpen] = useState(false);

  useEffect(() => {
    loadArchetypes();
  }, []);

  const loadArchetypes = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch all archetypes with their IDs (which include the code)
      const { data: archetypeData, error: archetypesError } = await supabase
        .from('Core_Archetype_Overview')
        .select('id, name');
      
      if (archetypesError) throw new Error(archetypesError.message);
      
      // For each archetype, check if it has an entry in the insights reports table
      const archetypeArray: ArchetypeSummary[] = archetypeData?.map(archetype => ({
        id: archetype.id,
        name: archetype.name || 'Unnamed Archetype',
        code: archetype.id, // Storing the ID (which is the code like A1, B2, etc.)
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
      
      // Sort archetypes by their code (A1, A2, B1, B2, etc.)
      archetypeArray.sort((a, b) => {
        if (a.code && b.code) {
          return a.code.localeCompare(b.code);
        }
        return 0;
      });
      
      setArchetypes(archetypeArray);
    } catch (err) {
      console.error('Error loading archetypes:', err);
      setError(typeof err === 'string' ? err : (err as Error).message || 'Unknown error occurred');
      
      toast.error("Error Loading Archetypes", {
        description: typeof err === 'string' ? err : (err as Error).message || 'Unknown error occurred',
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
      toast.message("Starting Report Generation", {
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
      
      if (results.succeeded > 0) {
        toast.success("Report Generation Complete", {
          description: successMessage,
        });
      } else {
        toast.error("Report Generation Failed", {
          description: successMessage,
        });
      }
    } catch (error) {
      console.error('Error generating reports:', error);
      setError(typeof error === 'string' ? error : (error as Error).message || 'Unknown error occurred');
      
      toast.error("Error Generating Reports", {
        description: typeof error === 'string' ? error : (error as Error).message || 'Unknown error occurred',
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleViewReport = (archetypeId: string) => {
    setSelectedArchetype(archetypeId);
    setViewReportOpen(true);
  };

  // Generate a secure report URL for a specific archetype
  const getArchetypeReportUrl = (archetypeId: string): string => {
    return getSecureReportUrl(archetypeId);
  };
  
  // Copy report URL to clipboard
  const copyReportUrl = (archetypeId: string) => {
    const url = window.location.origin + getSecureReportUrl(archetypeId);
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Report URL copied to clipboard");
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
              <TableHead>Code</TableHead>
              <TableHead>Archetype</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading archetypes...
                  </div>
                </TableCell>
              </TableRow>
            ) : archetypes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No archetypes found
                </TableCell>
              </TableRow>
            ) : (
              archetypes.map(archetype => (
                <TableRow key={archetype.id}>
                  <TableCell>
                    <span className="font-medium">{archetype.code}</span>
                  </TableCell>
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
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewReport(archetype.id)}
                        disabled={archetype.status !== 'success'}
                        title={archetype.status !== 'success' ? 'No report available' : 'View JSON data'}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View Report Data</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        disabled={archetype.status !== 'success'}
                        title="View secure report page"
                        className="h-8 w-8 p-0"
                      >
                        <Link to={getSecureReportUrl(archetype.id)} target="_blank">
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">View Report Page</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyReportUrl(archetype.id)}
                        disabled={archetype.status !== 'success'}
                        title="Copy report URL to clipboard"
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy Report URL</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Report Detail Dialog */}
      <ReportDetailView 
        archetypeId={selectedArchetype} 
        isOpen={viewReportOpen}
        onClose={() => setViewReportOpen(false)}
      />
    </div>
  );
}

export default InsightsReportGenerator;
