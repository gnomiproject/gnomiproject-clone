
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SectionTitle from '@/components/shared/SectionTitle';
import DataMigrationTool from '@/components/admin/DataMigrationTool';
import ReportGenerator from '@/components/admin/ReportGenerator';

const Admin = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-8 px-4 md:px-8">
      <div className="container max-w-6xl mx-auto">
        <SectionTitle 
          title="Admin Dashboard" 
          subtitle="Manage data and application settings"
        />
        
        <Tabs defaultValue="data" className="mt-8">
          <TabsList className="mb-6">
            <TabsTrigger value="data">Data Management</TabsTrigger>
            <TabsTrigger value="reports">Report Generation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="data">
            <DataMigrationTool />
          </TabsContent>
          
          <TabsContent value="reports">
            <ReportGenerator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
