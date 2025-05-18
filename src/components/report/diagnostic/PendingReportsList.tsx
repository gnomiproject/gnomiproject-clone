
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { type ReportData } from '@/hooks/useReportDiagnostic';

interface PendingReportsListProps {
  reports: ReportData[];
  onViewDetails: (archetypeId: string, accessToken: string) => void;
  onTestSendEmail: (report: ReportData) => void;
}

const PendingReportsList: React.FC<PendingReportsListProps> = ({
  reports,
  onViewDetails,
  onTestSendEmail
}) => {
  if (!reports || reports.length === 0) {
    return (
      <div className="bg-gray-50 rounded-md p-4 mt-2 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-yellow-500 mb-2" />
        <p>No pending reports found in the database</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-md p-4 mt-2 max-h-80 overflow-auto">
      {reports.map((report: ReportData) => (
        <div key={report.id} className="mb-2 p-2 border border-gray-200 rounded">
          <div className="flex justify-between items-start">
            <div>
              <div><strong>ID:</strong> {report.id}</div>
              <div><strong>Email:</strong> {report.email}</div>
              <div><strong>Archetype:</strong> {report.archetype_id}</div>
              <div className="flex items-center gap-2">
                <strong>Status:</strong> <StatusBadge status={report.status || ''} />
              </div>
              <div><strong>Created:</strong> {report.created_at ? new Date(report.created_at).toLocaleString() : 'N/A'}</div>
              <div><strong>Send Attempts:</strong> {report.email_send_attempts || 0}</div>
              {report.last_attempt_at && (
                <div><strong>Last Attempt:</strong> {new Date(report.last_attempt_at).toLocaleString()}</div>
              )}
              {report.email_sent_at && (
                <div><strong>Email Sent:</strong> {new Date(report.email_sent_at).toLocaleString()}</div>
              )}
              {report.email_error && (
                <div className="text-red-600 mt-1"><strong>Error:</strong> {report.email_error}</div>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onViewDetails(report.archetype_id || '', report.access_token || '')}
              >
                View Details
              </Button>
              <Button
                size="sm"
                variant="default"
                onClick={() => onTestSendEmail(report)}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Test Send Email
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PendingReportsList;
