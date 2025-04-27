
import React from 'react';
import { format } from 'date-fns';
import { Copy, ExternalLink, RefreshCw, Trash2, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

interface Report {
  id: string;
  archetype_id: string;
  status: string;
  created_at: string;
  expires_at: string;
  access_token: string;
  name?: string;
  organization?: string;
}

interface ReportsTableProps {
  reports: Report[];
  isDeleting: boolean;
  formatArchetypeLabel: (id: string) => string;
  onCopyLink: (archetypeId: string, token: string) => void;
  onOpenReport: (archetypeId: string, token: string) => void;
  onDeleteReport: (id: string) => void;
}

const ReportsTable = ({
  reports,
  isDeleting,
  formatArchetypeLabel,
  onCopyLink,
  onOpenReport,
  onDeleteReport,
}: ReportsTableProps) => {
  const isCurrentlyDeleting = (reportId: string): boolean => {
    return isDeleting; // In a real implementation, you might track which report is being deleted
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
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
              {report.archetype_id.toUpperCase()}
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span>{formatArchetypeLabel(report.archetype_id)}</span>
                {(report.name || report.organization) && (
                  <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <Tag className="h-3 w-3" />
                    {report.name || ''} {report.organization ? `(${report.organization})` : ''}
                  </span>
                )}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={report.status === 'active' ? 'default' : 'secondary'}>
                {report.status}
              </Badge>
            </TableCell>
            <TableCell>
              {report.created_at ? (
                <div className="flex flex-col">
                  <span>{format(new Date(report.created_at), 'MMM d, yyyy')}</span>
                  <span className="text-xs text-gray-500">{format(new Date(report.created_at), 'h:mm a')}</span>
                </div>
              ) : 'N/A'}
            </TableCell>
            <TableCell>
              {report.expires_at ? (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div className="flex flex-col">
                    <span>{format(new Date(report.expires_at), 'MMM d, yyyy')}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(report.expires_at) < new Date() 
                        ? 'Expired' 
                        : `Expires in ${Math.ceil((new Date(report.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`}
                    </span>
                  </div>
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
                  onClick={() => onCopyLink(report.archetype_id, report.access_token)}
                  title="Copy link"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenReport(report.archetype_id, report.access_token)}
                  title="Open report"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteReport(report.id)}
                  disabled={isCurrentlyDeleting(report.id)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete report"
                >
                  {isCurrentlyDeleting(report.id) ? (
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
  );
};

export default ReportsTable;
