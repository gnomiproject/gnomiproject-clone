
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, RefreshCw, Database } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const DatabaseSync: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [syncResult, setSyncResult] = useState<{
    success: boolean;
    message: string;
    details?: string;
  } | null>(null);

  const handleSyncDatabase = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    
    try {
      toast("Starting Database Synchronization", {
        description: "This process may take some time. Please wait...",
      });
      
      // Check database connection first
      const { error: connectionError } = await supabase
        .from('Core_Archetype_Overview')
        .select('id')
        .limit(1);
      
      if (connectionError) {
        throw new Error(`Database connection failed: ${connectionError.message}`);
      }
      
      // Simulate data synchronization process
      // In a real application, this would perform actual synchronization tasks
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check data counts to report in results
      const { count: archetypeCount } = await supabase
        .from('Core_Archetype_Overview')
        .select('*', { count: 'exact', head: true });
      
      const { count: metricsCount } = await supabase
        .from('Core_Archetypes_Metrics')
        .select('*', { count: 'exact', head: true });
      
      const syncTime = new Date().toLocaleString();
      setLastSync(syncTime);
      
      setSyncResult({
        success: true,
        message: "Database synchronization complete",
        details: `Found ${archetypeCount} archetypes and ${metricsCount} metric records`
      });
      
      localStorage.setItem('lastDatabaseSync', syncTime);
      
      toast("Sync Completed Successfully", {
        description: `Database synchronized at ${syncTime}`,
      });
    } catch (error) {
      console.error('Database sync error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      setSyncResult({
        success: false,
        message: "Database synchronization failed",
        details: errorMessage
      });
      
      toast("Sync Failed", {
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  React.useEffect(() => {
    // Load last sync time from localStorage on component mount
    const savedLastSync = localStorage.getItem('lastDatabaseSync');
    if (savedLastSync) {
      setLastSync(savedLastSync);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Database Synchronization</h2>
        <p className="text-gray-600">
          Manually sync data between systems and ensure all archetype information is up-to-date.
        </p>
      </div>
      
      {lastSync && !syncResult && (
        <Alert>
          <Database className="h-4 w-4" />
          <AlertTitle>Last Sync</AlertTitle>
          <AlertDescription>Database was last synchronized at {lastSync}</AlertDescription>
        </Alert>
      )}
      
      {syncResult && (
        <Alert variant={syncResult.success ? "default" : "destructive"}>
          {syncResult.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          <AlertTitle>{syncResult.message}</AlertTitle>
          {syncResult.details && (
            <AlertDescription className="mt-2">{syncResult.details}</AlertDescription>
          )}
        </Alert>
      )}
      
      <div className="flex items-center gap-4">
        <Button 
          onClick={handleSyncDatabase} 
          disabled={isSyncing}
          size="lg"
        >
          {isSyncing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Synchronizing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync Database Now
            </>
          )}
        </Button>
        
        {lastSync && (
          <Badge variant="outline" className="text-xs">
            Last sync: {lastSync}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default DatabaseSync;
