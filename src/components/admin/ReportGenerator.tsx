
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

const ReportGenerator = () => {
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
  const [databaseStatus, setDatabaseStatus] = useState<'unchecked' | 'checking' | 'connected' | 'error'>('unchecked');
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check database connection when component mounts
    handleTestDatabaseConnection();
    
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
      
      // First verify we have tables and data available
      console.log("Checking for required tables and data...");
      const { data: archetypesData, error: archetypesError } = await supabase
        .from('Core_Archetype_Overview')
        .select('id, name')
        .limit(5);
      
      if (archetypesError) {
        console.error("Error checking archetypes table:", archetypesError);
        toast.error("Error Checking Database", {
          description: "Could not verify database structure. Check console for details.",
          duration: 5000,
        });
        throw new Error(`Database check failed: ${archetypesError.message}`);
      }
      
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
      
      // Now check for data count using a safer method
      console.log("Checking for data in Core_Archetype_Overview...");
      const { data, error } = await supabase
        .from('Core_Archetype_Overview')
        .select('*', { count: 'exact', head: true });
        
      // Clear the timeout since we got a response
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }
      
      if (error) {
        console.error("Error checking data count:", error);
        setDatabaseStatus('error');
        setError(error.message);
        toast.error("Database Connection Error", {
          description: error.message,
          duration: 5000,
        });
        return;
      }
      
      // Check if we have any data using a safer method
      const { count: countResult } = await supabase
        .from('Core_Archetype_Overview')
        .select('*', { count: 'exact' });
        
      const dataCount = typeof countResult === 'number' ? countResult : 0;
      
      console.log("Database connection successful. Data count:", dataCount);
      setDatabaseStatus('connected');
      toast.success("Database Connection Successful", {
        description: `Connected successfully. Found ${dataCount} archetypes.`,
        duration: 5000,
      });

      // Check additional required tables
      checkRequiredTables();
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

  const checkRequiredTables = async () => {
    try {
      // Check level3_report_data table using a safer approach
      console.log("Checking level3_report_data table...");
      const { data: level3Data, error: level3Error } = await supabase
        .from('level3_report_data')
        .select('archetype_id');
        
      if (level3Error) {
        console.warn("Warning: level3_report_data access error:", level3Error.message);
        toast.warning("Table Access Issue", {
          description: `Cannot access level3_report_data table: ${level3Error.message}`,
          duration: 7000,
        });
      } else {
        const level3Count = level3Data?.length || 0;
        console.log(`Found ${level3Count} rows in level3_report_data`);
        
        if (level3Count === 0) {
          toast.warning("Missing Report Data", {
            description: "level3_report_data table exists but contains no data. Reports generation may fail.",
            duration: 7000,
          });
        }
      }

      // Check Analysis_Archetype_Full_Reports table using a safer approach
      console.log("Checking Analysis_Archetype_Full_Reports table...");
      const { data: reportsData, error: reportsError } = await supabase
        .from('Analysis_Archetype_Full_Reports')
        .select('archetype_id');
        
      if (reportsError) {
        console.warn("Warning: Analysis_Archetype_Full_Reports access error:", reportsError.message);
        toast.warning("Table Access Issue", {
          description: `Cannot access Analysis_Archetype_Full_Reports table: ${reportsError.message}`,
          duration: 7000,
        });
      } else {
        const reportsCount = reportsData?.length || 0;
        console.log(`Found ${reportsCount} rows in Analysis_Archetype_Full_Reports`);
      }
    } catch (error) {
      console.error("Error checking required tables:", error);
      toast.error("Table Check Error", {
        description: typeof error === 'string' ? error : (error as Error).message || 'Unknown error checking tables',
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
