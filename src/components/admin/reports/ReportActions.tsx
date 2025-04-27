
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";

interface ReportActionsProps {
  onGenerateReports: () => void;
  onRefresh: () => void;
  isGenerating: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  connectionStatus: 'checking' | 'connected' | 'error' | null;
}

export const ReportActions: React.FC<ReportActionsProps> = ({
  onGenerateReports,
  onRefresh,
  isGenerating,
  isLoading,
  isRefreshing,
  connectionStatus
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <Button 
        onClick={onGenerateReports} 
        disabled={isGenerating || isLoading || connectionStatus === 'error' || !connectionStatus}
        size="lg"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Reports...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate All Reports
          </>
        )}
      </Button>
      
      <Button 
        variant="outline" 
        onClick={onRefresh}
        disabled={isLoading || isGenerating || connectionStatus === 'error' || !connectionStatus || isRefreshing}
      >
        <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        {isRefreshing ? "Refreshing..." : "Refresh Status"}
      </Button>
    </div>
  );
};
