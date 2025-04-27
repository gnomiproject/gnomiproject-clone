
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, FileSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ARCHETYPES } from '@/data/staticArchetypes';

const AdminReportsPanel = () => {
  const openReport = (archetypeId: string, type: 'insights' | 'deepdive') => {
    const path = type === 'insights' ? `/insights/report/${archetypeId}` : `/report/${archetypeId}/admin-view`;
    window.open(path, '_blank');
  };

  return (
    <Card className="p-6">
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
    </Card>
  );
};

export default AdminReportsPanel;
