
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, FileSearch, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useEmailService } from '@/hooks/useEmailService';
import { getSupabaseUrl } from '@/integrations/supabase/client';

const ReportDiagnosticTool: React.FC = () => {
  const params = useParams<{ archetypeId?: string, token?: string }>();
  const navigate = useNavigate();
  const [archetypeId, setArchetypeId] = useState(params.archetypeId || '');
  const [accessToken, setAccessToken] = useState(params.token || '');
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [isLookupMode, setIsLookupMode] = useState(!params.archetypeId || !params.token);
  const [totalReports, setTotalReports] = useState<number | null>(null);
  const [pendingReports, setPendingReports] = useState<number | null>(null);
  const { processPendingReports, isSending: isProcessing } = useEmailService();

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

  const fetchReportStats = async () => {
    try {
      // Get total count
      const { count: totalCount, error: totalError } = await supabase
        .from('report_requests')
        .select('*', { count: 'exact', head: true });
      
      if (totalError) throw totalError;
      setTotalReports(totalCount || 0);
      
      // Get pending count
      const { count: pendingCount, error: pendingError } = await supabase
        .from('report_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      
      if (pendingError) throw pendingError;
      setPendingReports(pendingCount || 0);
      
    } catch (error) {
      console.error("Error fetching report stats:", error);
    }
  };

  const fetchReportData = async (id: string, token: string) => {
    if (!id || !token) {
      toast.error('Archetype ID and Access Token are required');
      return;
    }

    setIsLoading(true);
    try {
      // Fetch the report request data
      const { data, error } = await supabase
        .from('report_requests')
        .select('*')
        .eq('archetype_id', id)
        .eq('access_token', token)
        .maybeSingle();
      
      if (error) {
        throw new Error(`Failed to fetch report data: ${error.message}`);
      }
      
      if (!data) {
        toast.error('No report found with the provided ID and token');
        setReportData(null);
      } else {
        setReportData(data);
        toast.success('Report data fetched successfully');
      }
    } catch (err: any) {
      console.error('Error fetching report data:', err);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLookup = () => {
    fetchReportData(archetypeId, accessToken);
    
    // Update URL to include the archetype ID and token for sharing/bookmarking
    navigate(`/report-diagnostic/${archetypeId}/${accessToken}`);
  };
  
  const updateReportStatus = async (newStatus: string) => {
    if (!reportData) {
      toast.error('No report data loaded');
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('report_requests')
        .update({ status: newStatus })
        .eq('id', reportData.id);
      
      if (error) {
        throw new Error(`Failed to update status: ${error.message}`);
      }
      
      // Refresh the data
      await fetchReportData(archetypeId, accessToken);
      await fetchReportStats();
      toast.success(`Status updated to ${newStatus}`);
    } catch (err: any) {
      console.error('Error updating status:', err);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const checkPendingReports = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('report_requests')
        .select('id, email, archetype_id, status, created_at')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });
      
      if (error) {
        throw new Error(`Failed to check pending reports: ${error.message}`);
      }
      
      if (!data || data.length === 0) {
        toast.info('No pending reports found');
      } else {
        toast.success(`Found ${data.length} pending reports`);
        setReportData({ 
          pendingReports: data,
          type: 'pendingReportsList'
        });
      }
      
      await fetchReportStats();
    } catch (err: any) {
      console.error('Error checking pending reports:', err);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcessReports = async () => {
    const result = await processPendingReports();
    if (result.success) {
      await fetchReportStats();
      await checkPendingReports();
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'active':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>;
      case 'expired':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // New function to directly test sending an email for a specific report
  const testSendDirectEmailForReport = async (report: any) => {
    if (!report || !report.email) {
      toast.error('No valid report data');
      return;
    }
    
    setIsLoading(true);
    try {
      // Get the base URL for report access
      const baseUrl = getSupabaseUrl();
      
      const { data, error } = await supabase.functions.invoke('test-email-direct', {
        body: { 
          email: report.email,
          reportData: {
            archetypeName: report.archetype_name || "Healthcare Archetype",
            recipientName: report.name || "there",
            reportUrl: report.access_url || `${baseUrl}/report/${report.archetype_id}/${report.access_token}`
          }
        }
      });
      
      if (error) {
        throw new Error(`Error invoking email test: ${error.message}`);
      }
      
      if (data.success) {
        toast.success(`Test email sent successfully to ${report.email}`);
      } else {
        toast.error(`Failed to send test email: ${data.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      console.error('Error sending test email:', err);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Update renderReportData function to add test email button
  const renderReportData = () => {
    if (!reportData) return null;
    
    if (reportData.type === 'pendingReportsList') {
      return (
        <div className="mt-4">
          <h3 className="text-lg font-medium">Pending Reports ({reportData.pendingReports.length})</h3>
          {reportData.pendingReports.length > 0 ? (
            <div className="bg-gray-50 rounded-md p-4 mt-2 max-h-80 overflow-auto">
              {reportData.pendingReports.map((report: any) => (
                <div key={report.id} className="mb-2 p-2 border border-gray-200 rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <div><strong>ID:</strong> {report.id}</div>
                      <div><strong>Email:</strong> {report.email}</div>
                      <div><strong>Archetype:</strong> {report.archetype_id}</div>
                      <div className="flex items-center gap-2">
                        <strong>Status:</strong> {getStatusBadge(report.status)}
                      </div>
                      <div><strong>Created:</strong> {new Date(report.created_at).toLocaleString()}</div>
                      <div><strong>Send Attempts:</strong> {report.email_send_attempts || 0}</div>
                      {report.last_attempt_at && (
                        <div><strong>Last Attempt:</strong> {new Date(report.last_attempt_at).toLocaleString()}</div>
                      )}
                      {report.email_error && (
                        <div className="text-red-600 mt-1"><strong>Error:</strong> {report.email_error}</div>
                      )}
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setArchetypeId(report.archetype_id);
                          navigate(`/report-diagnostic/${report.archetype_id}/${report.access_token}`);
                          // We'll let the useEffect fetch the data
                        }}
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => testSendDirectEmailForReport(report)}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        Test Send Email
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-md p-4 mt-2 text-center">
              <AlertCircle className="mx-auto h-8 w-8 text-yellow-500 mb-2" />
              <p>No pending reports found in the database</p>
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div className="mt-4">
        <h3 className="text-lg font-medium">Report Details</h3>
        <div className="bg-gray-50 rounded-md p-4 mt-2 max-h-80 overflow-auto">
          <div className="flex justify-between items-start">
            <div>
              <div><strong>ID:</strong> {reportData.id}</div>
              <div><strong>Email:</strong> {reportData.email}</div>
              <div><strong>Name:</strong> {reportData.name}</div>
              <div><strong>Organization:</strong> {reportData.organization}</div>
              <div className="flex items-center gap-2">
                <strong>Status:</strong> {getStatusBadge(reportData.status)}
              </div>
              <div><strong>Created:</strong> {new Date(reportData.created_at).toLocaleString()}</div>
              {reportData.last_accessed && (
                <div><strong>Last Accessed:</strong> {new Date(reportData.last_accessed).toLocaleString()}</div>
              )}
              <div><strong>Access Count:</strong> {reportData.access_count || 0}</div>
              <div><strong>Send Attempts:</strong> {reportData.email_send_attempts || 0}</div>
              {reportData.last_attempt_at && (
                <div><strong>Last Attempt:</strong> {new Date(reportData.last_attempt_at).toLocaleString()}</div>
              )}
              {reportData.email_error && (
                <div className="text-red-600"><strong>Error:</strong> {reportData.email_error}</div>
              )}
              {reportData.access_url && (
                <div className="mt-2">
                  <strong>Access URL:</strong> 
                  <a 
                    href={reportData.access_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-1"
                  >
                    {reportData.access_url}
                  </a>
                </div>
              )}
            </div>
            <Button
              size="sm"
              variant="default"
              onClick={() => testSendDirectEmailForReport(reportData)}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Test Send Email
            </Button>
          </div>
          <div className="mt-4 space-x-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => updateReportStatus('pending')}
              disabled={reportData.status === 'pending' || isLoading}
            >
              Mark as Pending
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => updateReportStatus('active')}
              disabled={reportData.status === 'active' || isLoading}
            >
              Mark as Active
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Report Diagnostic Tool</h2>
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
            onClick={fetchReportStats}
            title="Refresh stats"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {isLookupMode ? (
        <>
          <div className="flex flex-col space-y-4 mb-6">
            <div>
              <label htmlFor="archetype-id" className="block text-sm font-medium mb-1">
                Archetype ID
              </label>
              <Input
                id="archetype-id"
                value={archetypeId}
                onChange={(e) => setArchetypeId(e.target.value)}
                placeholder="Enter archetype ID"
              />
            </div>
            
            <div>
              <label htmlFor="access-token" className="block text-sm font-medium mb-1">
                Access Token
              </label>
              <Input
                id="access-token"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder="Enter access token"
              />
            </div>
            
            <Button 
              onClick={handleLookup}
              disabled={isLoading || !archetypeId || !accessToken}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Lookup Report
                </>
              )}
            </Button>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Pending Reports Check</h3>
            <Button 
              variant="outline" 
              onClick={checkPendingReports}
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
              onClick={handleProcessReports}
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
