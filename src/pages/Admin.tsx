import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import useReportGeneration from '@/hooks/useReportGeneration';
import ReportGenerator from '@/components/admin/ReportGenerator';
import InsightsReportGenerator from '@/components/admin/InsightsReportGenerator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, BarChart, FileSearch } from 'lucide-react';
import DeepDiveReportsAccess from '@/components/admin/reports/DeepDiveReportsAccess';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Admin = () => {
  const [activeTab, setActiveTab] = useState("database");
  
  // Use React Query to check database connection only once when component mounts
  // This prevents multiple repeated connection checks across child components
  const { data: dbConnectionStatus } = useQuery({
    queryKey: ['database-connection-status'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('Core_Archetype_Overview')
          .select('count(*)', { count: 'exact', head: true });
          
        if (error) throw error;
        return { connected: true, count: data };
      } catch (error) {
        console.error("Database connection check failed:", error);
        return { connected: false, error };
      }
    },
    // Keep this data fresh for a long time to avoid repeated checks
    staleTime: 1000 * 60 * 30, // 30 minutes
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // When tab changes, prefetch data for that tab to improve perceived performance
  useEffect(() => {
    // Only attempt prefetching if we have a valid connection
    if (dbConnectionStatus?.connected && activeTab) {
      let prefetchKey;
      
      switch(activeTab) {
        case "insights":
          prefetchKey = ['archetypes-list'];
          break;
        case "deepDive":
          prefetchKey = ['deep-dive-reports'];
          break;
        default:
          // No prefetch needed for database tab
          return;
      }
      
      // If we have a key to prefetch, do it
      if (prefetchKey) {
        queryClient.prefetchQuery({ queryKey: prefetchKey });
      }
    }
  }, [activeTab, dbConnectionStatus]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <Tabs defaultValue="database" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            <span>Database Tools</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <BarChart className="w-4 h-4" />
            <span>Public Insights Reports</span>
          </TabsTrigger>
          <TabsTrigger value="deepDive" className="flex items-center gap-2">
            <FileSearch className="w-4 h-4" />
            <span>Private Deep Dive Reports</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Pass down the connection status so child components don't need to check again */}
        <TabsContent value="database" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Database Management Tools</h2>
            <p className="text-gray-600 mb-6">
              Use these tools to refresh database content, check connections, and manage data.
            </p>
            <ReportGenerator initialConnectionStatus={dbConnectionStatus?.connected} />
          </Card>
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Public Insights Reports Management</h2>
            <p className="text-gray-600 mb-6">
              These reports are publicly accessible without tokens at /insights/report/[archetypeId]
            </p>
            <InsightsReportGenerator initialConnectionStatus={dbConnectionStatus?.connected} />
          </Card>
        </TabsContent>

        <TabsContent value="deepDive" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Private Deep Dive Reports</h2>
            <p className="text-gray-600 mb-6">
              These reports require secure access tokens and are shared via /report/[archetypeId]/[token]
            </p>
            <DeepDiveReportsAccess initialConnectionStatus={dbConnectionStatus?.connected} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
