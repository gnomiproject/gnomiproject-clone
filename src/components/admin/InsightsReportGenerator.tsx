
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
  Copy,
  Database,
  CalendarIcon
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
import { format } from 'date-fns';

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
  const [isRefreshing, setIsRefreshing] = useState(false); // New state for refresh operation
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
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error' | null>(null);

  useEffect(() => {
    checkDatabaseConnection();
  }, []);

  const checkDatabaseConnection = async () => {
    try {
      setConnectionStatus('checking');
      console.log("Testing database connection...");
      
      // Simple query to check connection
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
    setIsRefreshing(true); // Indicate refresh operation in progress
    
    try {
      console.log("Fetching archetypes from Core_Archetype_Overview...");
      
      // Fetch all archetypes with their IDs (which include the code)
      const { data: archetypeData, error: archetypesError } = await supabase
        .from('Core_Archetype_Overview')
        .select('id, name');
      
      if (archetypesError) {
        console.error("Error fetching archetypes:", archetypesError);
        setError(`Error fetching archetypes: ${archetypesError.message}`);
        throw new Error(archetypesError.message);
      }
      
      console.log("Fetched archetypes:", archetypeData);
      
      if (!archetypeData || archetypeData.length === 0) {
        setError("No archetypes found in the database");
        setArchetypes([]);
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }
      
      // For each archetype, check if it has an entry in the insights reports table
      const archetypeArray: ArchetypeSummary[] = archetypeData.map(archetype => ({
        id: archetype.id,
        name: archetype.name || 'Unnamed Archetype',
        code: archetype.id.toUpperCase(), // Storing the ID (which is the code like A1, B2, etc.)
        lastUpdated: null,
        status: 'pending'
      }));
      
      // Check which archetypes already have reports
      if (archetypeArray.length > 0) {
        console.log("Checking for existing reports in Analysis_Archetype_Full_Reports...");
        
        const { data: reportData, error: reportError } = await supabase
          .from('Analysis_Archetype_Full_Reports')
          .select('archetype_id, last_updated');
        
        if (reportError) {
          console.error("Error fetching report data:", reportError);
          throw new Error(`Error fetching report data: ${reportError.message}`);
        }
        
        console.log("Fetched report data:", reportData);
        
        // Update status for archetypes with reports
        if (reportData && reportData.length > 0) {
          archetypeArray.forEach(archetype => {
            const report = reportData.find(r => r.archetype_id === archetype.id);
            if (report) {
              archetype.lastUpdated = report.last_updated ? new Date(report.last_updated).toLocaleString() : null;
              archetype.status = 'success';
            }
          });
        } else {
          console.log("No existing reports found in Analysis_Archetype_Full_Reports");
          
          // Try fallback to level3_report_data
          console.log("Checking level3_report_data as fallback...");
          
          const { data: level3Data, error: level3Error } = await supabase
            .from('level3_report_data')
            .select('archetype_id');
            
          if (level3Error) {
            console.warn("Error checking level3_report_data:", level3Error);
          } else if (level3Data && level3Data.length > 0) {
            console.log("Found data in level3_report_data:", level3Data.length);
            
            archetypeArray.forEach(archetype => {
              const reportExists = level3Data.some(r => r.archetype_id === archetype.id);
              if (reportExists) {
                archetype.status = 'success';
                archetype.lastUpdated = 'From level3 data';
              }
            });
          } else {
            console.log("No data found in level3_report_data either");
          }
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
      toast.success("Archetype status refreshed", {
        description: `Found ${archetypeArray.length} archetypes`
      });
    } catch (err) {
      console.error('Error loading archetypes:', err);
      setError(typeof err === 'string' ? err : (err as Error).message || 'Unknown error occurred');
      
      toast.error("Error Loading Archetypes", {
        description: typeof err === 'string' ? err : (err as Error).message || 'Unknown error occurred',
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
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

  // Get direct URL for insights report - fixed to use /insights/report path
  const getInsightsReportUrl = (archetypeId: string): string => {
    return `/insights/report/${archetypeId}`;
  };
  
  // Copy report URL to clipboard with the correct URL
  const copyReportUrl = (archetypeId: string) => {
    const url = window.location.origin + getInsightsReportUrl(archetypeId);
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
      
      {/* Connection Status */}
      {connectionStatus === 'checking' && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertTitle>Testing Database Connection</AlertTitle>
          <AlertDescription>Checking connection to Supabase database...</AlertDescription>
        </Alert>
      )}
      
      {connectionStatus === 'error' && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Database Connection Failed</AlertTitle>
          <AlertDescription>
            <p>Unable to connect to the database. This will prevent loading or generating reports.</p>
            {error && <p className="mt-2 text-sm">{error}</p>}
          </AlertDescription>
        </Alert>
      )}
      
      {connectionStatus === 'connected' && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Database Connected</AlertTitle>
          <AlertDescription>Successfully connected to Supabase database.</AlertDescription>
        </Alert>
      )}
      
      {error && error !== 'No archetypes found in the database' && connectionStatus !== 'error' && (
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
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Button 
          onClick={() => checkDatabaseConnection()}
          variant="outline"
          disabled={connectionStatus === 'checking'}
          size="lg"
        >
          {connectionStatus === 'checking' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing Connection...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Test DB Connection
            </>
          )}
        </Button>
        
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
                  {error === 'No archetypes found in the database' ? 
                    'No archetypes found in database. Make sure Core_Archetype_Overview table exists and contains data.' :
                    'No archetypes found'}
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
                    {archetype.lastUpdated ? (
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3 text-gray-400" />
                        <span>{archetype.lastUpdated}</span>
                      </div>
                    ) : 'Never'}
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
                        title="View insights report page"
                        className="h-8 w-8 p-0"
                      >
                        <Link to={getInsightsReportUrl(archetype.id)} target="_blank">
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">View Insights Report</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyReportUrl(archetype.id)}
                        disabled={archetype.status !== 'success'}
                        title="Copy insights report URL to clipboard"
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
