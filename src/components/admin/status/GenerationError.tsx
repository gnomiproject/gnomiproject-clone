
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface GenerationErrorProps {
  error: string;
}

const GenerationError = ({ error }: GenerationErrorProps) => (
  <Alert variant="destructive" className="mb-4">
    <AlertTriangle className="h-4 w-4" />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription className="mt-2 whitespace-pre-line">{error}</AlertDescription>
  </Alert>
);

export default GenerationError;
