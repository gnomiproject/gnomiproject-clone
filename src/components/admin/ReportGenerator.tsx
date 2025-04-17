
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, AlertTriangle, RefreshCw, Database } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import generateArchetypeReports from '@/utils/archetypeReportGenerator';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const handleGenerateReports = async () => {
    setIsGenerating(true);
    setError(null);
    setGenerationResult(null);

    try {
      // Call the report generation function
      toast({
        title: "Starting Report Generation",
        description: "This process may take some time. Please wait...",
        duration: 5000,
      });
      
      // First verify we have tables and data available
      console.log("Checking for required tables and data...");
      const { data: archetypesData, error: archetypesError } = await supabase
        .from('archetypes')
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
      
      // Generate the actual reports
      console.log("Starting archetype report generation...");
      const results = await generateArchetypeReports(supabase);
      console.log("Report generation completed with results:", results);
      
      setGenerationResult(results);
      
      const successMessage = results.succeeded > 0 
        ? `Processed ${results.succeeded} of ${results.total} archetypes successfully.`
        : 'No archetypes were processed successfully.';
      
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
        .from('archetypes')
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

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle>Archetype Report Generator</CardTitle>
        <CardDescription>
          Generate detailed reports for all archetypes based on their metrics data
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
                  Generated reports for archetypes: {generationResult.archetypeIds.join(', ')}
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
              Generate Reports
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReportGenerator;
