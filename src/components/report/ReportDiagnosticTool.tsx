
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useEmailService } from '@/hooks/useEmailService';
import { useReportDiagnostic, type ReportData } from '@/hooks/useReportDiagnostic';

// Import the smaller components
import ReportStatsHeader from './diagnostic/ReportStatsHeader';
import ReportLookupForm from './diagnostic/ReportLookupForm';
import PendingReportsCheck from './diagnostic/PendingReportsCheck';
import PendingReportsList from './diagnostic/PendingReportsList';
import ReportDetails from './diagnostic/ReportDetails';

const ReportDiagnosticTool: React.FC = () => {
  const params = useParams<{ archetypeId?: string, token?: string }>();
  const navigate = useNavigate();
  const [isLookupMode, setIsLookupMode] = useState(!params.archetypeId || !params.token);
  const { processPendingReports, isSending: isProcessing } = useEmailService();

  // Use our custom hook for report data management
  const { 
    archetypeId, 
    setArchetypeId,
    accessToken, 
    setAccessToken,
    isLoading,
    reportData,
    totalReports,
    pendingReports,
    fetchReportStats,
    fetchReportData,
    updateReportStatus,
    checkPendingReports,
    testSendDirectEmailForReport
  } = useReportDiagnostic(params.archetypeId || '', params.token || '');

  useEffect(() => {
    // If URL contains both archetypeId and token, fetch report data automatically
    if (params.archetypeId && params.token) {
      setArchetypeId(params.archetypeId);
      setAccessToken(params.token);
      fetchReportData(params.archetypeId, params.token);
    }
    
    // Get stats on report counts
    fetchReportStats();
  }, [params.archetypeId, params.token]);

  const handleLookup = () => {
    fetchReportData(archetypeId, accessToken);
    
    // Update URL to include the archetype ID and token for sharing/bookmarking
    navigate(`/report-diagnostic/${archetypeId}/${accessToken}`);
  };

  const handleProcessReports = async () => {
    const result = await processPendingReports();
    if (result.success) {
      await fetchReportStats();
      await checkPendingReports();
    }
  };

  const handleViewDetails = (archId: string, token: string) => {
    setArchetypeId(archId);
    navigate(`/report-diagnostic/${archId}/${token}`);
    // We'll let the useEffect fetch the data
  };

  const renderReportData = () => {
    if (!reportData) return null;
    
    if (reportData.type === 'pendingReportsList' && reportData.pendingReports) {
      return (
        <div className="mt-4">
          <h3 className="text-lg font-medium">Pending Reports ({reportData.pendingReports.length})</h3>
          <PendingReportsList 
            reports={reportData.pendingReports} 
            onViewDetails={handleViewDetails}
            onTestSendEmail={testSendDirectEmailForReport}
          />
        </div>
      );
    }
    
    return (
      <div className="mt-4">
        <h3 className="text-lg font-medium">Report Details</h3>
        <ReportDetails 
          report={reportData} 
          onUpdateStatus={updateReportStatus}
          onTestSendEmail={testSendDirectEmailForReport}
          isLoading={isLoading}
        />
      </div>
    );
  };

  return (
    <Card className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Report Diagnostic Tool</h2>
        <ReportStatsHeader 
          totalReports={totalReports} 
          pendingReports={pendingReports} 
          onRefresh={fetchReportStats}
        />
      </div>
      
      {isLookupMode ? (
        <>
          <ReportLookupForm
            archetypeId={archetypeId}
            accessToken={accessToken}
            onArchetypeIdChange={setArchetypeId}
            onAccessTokenChange={setAccessToken}
            onLookup={handleLookup}
            isLoading={isLoading}
          />
          
          <Separator className="my-4" />
          
          <PendingReportsCheck
            onCheckPending={checkPendingReports}
            onProcessPending={handleProcessReports}
            isLoading={isLoading}
            isProcessing={isProcessing}
          />
        </>
      ) : (
        <>
          <div className="bg-gray-50 p-3 rounded text-sm overflow-auto mb-4">
            <p><strong>Archetype ID:</strong> {archetypeId}</p>
            <p><strong>Access Token:</strong> {accessToken}</p>
            <Button 
              variant="link" 
              onClick={() => setIsLookupMode(true)}
              className="p-0 h-auto text-blue-600"
            >
              Switch to Lookup Mode
            </Button>
          </div>
        </>
      )}
      
      {renderReportData()}
    </Card>
  );
};

export default ReportDiagnosticTool;
