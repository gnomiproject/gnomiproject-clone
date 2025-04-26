
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DatabaseIcon, Copy, RefreshCw, Calendar } from "lucide-react";
import { toast } from 'sonner';
import { format } from 'date-fns';

const DeepDiveReportsAccess = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: reports, isLoading, refetch } = useQuery({
    queryKey: ['deep-dive-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deep_dive_reports')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const generateReport = async (archetypeId: string) => {
    try {
      setIsGenerating(true);
      const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
      
      // Insert as a single object, not an array
      const { data, error } = await supabase
        .from('deep_dive_reports')
        .insert({
          archetype_id: archetypeId,
          access_token: crypto.randomUUID(),
          status: 'active',
          expires_at: expiryDate.toISOString() // Convert Date to ISO string
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Report generated successfully');
      refetch();
      
      // Copy link to clipboard
      const reportUrl = `${window.location.origin}/report/${archetypeId}/${data.access_token}`;
      await navigator.clipboard.writeText(reportUrl);
      toast.success('Report link copied to clipboard');
      
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setIsGenerating(false);
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

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
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
            <div className="flex gap-2">
              {['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3'].map((id) => (
                <Button
                  key={id}
                  variant="outline"
                  size="sm"
                  onClick={() => generateReport(id)}
                  disabled={isGenerating}
                >
                  {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : id.toUpperCase()}
                </Button>
              ))}
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Archetype</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports?.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.archetype_id.toUpperCase()}</TableCell>
                    <TableCell>
                      <Badge variant={report.status === 'active' ? 'default' : 'secondary'}>
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(report.created_at), 'MMM d, yyyy')}</TableCell>
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
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyReportLink(report.archetype_id, report.access_token)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeepDiveReportsAccess;
