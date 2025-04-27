
import React from 'react';
import { format } from 'date-fns';
import { Copy, ExternalLink, RefreshCw, Trash2, Calendar } from "lucide-react";
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
  return (
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
              {formatArchetypeLabel(report.archetype_id)}
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
                  disabled={isDeleting}
                  className="text-red-500 hover:text-red-700"
                  title="Delete report"
                >
                  {isDeleting ? (
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
