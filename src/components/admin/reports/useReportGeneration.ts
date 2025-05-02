
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { calculatePercentageDifference } from '@/utils/reports/metricUtils';

/**
 * Hook to handle report generation and management
 */
export const useReportGeneration = () => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [lastGeneratedUrl, setLastGeneratedUrl] = useState('');
  const [generationInProgress, setGenerationInProgress] = useState<string[]>([]);

  /**
   * Generate a report for a specific archetype
   */
  const generateReport = async (archetypeId: string) => {
    setIsGenerating(true);
    setGenerationInProgress(prev => [...prev, archetypeId]);
    
    try {
      // Fetch the archetype data from the level4_deepdive_report_data table
      const { data: archetypeData, error: archetypeError } = await supabase
        .from('level4_deepdive_report_data')
        .select('*')
        .eq('archetype_id', archetypeId)
        .maybeSingle();
      
      if (archetypeError) {
        throw new Error(`Error fetching archetype data: ${archetypeError.message}`);
      }
      
      // Fetch average data for comparisons
      const { data: averageData, error: averageError } = await supabase
        .from('level4_deepdive_report_data')
        .select('*')
        .eq('archetype_id', 'All_Average')
        .maybeSingle();
        
      if (averageError) {
        console.warn(`Warning: Could not fetch average data: ${averageError.message}`);
      }
      
      // Generate a unique access token
      const accessToken = uuidv4();

      // Calculate expiration date (30 days from now)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      
      // Create a report request entry
      const { data: reportData, error: reportError } = await supabase
        .from('report_requests')
        .insert({
          id: uuidv4(),
          archetype_id: archetypeId,
          access_token: accessToken,
          status: 'active',
          created_at: new Date().toISOString(),
          expires_at: expiryDate.toISOString(),
          name: 'Admin Generated Report',
          organization: 'Admin',
          email: 'admin@example.com'
        })
        .select();
        
      if (reportError) {
        throw new Error(`Error creating report: ${reportError.message}`);
      }

      // Generate the secure URL
      const baseUrl = window.location.origin;
      const reportUrl = `${baseUrl}/report/${archetypeId}/${accessToken}`;
      
      // Set the last generated URL for display
      setLastGeneratedUrl(reportUrl);
      
      toast.success("Report Generated", {
        description: `Successfully generated report for ${archetypeId.toLowerCase()} ${archetypeData?.archetype_name || ''}`,
      });
      
      return reportUrl;
    } catch (error: any) {
      toast.error("Report Generation Failed", {
        description: error.message,
      });
      console.error('Error generating report:', error);
      throw error;
    } finally {
      setIsGenerating(false);
      setGenerationInProgress(prev => prev.filter(id => id !== archetypeId));
    }
  };

  /**
   * Delete a report
   */
  const deleteReport = async (reportId: string) => {
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from('report_requests')
        .delete()
        .eq('id', reportId);
        
      if (error) {
        throw error;
      }
      
      toast.success("Report Deleted", {
        description: "The report access has been revoked.",
      });
    } catch (error: any) {
      console.error('Error deleting report:', error);
      
      toast.error("Failed to Delete Report", {
        description: error.message,
      });
      
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };
  
  return {
    generateReport,
    deleteReport,
    isGenerating,
    isDeleting,
    lastGeneratedUrl,
    setLastGeneratedUrl,
    generationInProgress
  };
};

export default useReportGeneration;
