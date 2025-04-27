
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Info, RefreshCw } from "lucide-react";
import { toast } from 'sonner';
import ReportGenerationPanel from './ReportGenerationPanel';
import ReportsTable from './ReportsTable';
import EmptyReportsState from './EmptyReportsState';
import useReportGeneration from '@/hooks/useReportGeneration';
import DatabaseConnectionStatus from '../insights/DatabaseConnectionStatus';

interface DeepDiveReportsAccessProps {
  initialConnectionStatus?: boolean;
}

const DeepDiveReportsAccess = ({ initialConnectionStatus }: DeepDiveReportsAccessProps) => {
  const { 
    generateReport, 
    deleteReport, 
    isGenerating, 
    isDeleting, 
    lastGeneratedUrl, 
    setLastGeneratedUrl,
    generationInProgress 
  } = useReportGeneration();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Use the connection status from the parent with a fallback to "unchecked"
  const [connectionStatus, setConnectionStatus] = useState<'unchecked' | 'checking' | 'connected' | 'error'>(
    initialConnectionStatus === true ? 'connected' : 
    initialConnectionStatus === false ? 'error' : 
    'unchecked'
  );
  const [error, setError] = useState<string | null>(null);
  const [timeoutWarning, setTimeoutWarning] = useState(false);

  // Use React Query to fetch reports list efficiently
  const { data: reports, isLoading, error: fetchError, refetch } = useQuery({
    queryKey: ['deep-dive-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('report_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    // Only run if we have a valid connection
    enabled: connectionStatus === 'connected',
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false, // Prevent automatic refetch on window focus
  });

  // If there's an error from the query, display it
  useEffect(() => {
    if (fetchError) {
      setError((fetchError as Error).message);
    }
  }, [fetchError]);

  // Check connection if needed
  const checkDatabaseConnection = async () => {
    try {
      setConnectionStatus('checking');
      setTimeoutWarning(false);
      setError(null);
      
      const { data, error: connError } = await supabase
        .from('report_requests')
        .select('count(*)', { count: 'exact', head: true });
      
      if (connError) {
        console.error("Database connection error:", connError);
        setConnectionStatus('error');
        setError(`Database connection error: ${connError.message}`);
        toast.error("Database Connection Failed", {
          description: connError.message,
        });
        return false;
      }
      
      setConnectionStatus('connected');
      toast.success("Database Connection Successful");
      // Fetch reports list now
      await refetch();
      return true;
    } catch (err) {
      console.error("Error testing database:", err);
      setConnectionStatus('error');
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Connection error: ${errorMessage}`);
      toast.error("Connection Error", {
        description: errorMessage,
      });
      return false;
    }
  };

  // If we have initialConnectionStatus, fetch reports when component mounts
  useEffect(() => {
    if (connectionStatus === 'connected') {
      refetch();
    }
  }, [connectionStatus]);

  // Add timeout warning after 5 seconds if still checking
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (connectionStatus === 'checking') {
      timeoutId = setTimeout(() => {
        setTimeoutWarning(true);
      }, 5000); // 5 seconds
    } else {
      setTimeoutWarning(false);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [connectionStatus]);

  const refreshReportsList = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast.success("Reports list refreshed");
    } catch (error) {
      toast.error("Failed to refresh reports list");
      console.error("Error refreshing reports:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatArchetypeLabel = (id: string) => {
    const formattedId = id.toLowerCase();
    const fullName = getArchetypeName(formattedId);
    return `${formattedId} ${fullName}`;
  };

  const getArchetypeName = (id: string) => {
    const names: Record<string, string> = {
      'a1': 'Proactive Planners',
      'a2': 'Complex Condition Managers',
      'a3': 'Wellness Champions',
      'b1': 'Resourceful Adapters',
      'b2': 'Cost-Conscious Caregivers',
      'b3': 'Prevention Partners',
      'c1': 'Traditional Consumers',
      'c2': 'Reactive Responders',
      'c3': 'Healthcare Avoiders'
    };
    return names[id.toLowerCase()] || 'Unknown Archetype';
  };

  const handleGenerateReport = async (archetypeId: string) => {
    try {
      const reportUrl = await generateReport(archetypeId);
      console.log("Generated report with URL:", reportUrl);
      await refreshReportsList();
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report");
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    try {
      await deleteReport(reportId);
      toast.success("Report deleted successfully");
      await refreshReportsList();
    } catch (error) {
      console.error("Error deleting report:", error);
      toast.error("Failed to delete report");
    }
  };

  const copyReportLink = async (archetypeId: string, token: string) => {
    const url = `${window.location.origin}/report/${archetypeId}/${token}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Report link copied to clipboard');
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast.error("Failed to copy to clipboard");
    }
  };

  const openReportInNewTab = (archetypeId: string, token: string) => {
    const url = `${window.location.origin}/report/${archetypeId}/${token}`;
    window.open(url, '_blank');
  };

  // Loading state only if we're explicitly checking connection
  if (connectionStatus === 'checking') {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {connectionStatus !== 'connected' && (
        <DatabaseConnectionStatus 
          status={connectionStatus}
          error={error || undefined}
          onRetry={checkDatabaseConnection}
          timeoutWarning={timeoutWarning}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Deep Dive Reports Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>About Deep Dive Reports</AlertTitle>
            <AlertDescription>
              <p>Unlike Insights Reports which are publicly accessible, Deep Dive Reports require secure access tokens.</p>
              <p className="mt-2">These tokens provide controlled access to detailed reports for specific users or clients.</p>
              <p className="mt-2"><strong>Note:</strong> For public insights reports without tokens, use the Insights Reports tab.</p>
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            {lastGeneratedUrl && (
              <Alert className="mb-4 bg-green-50 border-green-200">
                <AlertTitle className="flex items-center gap-2">
                  <span>Report Generated Successfully</span>
                </AlertTitle>
                <AlertDescription className="mt-2">
                  <div className="text-sm mb-2">Your report link:</div>
                  <div className="bg-white p-2 rounded border flex justify-between items-center">
                    <div className="text-sm truncate">{lastGeneratedUrl}</div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(lastGeneratedUrl)}
                      >
                        <Copy className="h-4 w-4 mr-1" /> Copy
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(lastGeneratedUrl, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" /> Open
                      </Button>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {connectionStatus === 'connected' && (
              <>
                <ReportGenerationPanel
                  isGenerating={isGenerating}
                  onGenerateReport={handleGenerateReport}
                  formatArchetypeLabel={formatArchetypeLabel}
                  generationInProgress={generationInProgress}
                />

                <div className="flex justify-between items-center mt-6 mb-4">
                  <h3 className="text-lg font-medium">Existing reports</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={refreshReportsList} 
                    disabled={isRefreshing}
                  >
                    <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh List
                  </Button>
                </div>
                
                {reports && reports.length > 0 ? (
                  <ReportsTable
                    reports={reports}
                    isDeleting={isDeleting}
                    formatArchetypeLabel={formatArchetypeLabel}
                    onCopyLink={copyReportLink}
                    onOpenReport={openReportInNewTab}
                    onDeleteReport={handleDeleteReport}
                  />
                ) : (
                  <EmptyReportsState />
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeepDiveReportsAccess;
