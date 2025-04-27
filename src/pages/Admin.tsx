
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import useReportGeneration from '@/hooks/useReportGeneration';
import ReportGenerator from '@/components/admin/ReportGenerator';
import InsightsReportGenerator from '@/components/admin/InsightsReportGenerator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, BarChart, FileSearch } from 'lucide-react';
import DeepDiveReportsAccess from '@/components/admin/reports/DeepDiveReportsAccess';

const Admin = () => {
  const { toast } = useToast();
  const { generateAllReports, isGenerating } = useReportGeneration();
  const [activeTab, setActiveTab] = useState("database");

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
            <span>Insights Reports</span>
          </TabsTrigger>
          <TabsTrigger value="deepDive" className="flex items-center gap-2">
            <FileSearch className="w-4 h-4" />
            <span>Deep Dive Reports</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="database" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Database Management Tools</h2>
            <p className="text-gray-600 mb-6">
              Use these tools to refresh database content, check connections, and manage data.
            </p>
            <ReportGenerator />
          </Card>
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Insights Reports Management</h2>
            <InsightsReportGenerator />
          </Card>
        </TabsContent>

        <TabsContent value="deepDive" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Deep Dive Reports Access</h2>
            <DeepDiveReportsAccess />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
