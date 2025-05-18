
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, FileSearch, RefreshCw } from 'lucide-react';

interface PendingReportsCheckProps {
  onCheckPending: () => void;
  onProcessPending: () => void;
  isLoading: boolean;
  isProcessing: boolean;
}

const PendingReportsCheck: React.FC<PendingReportsCheckProps> = ({
  onCheckPending,
  onProcessPending,
  isLoading,
  isProcessing
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Pending Reports Check</h3>
      <Button 
        variant="outline" 
        onClick={onCheckPending}
        disabled={isLoading}
        className="w-full mb-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Checking...
          </>
        ) : (
          <>
            <FileSearch className="mr-2 h-4 w-4" />
            Check Pending Reports
          </>
        )}
      </Button>
      
      <Button 
        onClick={onProcessPending}
        disabled={isProcessing}
        className="w-full"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Process Pending Reports
          </>
        )}
      </Button>
    </div>
  );
};

export default PendingReportsCheck;
