
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SimpleReportLinks from '@/components/admin/reports/SimpleReportLinks';

const Admin = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Reports Access</CardTitle>
          <CardDescription>
            View insights and deep dive reports for all archetypes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="insights" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="insights">Insights Reports</TabsTrigger>
              <TabsTrigger value="deepdive">Deep Dive Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="insights">
              <SimpleReportLinks reportType="insights" />
            </TabsContent>
            
            <TabsContent value="deepdive">
              <SimpleReportLinks reportType="deepdive" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
