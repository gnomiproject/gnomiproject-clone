
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Eye, ExternalLink, Copy, CalendarIcon, FileText } from "lucide-react";
import { Link } from 'react-router-dom';

export interface Archetype {
  id: string;
  code: string;
  name: string;
  status: 'pending' | 'success' | 'error';
  lastUpdated: string | null;
}

interface ArchetypeListProps {
  archetypes: Archetype[];
  isLoading: boolean;
  error: string | null;
  onViewReport: (archetypeId: string) => void;
  onCopyReportUrl: (archetypeId: string) => void;
}

const ArchetypeList = ({
  archetypes,
  isLoading,
  error,
  onViewReport,
  onCopyReportUrl
}: ArchetypeListProps) => {
  const getInsightsReportUrl = (archetypeId: string): string => {
    return `/insights/report/${archetypeId}`;
  };

  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={5} className="text-center py-4">
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading archetypes...
          </div>
        </TableCell>
      </TableRow>
    );
  }

  if (error || archetypes.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={5} className="text-center py-4">
          {error === 'No archetypes found in the database' ? 
            'No archetypes found in database. Make sure Core_Archetype_Overview table exists and contains data.' :
            'No archetypes found'}
        </TableCell>
      </TableRow>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>Archetype</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {archetypes.map((archetype) => (
          <TableRow key={archetype.id}>
            <TableCell>
              <span className="font-medium">{archetype.code}</span>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <FileText size={16} />
                <span title={archetype.id}>{archetype.name}</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={
                archetype.status === 'success' ? "success" : 
                archetype.status === 'error' ? "destructive" : 
                "outline"
              }>
                {archetype.status === 'success' ? 'Generated' : 
                 archetype.status === 'error' ? 'Failed' : 
                 'Pending'}
              </Badge>
            </TableCell>
            <TableCell>
              {archetype.lastUpdated ? (
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3 text-gray-400" />
                  <span>{archetype.lastUpdated}</span>
                </div>
              ) : 'Never'}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewReport(archetype.id)}
                  disabled={archetype.status !== 'success'}
                  title={archetype.status !== 'success' ? 'No report available' : 'View JSON data'}
                  className="h-8 w-8 p-0"
                >
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View Report Data</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  disabled={archetype.status !== 'success'}
                  title="View insights report page"
                  className="h-8 w-8 p-0"
                >
                  <Link to={getInsightsReportUrl(archetype.id)} target="_blank">
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">View Insights Report</span>
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCopyReportUrl(archetype.id)}
                  disabled={archetype.status !== 'success'}
                  title="Copy insights report URL to clipboard"
                  className="h-8 w-8 p-0"
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy Report URL</span>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ArchetypeList;

