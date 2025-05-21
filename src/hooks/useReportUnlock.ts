
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
  };

  // Function to close the unlock modal
  const closeUnlockModal = () => {
    setShowUnlockModal(false);
  };

  // Function to handle the form submission
  const submitUnlockForm = async (formData: UnlockFormData) => {
    if (!archetypeId) {
      toast.error("Missing archetype ID");
      return { success: false };
    }
    
    setIsSubmitting(true);
    
    try {
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
        throw new Error(`Failed to save report request: ${error.message}`);
      }
      
      // Mark the report as unlocked in localStorage
      localStorage.setItem(getUnlockKey(archetypeId), 'true');
      setIsUnlocked(true);
      closeUnlockModal();
      
      toast.success("Report unlocked! You now have access to all insights.");
      
      return { success: true, data };
    } catch (error) {
      console.error('Error submitting unlock form:', error);
      toast.error("Failed to unlock report. Please try again.");
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isUnlocked,
    isSubmitting,
    showUnlockModal,
    openUnlockModal,
    closeUnlockModal,
    submitUnlockForm
  };
};
