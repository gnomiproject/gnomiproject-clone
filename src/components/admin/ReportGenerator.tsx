
import React, { useState } from 'react';
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
    setDatabaseStatus('checking');
    try {
      toast.message("Testing Database Connection", {
        description: "Checking connection to Supabase...",
        duration: 3000,
      });

      const { data, error } = await supabase
        .from('Core_Archetype_Overview')
        .select('id, name')
        .limit(1);
      
      if (error) {
        console.error("Database connection error:", error);
        setDatabaseStatus('error');
        toast.error("Database Connection Failed", {
          description: error.message,
          duration: 5000,
        });
      } else {
        console.log("Database connection successful. Sample data:", data);
        setDatabaseStatus('connected');
        toast.success("Database Connection Successful", {
          description: `Connected successfully. Found ${data?.length || 0} archetypes.`,
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error testing database:", error);
      setDatabaseStatus('error');
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
        <DatabaseConnectionStatus status={databaseStatus} />
        
        {error && <GenerationError error={error} />}
        
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
          disabled={databaseStatus === 'checking'}
        >
          {databaseStatus === 'checking' ? (
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
          disabled={isGenerating || databaseStatus === 'error'}
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
