
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { trackReportAccess } from '@/utils/reports/accessTracking';

// Define and export the UnlockFormData type
export interface UnlockFormData {
  name: string;
  organization: string;
  email: string;
  archetypeId: string;
  employeeCount?: number | null;
  assessmentAnswers?: any;
}

export const useReportUnlock = (archetypeId: string) => {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showUnlockModal, setShowUnlockModal] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Open/close modal functions
  const openUnlockModal = useCallback(() => setShowUnlockModal(true), []);
  const closeUnlockModal = useCallback(() => setShowUnlockModal(false), []);

  // Submit form function - updated to return proper type
  const submitUnlockForm = useCallback(async (formData: UnlockFormData): Promise<{ success: boolean; data?: any; error?: any }> => {
    setIsSubmitting(true);
    setSubmissionError(null);
    
    try {
      // Generate a unique access token
      const accessToken = uuidv4();
      const reportId = uuidv4();
      
      // Create a report request record in the database
      const { data, error } = await supabase
        .from('report_requests')
        .insert({
          id: reportId,
          name: formData.name,
          email: formData.email,
          organization: formData.organization,
          archetype_id: formData.archetypeId,
          employee_count: formData.employeeCount,
          access_token: accessToken,
          status: 'active',
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          assessment_data: formData.assessmentAnswers
        })
        .select()
        .single();
        
      if (error) {
        throw new Error(`Failed to create report request: ${error.message}`);
      }
      
      // Set unlocked state
      setIsUnlocked(true);
      setShowUnlockModal(false);
      
      // Show success message
      toast.success("Report unlocked successfully!", {
        description: "You now have access to all insights."
      });
      
      // Track initial access
      await trackReportAccess(archetypeId, accessToken);
      
      return { 
        success: true,
        data: data 
      };
    } catch (error) {
      console.error('Error unlocking report:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setSubmissionError(errorMessage);
      
      // Show error toast
      toast.error("Error unlocking report", {
        description: errorMessage
      });
      
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setIsSubmitting(false);
    }
  }, [archetypeId]);

  // Refresh data function
  const refreshData = useCallback(async (archetypeId: string) => {
    try {
      // Refresh data logic
      // ...
      return true;
    } catch (error) {
      console.error('Error refreshing data:', error);
      return false;
    }
  }, []);

  return {
    isUnlocked,
    isSubmitting,
    showUnlockModal,
    openUnlockModal,
    closeUnlockModal,
    submitUnlockForm,
    submissionError,
    refreshData
  };
};
