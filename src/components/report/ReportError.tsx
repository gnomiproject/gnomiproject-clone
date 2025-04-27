
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReportErrorProps {
  title: string;
  message: string;
  actionLabel: string;
  onAction: () => void;
}

const ReportError = ({ title, message, actionLabel, onAction }: ReportErrorProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <Button onClick={onAction}>{actionLabel}</Button>
      </div>
    </div>
  );
};

export default ReportError;
