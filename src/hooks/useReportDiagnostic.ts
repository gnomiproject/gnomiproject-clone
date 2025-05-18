
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getSupabaseUrl } from '@/integrations/supabase/client';

export interface ReportData {
  id?: string;
  email?: string;
  name?: string;
  organization?: string;
  archetype_id?: string;
  access_token?: string;
  status?: string;
  created_at?: string;
  last_accessed?: string;
  email_sent_at?: string;
  access_count?: number;
  email_send_attempts?: number;
  last_attempt_at?: string;
  email_error?: string;
  access_url?: string;
  archetype_name?: string;
  type?: string;
  pendingReports?: ReportData[];
}

export const useReportDiagnostic = (initialArchetypeId: string = '', initialToken: string = '') => {
  const [archetypeId, setArchetypeId] = useState(initialArchetypeId);
  const [accessToken, setAccessToken] = useState(initialToken);
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [totalReports, setTotalReports] = useState<number | null>(null);
  const [pendingReports, setPendingReports] = useState<number | null>(null);

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
      return false;
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
        return false;
      } else {
        // If the archetype_name isn't in the report_requests table, we can try to fetch it separately
        let reportWithArchetypeName = { ...data };
        
        try {
          // Try to fetch the archetype name from Core_Archetype_Overview
          const { data: archetypeData, error: archetypeError } = await supabase
            .from('Core_Archetype_Overview')
            .select('name')
            .eq('id', id)
            .maybeSingle();
          
          if (!archetypeError && archetypeData) {
            reportWithArchetypeName.archetype_name = archetypeData.name;
          }
        } catch (err) {
          console.error('Error fetching archetype name:', err);
          // We'll continue even if this fails, as it's not critical
        }
        
        setReportData(reportWithArchetypeName);
        toast.success('Report data fetched successfully');
        return true;
      }
    } catch (err: any) {
      console.error('Error fetching report data:', err);
      toast.error(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateReportStatus = async (newStatus: string) => {
    if (!reportData) {
      toast.error('No report data loaded');
      return false;
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
      return true;
    } catch (err: any) {
      console.error('Error updating status:', err);
      toast.error(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const checkPendingReports = async () => {
    setIsLoading(true);
    try {
      // Select only the columns that definitely exist in report_requests
      // Removed 'archetype_name' from the select fields
      const { data, error } = await supabase
        .from('report_requests')
        .select('id, email, archetype_id, status, created_at, name, access_token, email_send_attempts, last_attempt_at, email_error, email_sent_at')
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
          pendingReports: data as ReportData[],
          type: 'pendingReportsList'
        });
      }
      
      await fetchReportStats();
      return true;
    } catch (err: any) {
      console.error('Error checking pending reports:', err);
      toast.error(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const testSendDirectEmailForReport = async (report: ReportData) => {
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

  return {
    archetypeId,
    setArchetypeId,
    accessToken,
    setAccessToken,
    isLoading,
    reportData,
    setReportData,
    totalReports,
    pendingReports,
    fetchReportStats,
    fetchReportData,
    updateReportStatus,
    checkPendingReports,
    testSendDirectEmailForReport
  };
};
