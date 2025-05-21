
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

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
  const [unlockSuccessData, setUnlockSuccessData] = useState<any>(null);
  
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
  
  // Helper function to generate access token
  const generateAccessToken = () => {
    return uuidv4();
  };
  
  // Helper function to calculate expiration date (30 days from now)
  const calculateExpiryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString();
  };
  
  // Function to refresh data after successful unlock
  const refreshData = useCallback(async (archetypeId: string) => {
    try {
      console.log(`Refreshing data for ${archetypeId} after unlock`);
      // Force refetch of level3 report data for this archetype to ensure we get the updated access state
      const { data, error } = await supabase
        .from('level3_report_secure')
        .select('*')
        .eq('archetype_id', archetypeId)
        .maybeSingle();
        
      if (error) {
        console.error('Error refreshing data after unlock:', error);
        return false;
      }
      
      console.log('Refreshed data:', data ? 'Data received' : 'No data received');
      return !!data;
    } catch (err) {
      console.error('Exception refreshing data after unlock:', err);
      return false;
    }
  }, []);

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
      
      // Generate a unique access token and expiry date
      const accessToken = generateAccessToken();
      const expiryDate = calculateExpiryDate();
      
      // Base URL for access link
      const baseUrl = window.location.origin;
      const accessUrl = `${baseUrl}/report/${archetypeId}/${accessToken}`;
      
      // Submit the form data to create a report request with ACTIVE status
      const { data, error } = await supabase
        .from('report_requests')
        .insert([{
          id: uuidv4(), // Generate a unique ID for the request
          name: formData.name,
          email: formData.email,
          organization: formData.organization,
          archetype_id: archetypeId,
          exact_employee_count: formData.employeeCount,
          assessment_answers: formData.assessmentAnswers,
          // Set status to active immediately so data access will work
          status: 'active',
          source: 'insights_page_unlock',
          // Add access token, expiry date, and access URL
          access_token: accessToken,
          expires_at: expiryDate,
          access_url: accessUrl,
          created_at: new Date().toISOString()
        }])
        .select();
      
      if (error) {
        console.error('Error submitting unlock form:', error);
        
        // Provide more specific error messages based on error type
        let errorMsg = `Failed to save report request: ${error.message}`;
        
        if (error.code === '23505') {
          errorMsg = "You've already submitted an unlock request for this report.";
        } else if (error.code === '23502') {
          errorMsg = "Please fill out all required fields.";
        } else if (error.code.startsWith('22')) {
          errorMsg = "There was a problem with the data you entered. Please check and try again.";
        }
        
        setSubmissionError(errorMsg);
        toast.error("Failed to unlock report", {
          description: "Please try again or contact support if the issue persists."
        });
        return { success: false, error: errorMsg };
      }
      
      console.log('Successfully submitted unlock form:', data);
      setUnlockSuccessData(data?.[0]);
      
      // Mark the report as unlocked in localStorage
      localStorage.setItem(getUnlockKey(archetypeId), 'true');
      setIsUnlocked(true);
      
      // Refresh data to ensure it's available right away
      await refreshData(archetypeId);
      
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
    unlockSuccessData,
    openUnlockModal,
    closeUnlockModal,
    submitUnlockForm,
    refreshData
  };
};
