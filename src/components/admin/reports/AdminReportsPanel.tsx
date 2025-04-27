
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, FileSearch } from 'lucide-react';
import { ArchetypeInsightsList } from './ArchetypeInsightsList';
import { ArchetypeDeepDiveList } from './ArchetypeDeepDiveList';

const AdminReportsPanel = () => {
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
          <ArchetypeInsightsList />
        </TabsContent>
        
        <TabsContent value="deepdive">
          <ArchetypeDeepDiveList />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AdminReportsPanel;
