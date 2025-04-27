
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertTriangle, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from '@/components/ui/progress';

interface DatabaseConnectionStatusProps {
  status: 'checking' | 'connected' | 'error' | null;
  error: string | null;
  onRetry: () => void;
  timeoutWarning?: boolean;
}

const DatabaseConnectionStatus = ({ 
  status, 
  error,
  onRetry,
  timeoutWarning = false
}: DatabaseConnectionStatusProps) => {
  if (status === 'checking') {
    return (
      <Alert className="mb-4">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertTitle>Testing Database Connection</AlertTitle>
        </div>
        <AlertDescription className="mt-2">
          <p>Checking connection to Supabase database...</p>
          {timeoutWarning && (
            <div className="mt-3">
              <Progress value={100} className="h-2 animate-pulse" />
              <p className="text-sm text-amber-500 mt-2 flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                Taking longer than expected. The database might be busy or there might be a connection issue.
              </p>
              <Button 
                onClick={onRetry} 
                variant="outline" 
                size="sm"
                className="mt-2"
              >
                Cancel and try again
              </Button>
            </div>
          )}
        </AlertDescription>
      </Alert>
    );
  }
  
  if (status === 'connected') {
    return (
      <Alert className="mb-4 border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <AlertTitle>Database Connected</AlertTitle>
        <AlertDescription>Successfully connected to Supabase database.</AlertDescription>
      </Alert>
    );
  }

  if (status === 'error') {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Database Connection Failed</AlertTitle>
        <AlertDescription>
          <p>Unable to connect to the database. This will prevent loading or generating reports.</p>
          {error && <p className="mt-2 text-sm font-medium">{error}</p>}
          <Button 
            onClick={onRetry} 
            variant="outline" 
            size="sm"
            className="mt-4"
          >
            Retry Connection
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default DatabaseConnectionStatus;
