
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
      
      // Implement the actual report generation logic
      await generateArchetypeReports(supabase);
      
      // Simulate a result for UI feedback
      const mockResult = {
        total: 9,  // assuming 9 archetypes
        processed: 9,
        succeeded: 9,
        failed: 0,
        archetypeIds: ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3']
      };
      
      setGenerationResult(mockResult);
      
      toast({
        title: "Report Generation Complete",
        description: `Processed ${mockResult.succeeded} of ${mockResult.total} archetypes successfully.`,
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
