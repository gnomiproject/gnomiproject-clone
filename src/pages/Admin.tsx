
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import useReportGeneration from '@/hooks/useReportGeneration';
import ReportGenerator from '@/components/admin/ReportGenerator';

const Admin = () => {
  const { toast } = useToast();
  const { generateAllReports, isGenerating } = useReportGeneration();

  const handleGenerateReports = async () => {
    try {
      await generateAllReports();
      toast({
        title: "Reports Generated",
        description: "All archetype reports have been generated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate reports. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="space-y-8">
        <ReportGenerator />
        
        <Card>
          <CardHeader>
            <CardTitle>Report Generation</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleGenerateReports}
              disabled={isGenerating}
            >
              {isGenerating ? "Generating Reports..." : "Generate All Reports"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
