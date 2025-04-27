
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, AlertTriangle, RefreshCw, Database, ExternalLink } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import generateArchetypeReports from '@/utils/archetypeReportGenerator';
import { toast } from 'sonner';
import { isValidArchetypeId } from '@/utils/archetypeValidation';
import { ArchetypeId } from '@/types/archetype';

const ReportGenerator: React.FC = () => {
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
      toast({
        title: "Starting Batch Report Generation",
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
        toast({
          title: "Error Checking Database",
          description: "Could not verify database structure. Check console for details.",
          variant: "destructive",
          duration: 5000,
        });
        throw new Error(`Database check failed: ${archetypesError.message}`);
      } else {
        console.log(`Available archetypes: ${archetypesData?.length || 0} found`);
        if (archetypesData?.length === 0) {
          toast({
            title: "No Archetypes Found",
            description: "No archetype data was found in the database. Please check your data.",
            variant: "destructive",
            duration: 5000,
          });
        }
      }
      
      // Generate the reports in batch
      console.log("Starting archetype report generation in batch...");
      const results = await generateArchetypeReports(supabase);
      console.log("Batch report generation completed with results:", results);
      
      setGenerationResult(results);
      
      const successMessage = results.succeeded > 0 
        ? `Generated ${results.succeeded} of ${results.total} archetype reports successfully.`
        : 'No archetype reports were generated successfully.';
      
      toast({
        title: results.succeeded > 0 ? "Report Generation Complete" : "Report Generation Failed",
        description: successMessage,
        variant: results.succeeded > 0 ? "default" : "destructive",
        duration: 5000,
      });
      
    } catch (error) {
      console.error('Error generating reports:', error);
      setError(typeof error === 'string' ? error : (error as Error).message || 'Unknown error occurred');
      
      toast({
        title: "Error Generating Reports",
        description: typeof error === 'string' ? error : (error as Error).message || 'Unknown error occurred',
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTestDatabaseConnection = async () => {
    setDatabaseStatus('checking');
    try {
      toast({
        title: "Testing Database Connection",
        description: "Checking connection to Supabase...",
        duration: 3000,
      });

      // Test simple query to confirm database connection
      const { data, error } = await supabase
        .from('Core_Archetype_Overview')
        .select('id, name')
        .limit(1);
      
      if (error) {
        console.error("Database connection error:", error);
        setDatabaseStatus('error');
        toast({
          title: "Database Connection Failed",
          description: error.message,
          variant: "destructive",
          duration: 5000,
        });
      } else {
        console.log("Database connection successful. Sample data:", data);
        setDatabaseStatus('connected');
        toast({
          title: "Database Connection Successful",
          description: `Connected successfully. Found ${data?.length || 0} archetypes.`,
          variant: "default",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error testing database:", error);
      setDatabaseStatus('error');
      toast({
        title: "Connection Test Error",
        description: typeof error === 'string' ? error : (error as Error).message || 'Unknown error testing connection',
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const handleViewReport = (archetypeId: string) => {
    if (isValidArchetypeId(archetypeId)) {
      window.open(`/insights/report/${archetypeId}`, '_blank');
    } else {
      toast({
        title: "Invalid Archetype ID",
        description: `Cannot view report for invalid archetype: ${archetypeId}`,
        variant: "destructive",
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
        {databaseStatus === 'connected' && (
          <Alert className="mb-4">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Database Connected</AlertTitle>
            <AlertDescription>Successfully connected to Supabase database.</AlertDescription>
          </Alert>
        )}
        
        {databaseStatus === 'error' && (
          <Alert variant="destructive" className="mb-4">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Database Connection Error</AlertTitle>
            <AlertDescription>Failed to connect to the database. Please check your connection and try again.</AlertDescription>
          </Alert>
        )}
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="mt-2 whitespace-pre-line">{error}</AlertDescription>
          </Alert>
        )}
        
        {generationResult && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant={generationResult.succeeded === generationResult.total ? "success" : "default"}>
                {generationResult.succeeded} of {generationResult.total} successful
              </Badge>
              
              {generationResult.failed > 0 && (
                <Badge variant="destructive">{generationResult.failed} failed</Badge>
              )}
            </div>
            
            {generationResult.succeeded > 0 && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  <div className="mb-2">Generated reports for archetypes:</div>
                  <div className="flex flex-wrap gap-2">
                    {generationResult.archetypeIds.map((id) => (
                      <Badge 
                        key={id} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-gray-100 flex items-center gap-1"
                        onClick={() => handleViewReport(id)}
                      >
                        {id.toUpperCase()}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            {generationResult.errors && generationResult.errors.length > 0 && (
              <Alert variant="destructive" className="mt-4">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Failed Reports</AlertTitle>
                <AlertDescription className="mt-2">
                  <ul className="list-disc pl-5 space-y-1">
                    {generationResult.errors.map((err, index) => (
                      <li key={index} className="text-sm">{err}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>
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
