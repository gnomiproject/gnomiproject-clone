
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertTriangle, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DatabaseConnectionStatusProps {
  connectionStatus: 'checking' | 'connected' | 'error' | null;
  error: string | null;
  onCheckConnection: () => void;
}

const DatabaseConnectionStatus = ({ 
  connectionStatus, 
  error,
  onCheckConnection 
}: DatabaseConnectionStatusProps) => {
  return (
    <>
      {connectionStatus === 'checking' && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertTitle>Testing Database Connection</AlertTitle>
          <AlertDescription>Checking connection to Supabase database...</AlertDescription>
        </Alert>
      )}
      
      {connectionStatus === 'error' && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Database Connection Failed</AlertTitle>
          <AlertDescription>
            <p>Unable to connect to the database. This will prevent loading or generating reports.</p>
            {error && <p className="mt-2 text-sm">{error}</p>}
          </AlertDescription>
        </Alert>
      )}
      
      {connectionStatus === 'connected' && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Database Connected</AlertTitle>
          <AlertDescription>Successfully connected to Supabase database.</AlertDescription>
        </Alert>
      )}
      
      <Button 
        onClick={onCheckConnection}
        variant="outline"
        disabled={connectionStatus === 'checking'}
        size="lg"
      >
        {connectionStatus === 'checking' ? (
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
    </>
  );
};

export default DatabaseConnectionStatus;

