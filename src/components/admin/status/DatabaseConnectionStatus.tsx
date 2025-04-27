
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from '@/components/ui/button';

interface DatabaseConnectionStatusProps {
  status: 'unchecked' | 'checking' | 'connected' | 'error';
  error?: string;
  onRetry?: () => void;
}

const DatabaseConnectionStatus = ({ status, error, onRetry }: DatabaseConnectionStatusProps) => {
  if (status === 'checking') {
    return (
      <Alert className="mb-4">
        <Loader2 className="h-4 w-4 animate-spin" />
        <AlertTitle>Checking Database Connection</AlertTitle>
        <AlertDescription>Attempting to connect to Supabase database...</AlertDescription>
      </Alert>
    );
  }
  
  if (status === 'connected') {
    return (
      <Alert className="mb-4">
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Database Connected</AlertTitle>
        <AlertDescription>Successfully connected to Supabase database.</AlertDescription>
      </Alert>
    );
  }

  if (status === 'error') {
    return (
      <Alert variant="destructive" className="mb-4">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Database Connection Error</AlertTitle>
        <AlertDescription>
          <p>Failed to connect to the database. Please check your connection and try again.</p>
          {error && <p className="mt-2 text-sm font-medium">{error}</p>}
          {onRetry && (
            <Button 
              onClick={onRetry} 
              variant="outline" 
              size="sm"
              className="mt-4"
            >
              Retry Connection
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default DatabaseConnectionStatus;
