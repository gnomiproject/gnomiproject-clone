
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DatabaseIcon, Copy, RefreshCw, Calendar, Trash2, ExternalLink } from "lucide-react";
import { toast } from 'sonner';
import { format } from 'date-fns';

const DeepDiveReportsAccess = () => {
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [lastGeneratedUrl, setLastGeneratedUrl] = useState<string | null>(null);

  const { data: reports, isLoading, error, refetch } = useQuery({
    queryKey: ['deep-dive-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('report_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching reports:', error);
        throw error;
      }
      
      return data || [];
    }
  });

  const generateReport = async (archetypeId: string) => {
    try {
      setIsGenerating(archetypeId);
      const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
      
      // Generate a unique access token
      const accessToken = crypto.randomUUID();
      
      // Insert into report_requests table
      const { data, error } = await supabase
        .from('report_requests')
        .insert({
          archetype_id: archetypeId,
          access_token: accessToken,
          status: 'active',
          expires_at: expiryDate.toISOString(),
          name: 'Admin Generated',
          organization: 'Admin Access',
          email: 'admin@example.com',
          created_at: new Date().toISOString(),
          id: crypto.randomUUID()
        })
        .select();

      if (error) {
        console.error('Error generating report:', error);
        throw error;
      }

      // Generate the report URL
      const reportUrl = `${window.location.origin}/report/${archetypeId}/${accessToken}`;
      setLastGeneratedUrl(reportUrl);
      
      await navigator.clipboard.writeText(reportUrl);
      toast.success('Report generated and link copied to clipboard');
      
      refetch();
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report: ' + (error as Error).message);
    } finally {
      setIsGenerating(null);
    }
  };

  const deleteReport = async (reportId: string) => {
    try {
      setIsDeleting(reportId);
      const { error } = await supabase
        .from('report_requests')
        .delete()
        .eq('id', reportId);

      if (error) throw error;

      toast.success('Report deleted successfully');
      refetch();
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error('Failed to delete report: ' + (error as Error).message);
    } finally {
      setIsDeleting(null);
    }
  };

  const copyReportLink = async (archetypeId: string, token: string) => {
    try {
      const url = `${window.location.origin}/report/${archetypeId}/${token}`;
      await navigator.clipboard.writeText(url);
      toast.success('Report link copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy link');
    }
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
                        onClick={() => navigator.clipboard.writeText(lastGeneratedUrl || '')}
                      >
                        <Copy className="h-4 w-4 mr-1" /> Copy
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(lastGeneratedUrl || '', '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" /> Open
                      </Button>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <h3 className="text-lg font-medium">Generate new report</h3>
            <div className="flex flex-wrap gap-2">
              {['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3'].map((id) => (
                <Button
                  key={id}
                  variant="outline"
                  size="sm"
                  onClick={() => generateReport(id)}
                  disabled={isGenerating !== null}
                  className={isGenerating === id ? "animate-pulse" : ""}
                >
                  {isGenerating === id ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-1" /> 
                  ) : (
                    id.toUpperCase()
                  )}
                </Button>
              ))}
            </div>

            <h3 className="text-lg font-medium mt-6">Existing reports</h3>
            {reports && reports.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Archetype</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">
                        {report.archetype_id?.toUpperCase()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={report.status === 'active' ? 'default' : 'secondary'}>
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {report.created_at ? format(new Date(report.created_at), 'MMM d, yyyy') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {report.expires_at ? (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(report.expires_at), 'MMM d, yyyy')}
                          </div>
                        ) : (
                          'Never'
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyReportLink(report.archetype_id, report.access_token)}
                            title="Copy link"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openReportInNewTab(report.archetype_id, report.access_token)}
                            title="Open report"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteReport(report.id)}
                            disabled={isDeleting === report.id}
                            className="text-red-500 hover:text-red-700"
                            title="Delete report"
                          >
                            {isDeleting === report.id ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-md">
                <DatabaseIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-gray-900">No reports generated yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Generate a report for any archetype by clicking one of the buttons above.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeepDiveReportsAccess;
