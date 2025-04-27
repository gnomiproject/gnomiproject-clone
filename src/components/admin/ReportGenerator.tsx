
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Database, RefreshCw } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import generateArchetypeReports from '@/utils/archetypeReportGenerator';
import { toast } from 'sonner';
import { isValidArchetypeId } from '@/utils/archetypeValidation';
import DatabaseConnectionStatus from './status/DatabaseConnectionStatus';
import GenerationError from './status/GenerationError';
import GenerationResults from './reports/GenerationResults';
import { useQuery } from '@tanstack/react-query';

interface ReportGeneratorProps {
  initialConnectionStatus?: boolean;
}

const ReportGenerator = ({ initialConnectionStatus }: ReportGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState<null | {
    total: number;
    processed: number;
    succeeded: number;
    failed: number;
    archetypeIds: string[];
    errors?: string[];
  }>(null);
  const [error, setError] = useState<string | null>(null);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Use the connection status from the parent with a fallback to "unchecked"
  const [databaseStatus, setDatabaseStatus] = useState<'unchecked' | 'checking' | 'connected' | 'error'>(
    initialConnectionStatus === true ? 'connected' : 
    initialConnectionStatus === false ? 'error' : 
    'unchecked'
  );

  // Use React Query to fetch database metadata only when needed
  const { data: dbMetadata, refetch: refreshDbMetadata, isLoading: isCheckingTables } = useQuery({
    queryKey: ['database-tables-check'],
    queryFn: async () => {
      // Check for all required tables in a single query
      const tablesData = await Promise.all([
        supabase.from('level3_report_data').select('count(*)', { count: 'exact', head: true }),
        supabase.from('Analysis_Archetype_Full_Reports').select('count(*)', { count: 'exact', head: true }),
      ]);
      
      return {
        level3Count: tablesData[0].count || 0,
        reportsCount: tablesData[1].count || 0,
        hasErrors: tablesData.some(result => result.error != null),
        errors: tablesData.map(result => result.error).filter(Boolean),
      };
    },
    // Only run this query when explicitly needed, not on component mount
    enabled: false,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 0,
  });

  useEffect(() => {
    // Clean up timeout on unmount
    return () => {
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
    };
  }, []);

  const handleGenerateReports = async () => {
    setIsGenerating(true);
    setError(null);
    setGenerationResult(null);

    try {
      toast.message("Starting Batch Report Generation", {
        description: "Generating reports for all archetypes. Please wait...",
        duration: 5000,
      });
      
      // Generate the reports in batch
      console.log("Starting archetype report generation in batch...");
      const results = await generateArchetypeReports(supabase);
      console.log("Batch report generation completed with results:", results);
      
      setGenerationResult(results);
      
      const successMessage = results.succeeded > 0 
        ? `Generated ${results.succeeded} of ${results.total} archetype reports successfully.`
        : 'No archetype reports were generated successfully.';
      
      if (results.succeeded > 0) {
        toast.success("Report Generation Complete", {
          description: successMessage,
          duration: 5000,
        });
      } else {
        toast.error("Report Generation Failed", {
          description: successMessage,
          duration: 5000,
        });
      }
      
    } catch (error) {
      console.error('Error generating reports:', error);
      setError(typeof error === 'string' ? error : (error as Error).message || 'Unknown error occurred');
      
      toast.error("Error Generating Reports", {
        description: typeof error === 'string' ? error : (error as Error).message || 'Unknown error occurred',
        duration: 5000,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTestDatabaseConnection = async () => {
    // Clear any existing timeout
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
    }
    
    setDatabaseStatus('checking');
    setShowTimeoutWarning(false);
    setError(null);
    
    // Set a timeout to show a warning if the connection is taking too long
    connectionTimeoutRef.current = setTimeout(() => {
      if (databaseStatus === 'checking') {
        setShowTimeoutWarning(true);
      }
    }, 5000);
    
    try {
      toast.message("Testing Database Connection", {
        description: "Checking connection to Supabase...",
        duration: 3000,
      });

      // Use a simplified query to test connection first
      console.log("Testing basic database connection...");
      const { error: connectionError } = await supabase
        .from('Core_Archetype_Overview')
        .select('id')
        .limit(1);
      
      // Clear the timeout since we got a response
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }
      
      if (connectionError) {
        console.error("Basic database connection error:", connectionError);
        setDatabaseStatus('error');
        setError(connectionError.message);
        toast.error("Database Connection Failed", {
          description: connectionError.message,
          duration: 5000,
        });
        return;
      }
      
      setDatabaseStatus('connected');
      // Now fetch metadata about the tables
      await refreshDbMetadata();
      
      toast.success("Database Connection Successful", {
        description: "Connected successfully to Supabase.",
        duration: 5000,
      });

    } catch (error) {
      // Clear the timeout if there was an error
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }
      
      console.error("Error testing database:", error);
      setDatabaseStatus('error');
      setError(typeof error === 'string' ? error : (error as Error).message || 'Unknown error occurred');
      
      toast.error("Connection Test Error", {
        description: typeof error === 'string' ? error : (error as Error).message || 'Unknown error testing connection',
        duration: 5000,
      });
    }
  };

  const handleViewReport = (archetypeId: string) => {
    if (isValidArchetypeId(archetypeId)) {
      window.location.href = `/insights/report/${archetypeId}`;
    } else {
      toast.error("Invalid Archetype ID", {
        description: `Cannot view report for invalid archetype: ${archetypeId}`,
      });
    }
  };

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle>Archetype Report Generator</CardTitle>
        <CardDescription>
          Generate detailed reports for all archetypes (a1-c3) in batch
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <DatabaseConnectionStatus 
          status={databaseStatus} 
          error={error || undefined}
          onRetry={handleTestDatabaseConnection}
          timeoutWarning={showTimeoutWarning}
        />
        
        {error && databaseStatus !== 'error' && <GenerationError error={error} />}
        
        {generationResult && (
          <GenerationResults 
            results={generationResult}
            onViewReport={handleViewReport}
          />
        )}

        {dbMetadata && databaseStatus === 'connected' && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium text-sm text-gray-700 mb-2">Database Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Level 3 Report Data:</p>
                <p className="font-medium">{dbMetadata.level3Count} records</p>
              </div>
              <div>
                <p className="text-gray-600">Full Reports:</p>
                <p className="font-medium">{dbMetadata.reportsCount} records</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <Button 
          onClick={handleTestDatabaseConnection}
          variant="outline"
          disabled={databaseStatus === 'checking' && !showTimeoutWarning}
        >
          {databaseStatus === 'checking' && !showTimeoutWarning ? (
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
          disabled={isGenerating || databaseStatus === 'error' || databaseStatus === 'checking'}
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
      </CardFooter>
    </Card>
  );
};

export default ReportGenerator;
