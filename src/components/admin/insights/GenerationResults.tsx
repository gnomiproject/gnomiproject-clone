
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle } from "lucide-react";

interface GenerationResult {
  total: number;
  succeeded: number;
  failed: number;
  errors?: string[];
}

interface GenerationResultsProps {
  result: GenerationResult | null;
}

const GenerationResults = ({ result }: GenerationResultsProps) => {
  if (!result) return null;

  return (
    <Alert variant={result.succeeded > 0 ? "default" : "destructive"}>
      {result.succeeded > 0 ? 
        <CheckCircle className="h-4 w-4" /> : 
        <XCircle className="h-4 w-4" />
      }
      <AlertTitle>
        Report Generation {result.succeeded > 0 ? "Complete" : "Failed"}
      </AlertTitle>
      <AlertDescription>
        <p className="mt-2">
          Successfully processed {result.succeeded} of {result.total} archetypes.
          {result.failed > 0 && ` Failed to process ${result.failed} archetypes.`}
        </p>
        {result.errors && result.errors.length > 0 && (
          <details className="mt-2">
            <summary className="font-medium cursor-pointer">View errors</summary>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {result.errors.map((err, i) => (
                <li key={i} className="text-sm">{err}</li>
              ))}
            </ul>
          </details>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default GenerationResults;

