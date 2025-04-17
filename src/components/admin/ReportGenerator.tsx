
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react";
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

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle>Archetype Report Generator</CardTitle>
        <CardDescription>
          Generate detailed reports for all archetypes based on their metrics data
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
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
      
      <CardFooter>
        <Button 
          onClick={handleGenerateReports} 
          disabled={isGenerating}
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
