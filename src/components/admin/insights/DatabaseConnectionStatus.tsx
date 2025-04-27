
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle, Loader2, AlertTriangle } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface DatabaseConnectionStatusProps {
  status: 'unchecked' | 'checking' | 'connected' | 'error';
  error?: string;
  onRetry?: () => void;
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
          <AlertTitle>Checking Database Connection</AlertTitle>
        </div>
        <AlertDescription className="mt-2">
          <p>Attempting to connect to Supabase database...</p>
          {timeoutWarning && (
            <div className="mt-3">
              <Progress value={100} className="h-2 animate-pulse" />
              <p className="text-sm text-amber-500 mt-2 flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                Taking longer than expected. The database might be busy or there might be a connection issue.
              </p>
              {onRetry && (
                <Button 
                  onClick={onRetry} 
                  variant="outline" 
                  size="sm"
                  className="mt-2"
                >
                  Cancel and try again
                </Button>
              )}
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

  return (
    <Alert className="mb-4 bg-blue-50 border-blue-200">
      <AlertTitle>Database Connection</AlertTitle>
      <AlertDescription className="flex justify-between items-center">
        <span>Check database connection status before generating reports.</span>
        {onRetry && (
          <Button 
            onClick={onRetry} 
            variant="outline" 
            size="sm"
          >
            Check Connection
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default DatabaseConnectionStatus;
