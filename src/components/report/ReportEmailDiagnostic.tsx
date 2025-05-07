
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmailTestTool from './EmailTestTool';
import ReportDiagnosticTool from './ReportDiagnosticTool';
import { useParams } from 'react-router-dom';

interface ReportEmailDiagnosticProps {
  initialTab?: 'email-test' | 'report-diagnostic';
}

const ReportEmailDiagnostic: React.FC<ReportEmailDiagnosticProps> = ({ 
  initialTab = 'email-test' 
}) => {
  // Get any URL parameters that might be passed for the report diagnostic tool
  const { archetypeId, token } = useParams<{ archetypeId?: string, token?: string }>();
  
  // Choose initial tab - if URL has archetype ID and token, default to report-diagnostic
  const defaultTab = (archetypeId && token) ? 'report-diagnostic' : initialTab;

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Report System Diagnostics</h1>
      
      <Tabs defaultValue={defaultTab}>
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
