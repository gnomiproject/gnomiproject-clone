
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, FilePlus2, Database } from "lucide-react";

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
  // Determine if actions should be disabled
  const isDisabled = 
    isGenerating || 
    isLoading || 
    isRefreshing || 
    connectionStatus === 'checking' || 
    connectionStatus === 'error' || 
    connectionStatus === null;

  return (
    <div className="flex flex-wrap gap-3">
      <Button 
        variant="default"
        onClick={onGenerateReports}
        disabled={isDisabled}
        className="relative"
      >
        <FilePlus2 className="mr-2 h-4 w-4" />
        Generate All Reports
        {isGenerating && (
          <span className="absolute inset-0 flex items-center justify-center bg-primary/70 rounded-md">
            <RefreshCw className="h-4 w-4 animate-spin text-white" />
          </span>
        )}
      </Button>

      <Button 
        variant="outline"
        onClick={onRefresh}
        disabled={isDisabled}
        className="relative"
      >
        <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        Refresh Status
      </Button>

      {connectionStatus !== 'connected' && (
        <Button 
          variant="outline" 
          disabled={connectionStatus === 'checking'}
          className="hidden"
        >
          <Database className="mr-2 h-4 w-4" />
          Connect Database
        </Button>
      )}
    </div>
  );
};
