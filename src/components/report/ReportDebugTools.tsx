
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Bug, LayoutDashboard } from 'lucide-react';

interface ReportDebugToolsProps {
  showDebugData: boolean;
  toggleDebugData: () => void;
  showDiagnostics: boolean;
  toggleDiagnostics: () => void;
  onRefreshData: () => void;
  isAdminView?: boolean;
  debugInfo?: any;
}

const ReportDebugTools: React.FC<ReportDebugToolsProps> = ({
  showDebugData,
  toggleDebugData,
  showDiagnostics,
  toggleDiagnostics,
  onRefreshData,
  isAdminView,
  debugInfo
}) => {
  return (
    <div className="fixed right-6 top-24 z-50 flex gap-2">
      <Button 
        variant="outline"
        size="sm"
        onClick={toggleDiagnostics}
        className="bg-white shadow-md hover:bg-gray-100"
      >
        <LayoutDashboard className="h-4 w-4 mr-2" />
        {showDiagnostics ? 'Back to Report' : 'Diagnostics'}
      </Button>
      
      <Button 
        variant="outline"
        size="sm"
        onClick={toggleDebugData}
        className="bg-white shadow-md hover:bg-gray-100"
      >
        <Bug className="h-4 w-4 mr-2" />
        {showDebugData ? 'Hide Debug' : 'Debug Data'}
      </Button>
      
      <Button 
        variant="outline"
        size="sm"
        onClick={onRefreshData}
        className="bg-white shadow-md hover:bg-gray-100"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh Data
      </Button>
    </div>
  );
};

export default ReportDebugTools;
