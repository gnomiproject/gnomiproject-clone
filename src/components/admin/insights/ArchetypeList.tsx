
import React from 'react';
import { Button } from "@/components/ui/button";
import { Eye, ClipboardCopy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ArchetypeListItem } from '@/hooks/useArchetypeLoader';
import { Skeleton } from '@/components/ui/skeleton';

interface ArchetypeListProps {
  archetypes: ArchetypeListItem[];
  isLoading: boolean;
  error: string | null;
  onViewReport: (archetypeId: string) => void;
  onCopyReportUrl: (archetypeId: string) => void;
}

const ArchetypeList: React.FC<ArchetypeListProps> = ({ 
  archetypes, 
  isLoading, 
  error,
  onViewReport,
  onCopyReportUrl 
}) => {
  if (isLoading) {
    return (
      <div className="p-4">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-2 border-b last:border-0">
              <div className="flex-1">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="flex space-x-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        <p>Error loading archetypes: {error}</p>
      </div>
    );
  }

  if (!archetypes || archetypes.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No archetypes found in the database.</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Generated</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Processing</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Failed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Not Generated</Badge>;
    }
  };

  return (
    <div className="overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50 border-b">
            <th className="text-left py-3 px-4 font-medium">Archetype</th>
            <th className="text-left py-3 px-4 font-medium">Status</th>
            <th className="text-left py-3 px-4 font-medium">Last Updated</th>
            <th className="text-right py-3 px-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {archetypes.map((archetype) => (
            <tr key={archetype.id} className="hover:bg-slate-50">
              <td className="py-3 px-4">{archetype.name}</td>
              <td className="py-3 px-4">
                {getStatusBadge(archetype.status)}
              </td>
              <td className="py-3 px-4 text-gray-600">
                {archetype.lastUpdated || 'Never'}
              </td>
              <td className="py-2 px-4 text-right space-x-2 whitespace-nowrap">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewReport(archetype.id)}
                  disabled={!archetype.hasReport}
                  title={archetype.hasReport ? "View Report" : "No Report Available"}
                  className="hover:bg-slate-200"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCopyReportUrl(archetype.id)}
                  className="hover:bg-slate-200"
                >
                  <ClipboardCopy className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArchetypeList;
