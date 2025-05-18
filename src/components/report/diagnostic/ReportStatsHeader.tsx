
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface ReportStatsHeaderProps {
  totalReports: number | null;
  pendingReports: number | null;
  onRefresh: () => void;
}

const ReportStatsHeader: React.FC<ReportStatsHeaderProps> = ({
  totalReports,
  pendingReports,
  onRefresh
}) => {
  return (
    <div className="flex gap-2 items-center">
      <span className="text-sm text-gray-500">
        Total Reports: {totalReports !== null ? totalReports : '...'}
      </span>
      <Badge variant="secondary" className="ml-2">
        {pendingReports !== null ? pendingReports : '...'} Pending
      </Badge>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onRefresh}
        title="Refresh stats"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ReportStatsHeader;
