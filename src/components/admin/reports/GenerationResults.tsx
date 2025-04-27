
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, ExternalLink } from "lucide-react";

interface GenerationResultsProps {
  results: {
    total: number;
    processed: number;
    succeeded: number;
    failed: number;
    archetypeIds: string[];
    errors?: string[];
  };
  onViewReport: (archetypeId: string) => void;
}

const GenerationResults = ({ results, onViewReport }: GenerationResultsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge variant={results.succeeded === results.total ? "success" : "default"}>
          {results.succeeded} of {results.total} successful
        </Badge>
        
        {results.failed > 0 && (
          <Badge variant="destructive">{results.failed} failed</Badge>
        )}
      </div>
      
      {results.succeeded > 0 && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            <div className="mb-2">Generated reports for archetypes:</div>
            <div className="flex flex-wrap gap-2">
              {results.archetypeIds.map((id) => (
                <Badge 
                  key={id} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-gray-100 flex items-center gap-1"
                  onClick={() => onViewReport(id)}
                >
                  {id.toUpperCase()}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {results.errors && results.errors.length > 0 && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Failed Reports</AlertTitle>
          <AlertDescription className="mt-2">
            <ul className="list-disc pl-5 space-y-1">
              {results.errors.map((err, index) => (
                <li key={index} className="text-sm">{err}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default GenerationResults;
