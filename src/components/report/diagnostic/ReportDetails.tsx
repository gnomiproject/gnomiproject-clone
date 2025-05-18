
import React from 'react';
import { Button } from '@/components/ui/button';
import StatusBadge from './StatusBadge';
import { type ReportData } from '@/hooks/useReportDiagnostic';

interface ReportDetailsProps {
  report: ReportData;
  onUpdateStatus: (status: string) => void;
  onTestSendEmail: (report: ReportData) => void;
  isLoading: boolean;
}

const ReportDetails: React.FC<ReportDetailsProps> = ({
  report,
  onUpdateStatus,
  onTestSendEmail,
  isLoading
}) => {
  return (
    <div className="bg-gray-50 rounded-md p-4 mt-2 max-h-80 overflow-auto">
      <div className="flex justify-between items-start">
        <div>
          <div><strong>ID:</strong> {report.id}</div>
          <div><strong>Email:</strong> {report.email}</div>
          <div><strong>Name:</strong> {report.name}</div>
          <div><strong>Organization:</strong> {report.organization}</div>
          <div className="flex items-center gap-2">
            <strong>Status:</strong> <StatusBadge status={report.status || ''} />
          </div>
          <div><strong>Created:</strong> {report.created_at ? new Date(report.created_at).toLocaleString() : 'N/A'}</div>
          {report.last_accessed && (
            <div><strong>Last Accessed:</strong> {new Date(report.last_accessed).toLocaleString()}</div>
          )}
          {report.email_sent_at && (
            <div><strong>Email Sent:</strong> {new Date(report.email_sent_at).toLocaleString()}</div>
          )}
          <div><strong>Access Count:</strong> {report.access_count || 0}</div>
          <div><strong>Send Attempts:</strong> {report.email_send_attempts || 0}</div>
          {report.last_attempt_at && (
            <div><strong>Last Attempt:</strong> {new Date(report.last_attempt_at).toLocaleString()}</div>
          )}
          {report.email_error && (
            <div className="text-red-600"><strong>Error:</strong> {report.email_error}</div>
          )}
          {report.access_url && (
            <div className="mt-2">
              <strong>Access URL:</strong> 
              <a 
                href={report.access_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline ml-1"
              >
                {report.access_url}
              </a>
            </div>
          )}
        </div>
        <Button
          size="sm"
          variant="default"
          onClick={() => onTestSendEmail(report)}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Test Send Email
        </Button>
      </div>
      <div className="mt-4 space-x-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => onUpdateStatus('pending')}
          disabled={report.status === 'pending' || isLoading}
        >
          Mark as Pending
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => onUpdateStatus('active')}
          disabled={report.status === 'active' || isLoading}
        >
          Mark as Active
        </Button>
      </div>
    </div>
  );
};

export default ReportDetails;
