
import React from 'react';
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
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Insights Reports</h2>
              <SimpleReportLinks reportType="insights" />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Deep Dive Reports</h2>
              <SimpleReportLinks reportType="deepdive" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-sm text-gray-500 mt-4 p-4 bg-gray-50 rounded-lg">
        <p><strong>Note:</strong> Reports will open in a new tab to prevent browser resource limitations.</p>
        <p className="mt-2">If you encounter any issues with report loading, try clearing your browser cache or using a different browser.</p>
      </div>
    </div>
  );
};

export default Admin;
