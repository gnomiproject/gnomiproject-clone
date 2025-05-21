
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Key format for localStorage
const getUnlockKey = (archetypeId: string) => `healthcareArchetypeReportUnlocked_${archetypeId}`;

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

  // Check if the report is already unlocked on mount
  useEffect(() => {
    if (!archetypeId) return;
    
    const unlockStatus = localStorage.getItem(getUnlockKey(archetypeId));
    if (unlockStatus === 'true') {
      setIsUnlocked(true);
    }
  }, [archetypeId]);

  // Function to trigger the unlock modal
  const openUnlockModal = () => {
    setShowUnlockModal(true);
    setSubmissionError(null); // Reset error on open
  };

  // Function to close the unlock modal
  const closeUnlockModal = () => {
    setShowUnlockModal(false);
    setSubmissionError(null); // Reset error on close
  };

  // Function to handle the form submission with enhanced error handling
  const submitUnlockForm = async (formData: UnlockFormData) => {
    if (!archetypeId) {
      toast.error("Missing archetype ID");
      setSubmissionError("Missing archetype ID");
      return { success: false, error: "Missing archetype ID" };
    }
    
    setIsSubmitting(true);
    setSubmissionError(null);
    
    try {
      console.log('Submitting unlock form with data:', {
        ...formData,
        assessmentAnswers: formData.assessmentAnswers ? '[data present]' : 'none'
      });
      
      // Submit the form data to create a report request
      const { data, error } = await supabase
        .from('report_requests')
        .insert([{
          name: formData.name,
          email: formData.email,
          organization: formData.organization,
          archetype_id: archetypeId,
          exact_employee_count: formData.employeeCount,
          assessment_answers: formData.assessmentAnswers,
          status: 'pending',
          source: 'insights_page_unlock'
        }])
        .select();
      
      if (error) {
        console.error('Error submitting unlock form:', error);
        const errorMsg = `Failed to save report request: ${error.message}`;
        setSubmissionError(errorMsg);
        toast.error("Failed to unlock report", {
          description: "Please try again or contact support if the issue persists."
        });
        return { success: false, error: errorMsg };
      }
      
      // Mark the report as unlocked in localStorage
      localStorage.setItem(getUnlockKey(archetypeId), 'true');
      setIsUnlocked(true);
      closeUnlockModal();
      
      toast.success("Report unlocked!", {
        description: "You now have access to all insights."
      });
      
      return { success: true, data };
    } catch (error: any) {
      console.error('Error submitting unlock form:', error);
      const errorMsg = error?.message || "An unknown error occurred";
      setSubmissionError(errorMsg);
      
      toast.error("Failed to unlock report", {
        description: "Please try again or contact support if the issue persists."
      });
      
      return { success: false, error: errorMsg };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isUnlocked,
    isSubmitting,
    showUnlockModal,
    submissionError,
    openUnlockModal,
    closeUnlockModal,
    submitUnlockForm
  };
};
