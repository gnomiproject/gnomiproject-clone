
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReportErrorProps {
  title: string;
  message: string;
  actionLabel: string;
  onAction: () => void;
}

const ReportError = ({ title, message, actionLabel, onAction }: ReportErrorProps) => {
  return (
    <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-3">{title}</h2>
        <p className="text-gray-600 mb-8">{message}</p>
        <Button 
          onClick={onAction} 
          className="px-6 py-3 flex items-center gap-2 mx-auto"
          size="lg"
        >
          {actionLabel.toLowerCase().includes('try') && (
            <RefreshCw className="h-4 w-4" />
          )}
          {actionLabel}
        </Button>
      </div>
    </div>
  );
};

export default ReportError;
