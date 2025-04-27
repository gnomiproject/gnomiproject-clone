
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, FileSearch, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ARCHETYPES } from '@/data/staticArchetypes';
import { toast } from 'sonner';

const AdminReportsPanel = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const openReport = (archetypeId: string, type: 'insights' | 'deepdive') => {
    const path = type === 'insights' ? `/insights/report/${archetypeId}` : `/report/${archetypeId}/admin-view`;
    window.open(path, '_blank');
  };

  const refreshAllCaches = () => {
    setIsRefreshing(true);
    
    try {
      // Clear localStorage cache if used
      localStorage.removeItem('archetype-report-cache');
      
      // This is a client-side only refresh
      // The actual API cache will be cleared when reports are viewed
      
      toast.success("Report cache cleared", {
        description: "Next time you view a report, fresh data will be loaded from the database."
      });
    } catch (error) {
      toast.error("Failed to clear cache", {
        description: "Please try again or contact support."
      });
      console.error("Error clearing cache:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Report Management</h2>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshAllCaches}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Clearing Cache...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Clear Report Cache
            </>
          )}
        </Button>
      </div>
      
      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span>Insights Reports</span>
          </TabsTrigger>
          <TabsTrigger value="deepdive" className="flex items-center gap-2">
            <FileSearch className="w-4 h-4" />
            <span>Deep Dive Reports</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="insights">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ARCHETYPES.map(archetype => (
              <Card key={archetype.id} className="p-4 hover:shadow-md transition-shadow">
                <h3 className="font-medium mb-2">{archetype.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{archetype.description}</p>
                <Button 
                  onClick={() => openReport(archetype.id, 'insights')}
                  variant="outline"
                  className="w-full"
                >
                  View Insights Report
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="deepdive">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ARCHETYPES.map(archetype => (
              <Card key={archetype.id} className="p-4 hover:shadow-md transition-shadow">
                <h3 className="font-medium mb-2">{archetype.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{archetype.description}</p>
                <Button 
                  onClick={() => openReport(archetype.id, 'deepdive')}
                  variant="outline"
                  className="w-full"
                >
                  View Deep Dive Report
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-md p-4 text-sm text-blue-800">
        <p className="font-medium">Performance Optimization</p>
        <p className="mt-1">Reports are now cached after first view for faster loading. Click "Clear Report Cache" to fetch fresh data.</p>
      </div>
    </Card>
  );
};

export default AdminReportsPanel;
