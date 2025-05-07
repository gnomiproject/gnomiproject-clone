
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmailTestTool from './EmailTestTool';
import ReportDiagnosticTool from './ReportDiagnosticTool';

interface ReportEmailDiagnosticProps {
  initialTab?: 'email-test' | 'report-diagnostic';
}

const ReportEmailDiagnostic: React.FC<ReportEmailDiagnosticProps> = ({ 
  initialTab = 'email-test' 
}) => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Report System Diagnostics</h1>
      
      <Tabs defaultValue={initialTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="email-test">Email Testing</TabsTrigger>
          <TabsTrigger value="report-diagnostic">Report Diagnostic</TabsTrigger>
        </TabsList>
        
        <TabsContent value="email-test">
          <EmailTestTool />
        </TabsContent>
        
        <TabsContent value="report-diagnostic">
          <ReportDiagnosticTool />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportEmailDiagnostic;
