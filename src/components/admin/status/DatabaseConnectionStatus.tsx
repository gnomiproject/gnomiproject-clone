
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle } from "lucide-react";

interface DatabaseConnectionStatusProps {
  status: 'unchecked' | 'checking' | 'connected' | 'error';
}

const DatabaseConnectionStatus = ({ status }: DatabaseConnectionStatusProps) => {
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
        <AlertDescription>Failed to connect to the database. Please check your connection and try again.</AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default DatabaseConnectionStatus;
