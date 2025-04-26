
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SectionTitle from '@/components/shared/SectionTitle';
import DatabaseSync from '@/components/admin/DatabaseSync';
import InsightsReportGenerator from '@/components/admin/InsightsReportGenerator';
import DeepDiveReportsAccess from '@/components/admin/DeepDiveReportsAccess';
import { Card } from '@/components/ui/card';

const Admin = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <SectionTitle 
        title="Admin Dashboard" 
        subtitle="Data management and report generation tools" 
        center
      />
      
      <div className="max-w-5xl mx-auto mt-8">
        <Tabs defaultValue="database" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="database">Database Sync</TabsTrigger>
            <TabsTrigger value="insights">Insights Reports</TabsTrigger>
            <TabsTrigger value="deepdive">Deep Dive Reports</TabsTrigger>
          </TabsList>
          
          <Card className="mt-4 p-6 border rounded-md">
            <TabsContent value="database" className="space-y-4">
              <DatabaseSync />
            </TabsContent>
            
            <TabsContent value="insights" className="space-y-4">
              <InsightsReportGenerator />
            </TabsContent>
            
            <TabsContent value="deepdive" className="space-y-4">
              <DeepDiveReportsAccess />
            </TabsContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
