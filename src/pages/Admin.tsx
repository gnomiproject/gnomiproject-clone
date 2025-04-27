
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, FileSearch } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const Admin = () => {
  const [activeTab, setActiveTab] = useState("insights");
  
  // Simple connection status check once when component mounts
  const { data: dbConnectionStatus, isLoading: isCheckingConnection } = useQuery({
    queryKey: ['database-connection-status'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('Core_Archetype_Overview')
          .select('count(*)', { count: 'exact', head: true });
          
        if (error) throw error;
        return { connected: true };
      } catch (error) {
        console.error("Database connection check failed:", error);
        return { connected: false, error };
      }
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    gcTime: 1000 * 60 * 60, // Keep in cache for 1 hour
  });

  // Handle open report in new tab
  const openReport = (archetypeId, reportType) => {
    let url = '';
    
    if (reportType === 'insights') {
      url = `/insights/report/${archetypeId}`;
    } else {
      // For deep dive reports, use a special admin view that doesn't require tokens
      url = `/report/${archetypeId}/admin-view`;
    }
    
    window.open(url, '_blank');
    toast.success(`Opening ${reportType} report for ${archetypeId}`);
  };

  // Define archetypes
  const archetypes = [
    { id: 'a1', name: 'Archetype A1', family: 'a' },
    { id: 'a2', name: 'Archetype A2', family: 'a' },
    { id: 'a3', name: 'Archetype A3', family: 'a' },
    { id: 'b1', name: 'Archetype B1', family: 'b' },
    { id: 'b2', name: 'Archetype B2', family: 'b' },
    { id: 'b3', name: 'Archetype B3', family: 'b' },
    { id: 'c1', name: 'Archetype C1', family: 'c' },
    { id: 'c2', name: 'Archetype C2', family: 'c' },
    { id: 'c3', name: 'Archetype C3', family: 'c' },
  ];

  // Group archetypes by family
  const archetypeFamilies = {
    'a': archetypes.filter(a => a.family === 'a'),
    'b': archetypes.filter(a => a.family === 'b'),
    'c': archetypes.filter(a => a.family === 'c'),
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* Connection Status */}
      {isCheckingConnection && (
        <Card className="p-4 mb-6 bg-slate-50">
          <p className="text-gray-600 flex items-center">
            <span className="inline-block w-4 h-4 mr-2 bg-slate-300 rounded-full animate-pulse"></span>
            Checking database connection...
          </p>
        </Card>
      )}
      
      {dbConnectionStatus && !dbConnectionStatus.connected && (
        <Card className="p-4 mb-6 bg-red-50 border-red-200">
          <p className="text-red-600 font-medium">
            Database connection error. Some features may not work properly.
          </p>
        </Card>
      )}
      
      <Tabs defaultValue="insights" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <BarChart className="w-4 h-4" />
            <span>Insights Reports</span>
          </TabsTrigger>
          <TabsTrigger value="deepDive" className="flex items-center gap-2">
            <FileSearch className="w-4 h-4" />
            <span>Deep Dive Reports</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="insights" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Insights Reports</h2>
            <p className="text-gray-600 mb-6">
              Click on an archetype to open its Insights Report in a new tab. These reports are publicly accessible.
            </p>
            
            {Object.entries(archetypeFamilies).map(([familyId, archetypesList]) => (
              <div key={familyId} className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  Family {familyId.toUpperCase()}
                  <Badge variant="outline" className={`bg-family-${familyId} text-white`}>
                    {archetypesList.length} Archetypes
                  </Badge>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {archetypesList.map((archetype) => (
                    <Button 
                      key={archetype.id}
                      variant="outline" 
                      className={`h-auto py-6 border border-gray-200 hover:border-gray-300 hover:bg-gray-50`}
                      onClick={() => openReport(archetype.id, 'insights')}
                    >
                      <div className="flex flex-col items-center w-full">
                        <div className={`w-16 h-16 rounded-full mb-3 flex items-center justify-center bg-archetype-${archetype.id}/10`}>
                          <span className={`text-2xl font-bold text-archetype-${archetype.id}`}>
                            {archetype.id.toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium">{archetype.name}</span>
                        <span className="text-xs text-gray-500 mt-1">Click to view report</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </Card>
        </TabsContent>
        
        <TabsContent value="deepDive" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Deep Dive Reports</h2>
            <p className="text-gray-600 mb-6">
              Click on an archetype to open its Deep Dive Report in a new tab. Admin view with placeholder user data.
            </p>
            
            {Object.entries(archetypeFamilies).map(([familyId, archetypesList]) => (
              <div key={familyId} className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  Family {familyId.toUpperCase()}
                  <Badge variant="outline" className={`bg-family-${familyId} text-white`}>
                    {archetypesList.length} Archetypes
                  </Badge>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {archetypesList.map((archetype) => (
                    <Button 
                      key={archetype.id}
                      variant="outline" 
                      className={`h-auto py-6 border border-gray-200 hover:border-gray-300 hover:bg-gray-50`}
                      onClick={() => openReport(archetype.id, 'deepDive')}
                    >
                      <div className="flex flex-col items-center w-full">
                        <div className={`w-16 h-16 rounded-full mb-3 flex items-center justify-center bg-archetype-${archetype.id}/10`}>
                          <span className={`text-2xl font-bold text-archetype-${archetype.id}`}>
                            {archetype.id.toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium">{archetype.name}</span>
                        <span className="text-xs text-gray-500 mt-1">Click to view detailed report</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
