
import { useState, useCallback, useEffect } from 'react';
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
  sessionId?: string; 
  comments?: string;
}

// Session storage key for unlocked archetypes
const UNLOCKED_ARCHETYPES_KEY = 'healthcareArchetypeUnlockedReports';

export const useReportUnlock = (archetypeId: string) => {
  // Check sessionStorage on initialization to see if this archetype was previously unlocked
  const checkIfPreviouslyUnlocked = (): boolean => {
    try {
      const unlockedArchetypesStr = sessionStorage.getItem(UNLOCKED_ARCHETYPES_KEY);
      if (unlockedArchetypesStr) {
        const unlockedArchetypes = JSON.parse(unlockedArchetypesStr);
        return unlockedArchetypes.includes(archetypeId);
      }
    } catch (error) {
      console.error('[useReportUnlock] Error checking unlock status:', error);
    }
    return false;
  };

  const [isUnlocked, setIsUnlocked] = useState<boolean>(checkIfPreviouslyUnlocked());
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showUnlockModal, setShowUnlockModal] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Save unlock status to sessionStorage whenever it changes
  useEffect(() => {
    if (isUnlocked) {
      try {
        const unlockedArchetypesStr = sessionStorage.getItem(UNLOCKED_ARCHETYPES_KEY);
        const unlockedArchetypes = unlockedArchetypesStr ? JSON.parse(unlockedArchetypesStr) : [];
        
        if (!unlockedArchetypes.includes(archetypeId)) {
          unlockedArchetypes.push(archetypeId);
          sessionStorage.setItem(UNLOCKED_ARCHETYPES_KEY, JSON.stringify(unlockedArchetypes));
          console.log(`[useReportUnlock] Saved unlock status for ${archetypeId} to sessionStorage`);
        }
      } catch (error) {
        console.error('[useReportUnlock] Error saving unlock status:', error);
      }
    }
  }, [isUnlocked, archetypeId]);

  // Open/close modal functions
  const openUnlockModal = useCallback(() => setShowUnlockModal(true), []);
  const closeUnlockModal = useCallback(() => setShowUnlockModal(false), []);

  // Submit form function - fixed to ensure all necessary fields are properly set
  const submitUnlockForm = useCallback(async (formData: UnlockFormData): Promise<{ success: boolean; data?: any; error?: any }> => {
    setIsSubmitting(true);
    setSubmissionError(null);
    
    try {
      console.log('[useReportUnlock] Submitting form data:', {
        name: formData.name,
        email: formData.email,
        organization: formData.organization,
        archetypeId: formData.archetypeId,
        hasEmployeeCount: formData.employeeCount !== undefined,
        hasAssessmentAnswers: formData.assessmentAnswers !== undefined,
        sessionId: formData.sessionId
      });
      
      if (!formData.name || !formData.email || !formData.organization) {
        throw new Error('Please fill out all required fields');
      }
      
      // Generate a unique report ID and access token
      const reportId = uuidv4();
      const accessToken = uuidv4();

      // Generate access URL for the report
      const accessUrl = `${window.location.origin}/report/${formData.archetypeId}/${accessToken}`;
      
      // Format assessment result for database storage - matching deep dive form
      let formattedAssessmentResult = null;
      if (formData.assessmentAnswers && formData.employeeCount) {
        formattedAssessmentResult = {
          exactData: { 
            employeeCount: formData.employeeCount 
          }
        };
      }
      
      // Get archetype name for better UX and emails
      let archetypeName = '';
      try {
        const { data: archetypeData } = await supabase
          .from('Core_Archetype_Overview')
          .select('name')
          .eq('id', formData.archetypeId)
          .maybeSingle();
          
        if (archetypeData) {
          archetypeName = archetypeData.name;
          console.log(`[useReportUnlock] Retrieved archetype name: ${archetypeName}`);
        }
      } catch (nameError) {
        console.warn('[useReportUnlock] Could not fetch archetype name:', nameError);
      }
      
      // Create current timestamp
      const now = new Date().toISOString();
      
      // Create a report request record in the database - CRITICAL CHANGE: setting status to "active" 
      const { data, error } = await supabase
        .from('report_requests')
        .insert({
          id: reportId,
          name: formData.name,
          email: formData.email,
          organization: formData.organization,
          archetype_id: formData.archetypeId,
          archetype_name: archetypeName || undefined,
          exact_employee_count: formData.employeeCount,
          access_token: accessToken,
          status: 'active', // IMPORTANT: Set status to active so it's immediately available
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          assessment_answers: formData.assessmentAnswers,
          session_id: formData.sessionId || localStorage.getItem('session_id') || null,
          comments: formData.comments || null,
          created_at: now,
          access_url: accessUrl,
          email_sent_at: null, // Explicitly set to null so email sending function will process it
          email_send_attempts: 0,
          last_attempt_at: null
        })
        .select()
        .single();
        
      if (error) {
        console.error('[useReportUnlock] Database error creating report request:', error);
        const errorMsg = error.message.includes('column') 
          ? `Database column error: ${error.message}` 
          : `Failed to create report request: ${error.message}`;
        throw new Error(errorMsg);
      }
      
      console.log('[useReportUnlock] Successfully created report request:', data);
      
      // Store submission record in session storage to prevent duplicate submissions
      sessionStorage.setItem('healthcareArchetypeReportSubmitted', JSON.stringify({
        archetypeId: formData.archetypeId,
        email: formData.email,
        accessUrl: accessUrl,
        timestamp: now
      }));
      
      // Set unlocked state
      setIsUnlocked(true);
      setShowUnlockModal(false);
      
      // Show success message
      toast.success("Report unlocked successfully!", {
        description: "You now have access to all insights. Check your email soon for a confirmation."
      });
      
      // Track initial access
      try {
        await trackReportAccess(archetypeId, accessToken);
        console.log('[useReportUnlock] Successfully tracked initial access');
      } catch (trackError) {
        console.error('[useReportUnlock] Error tracking initial access:', trackError);
      }
      
      // Track event in Google Analytics if available
      if (window.gtag) {
        window.gtag('event', 'unlock_report', {
          event_category: 'engagement',
          event_label: archetypeId
        });
      }
      
      // Call the email sending function explicitly to ensure it runs
      try {
        console.log('[useReportUnlock] Explicitly triggering email sending function');
        const emailResponse = await supabase.functions.invoke('send-report-email', {
          method: 'POST',
          body: { trigger: 'form_submission' }
        });
        console.log('[useReportUnlock] Email sending triggered:', emailResponse);
      } catch (emailError) {
        console.warn('[useReportUnlock] Could not trigger immediate email sending:', emailError);
      }
      
      return { 
        success: true,
        data: data 
      };
    } catch (error) {
      console.error('[useReportUnlock] Error unlocking report:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setSubmissionError(errorMessage);
      
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
      console.log('[useReportUnlock] Refreshing data for archetypeId:', archetypeId);
      const { data, error } = await supabase
        .from('level3_report_secure')
        .select('*')
        .eq('archetype_id', archetypeId)
        .maybeSingle();
        
      if (error) {
        console.error('[useReportUnlock] Error refreshing data:', error);
        return false;
      }
      
      if (data) {
        console.log('[useReportUnlock] Successfully refreshed data');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('[useReportUnlock] Error refreshing data:', error);
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
