
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useReportGeneration = () => {
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [lastGeneratedUrl, setLastGeneratedUrl] = useState<string | null>(null);

  const generateReport = async (archetypeId: string) => {
    try {
      setIsGenerating(archetypeId);
      const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      const accessToken = crypto.randomUUID();
      
      const { data, error } = await supabase
        .from('report_requests')
        .insert({
          archetype_id: archetypeId,
          access_token: accessToken,
          status: 'active',
          expires_at: expiryDate.toISOString(),
          name: 'Admin Generated',
          organization: 'Admin Access',
          email: 'admin@example.com',
          created_at: new Date().toISOString(),
          id: crypto.randomUUID()
        })
        .select();

      if (error) throw error;

      const reportUrl = `${window.location.origin}/report/${archetypeId}/${accessToken}`;
      setLastGeneratedUrl(reportUrl);
      await navigator.clipboard.writeText(reportUrl);
      toast.success('Report generated and link copied to clipboard');
      
      return { data, url: reportUrl };
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report: ' + (error as Error).message);
      throw error;
    } finally {
      setIsGenerating(null);
    }
  };

  const deleteReport = async (reportId: string) => {
    try {
      setIsDeleting(reportId);
      const { error } = await supabase
        .from('report_requests')
        .delete()
        .eq('id', reportId);

      if (error) throw error;
      toast.success('Report deleted successfully');
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error('Failed to delete report: ' + (error as Error).message);
      throw error;
    } finally {
      setIsDeleting(null);
    }
  };

  return {
    generateReport,
    deleteReport,
    isGenerating,
    isDeleting,
    lastGeneratedUrl,
    setLastGeneratedUrl
  };
};
