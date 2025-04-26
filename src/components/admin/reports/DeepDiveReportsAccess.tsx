
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from 'sonner';
import ReportGenerationPanel from './ReportGenerationPanel';
import ReportsTable from './ReportsTable';
import EmptyReportsState from './EmptyReportsState';
import { useReportGeneration } from './useReportGeneration';

const DeepDiveReportsAccess = () => {
  const { 
    generateReport, 
    deleteReport, 
    isGenerating, 
    isDeleting, 
    lastGeneratedUrl, 
    setLastGeneratedUrl 
  } = useReportGeneration();

  const { data: reports, isLoading, error, refetch } = useQuery({
    queryKey: ['deep-dive-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('report_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const formatArchetypeLabel = (id: string) => {
    const formattedId = id.toLowerCase();
    const fullName = getArchetypeName(formattedId);
    return `${formattedId} ${fullName}`;
  };

  const getArchetypeName = (id: string) => {
    const names: Record<string, string> = {
      'a1': 'Proactive Planners',
      'a2': 'Complex Condition Managers',
      'a3': 'Wellness Champions',
      'b1': 'Resourceful Adapters',
      'b2': 'Cost-Conscious Caregivers',
      'b3': 'Prevention Partners',
      'c1': 'Traditional Consumers',
      'c2': 'Reactive Responders',
      'c3': 'Healthcare Avoiders'
    };
    return names[id.toLowerCase()] || 'Unknown Archetype';
  };

  const handleGenerateReport = async (archetypeId: string) => {
    await generateReport(archetypeId);
    refetch();
  };

  const handleDeleteReport = async (reportId: string) => {
    await deleteReport(reportId);
    refetch();
  };

  const copyReportLink = async (archetypeId: string, token: string) => {
    const url = `${window.location.origin}/report/${archetypeId}/${token}`;
    await navigator.clipboard.writeText(url);
    toast.success('Report link copied to clipboard');
  };

  const openReportInNewTab = (archetypeId: string, token: string) => {
    const url = `${window.location.origin}/report/${archetypeId}/${token}`;
    window.open(url, '_blank');
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error loading reports</AlertTitle>
        <AlertDescription>
          There was a problem loading the report data. Please try refreshing the page.
          {error instanceof Error && (
            <div className="mt-2 text-sm">
              Error details: {error.message}
            </div>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Deep Dive Reports Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lastGeneratedUrl && (
              <Alert className="mb-4 bg-green-50 border-green-200">
                <AlertTitle className="flex items-center gap-2">
                  <span>Report Generated Successfully</span>
                </AlertTitle>
                <AlertDescription className="mt-2">
                  <div className="text-sm mb-2">Your report link:</div>
                  <div className="bg-white p-2 rounded border flex justify-between items-center">
                    <div className="text-sm truncate">{lastGeneratedUrl}</div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(lastGeneratedUrl)}
                      >
                        <Copy className="h-4 w-4 mr-1" /> Copy
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(lastGeneratedUrl, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" /> Open
                      </Button>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <ReportGenerationPanel
              isGenerating={isGenerating}
              onGenerateReport={handleGenerateReport}
              formatArchetypeLabel={formatArchetypeLabel}
            />

            <h3 className="text-lg font-medium mt-6">Existing reports</h3>
            {reports && reports.length > 0 ? (
              <ReportsTable
                reports={reports}
                isDeleting={isDeleting}
                formatArchetypeLabel={formatArchetypeLabel}
                onCopyLink={copyReportLink}
                onOpenReport={openReportInNewTab}
                onDeleteReport={handleDeleteReport}
              />
            ) : (
              <EmptyReportsState />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeepDiveReportsAccess;
