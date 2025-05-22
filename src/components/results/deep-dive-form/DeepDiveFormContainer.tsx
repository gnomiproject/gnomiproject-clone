
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { addDays } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ArchetypeId } from '@/types/archetype';
import DeepDiveFormSection, { FormSchema, FormData } from './DeepDiveFormSection';
import FormLayout from './FormLayout';

// Session storage key for submitted report
const REPORT_SUBMITTED_KEY = 'healthcareArchetypeReportSubmitted';
const SESSION_EXACT_EMPLOYEE_COUNT_KEY = 'healthcareArchetypeExactEmployeeCount';

interface DeepDiveFormContainerProps {
  archetypeId: ArchetypeId;
  assessmentResult?: any;
  assessmentAnswers?: any;
  archetypeData?: any;
}

const DeepDiveFormContainer = ({ 
  archetypeId, 
  assessmentResult,
  assessmentAnswers,
  archetypeData 
}: DeepDiveFormContainerProps) => {
  // Define all hooks at the top level - never conditionally
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccessful, setSubmitSuccessful] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [accessUrl, setAccessUrl] = useState('');
  const navigate = useNavigate();
  const loggedRef = useRef(false);
  const storageCheckedRef = useRef(false);
  
  // Form setup - must be called unconditionally
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      organization: "",
      comments: "",
      sessionId: localStorage.getItem('session_id') || ''
    },
  });

  // Extended debug logging to trace the data flow - only do this once per component instance
  useEffect(() => {
    if (!loggedRef.current) {
      console.log('[DeepDiveFormContainer] Assessment data received', {
        archetypeId,
        hasAssessmentResult: !!assessmentResult,
        assessmentResultKeys: assessmentResult ? Object.keys(assessmentResult) : null,
        hasExactData: assessmentResult?.exactData ? 'Yes' : 'No',
        exactEmployeeCount: assessmentResult?.exactData?.employeeCount,
      });
      loggedRef.current = true;
    }
    
    // Reset the logging flag when archetypeId changes
    return () => {
      loggedRef.current = false;
      storageCheckedRef.current = false;
    };
  }, [assessmentResult, archetypeId]);
  
  // Check if user has already submitted a report in this session - only once
  useEffect(() => {
    if (storageCheckedRef.current) return;
    storageCheckedRef.current = true;
    
    const hasSubmittedReport = sessionStorage.getItem(REPORT_SUBMITTED_KEY);
    if (hasSubmittedReport) {
      try {
        const submissionData = JSON.parse(hasSubmittedReport);
        if (submissionData.archetypeId === archetypeId) {
          setSubmitSuccessful(true);
          setSubmittedEmail(submissionData.email || '');
          // Also set the accessUrl if available
          if (submissionData.accessUrl) {
            setAccessUrl(submissionData.accessUrl);
          }
        }
      } catch (e) {
        console.error("Could not parse report submission data:", e);
      }
    }
  }, [archetypeId]);

  const handleRetakeAssessment = () => {
    navigate('/assessment');
  };

  const resetFormSubmission = () => {
    // Remove the submission record from session storage
    sessionStorage.removeItem(REPORT_SUBMITTED_KEY);
    
    // Reset state
    setSubmitSuccessful(false);
    setSubmittedEmail('');
    setAccessUrl('');
    
    // Reset form fields
    form.reset({
      name: "",
      email: "",
      organization: "",
      comments: "",
      sessionId: localStorage.getItem('session_id') || ''
    });
    
    toast.info("Form reset successfully. You can submit a new request.");
  };

  const handleSubmit = async (data: FormData) => {
    console.log('[DeepDiveFormContainer] Form submitted with data:', data);
    setIsSubmitting(true);
    
    try {
      // Generate a unique ID for the report request
      const reportId = uuidv4();
      
      // Get exact employee count with multiple fallbacks
      let exactEmployeeCount = null;
      
      // First try assessment result
      if (assessmentResult?.exactData?.employeeCount !== undefined) {
        exactEmployeeCount = assessmentResult.exactData.employeeCount;
        console.log('[DeepDiveFormContainer] Using employee count from assessmentResult:', exactEmployeeCount);
      }
      // Then try session storage
      else {
        const storedCount = sessionStorage.getItem(SESSION_EXACT_EMPLOYEE_COUNT_KEY);
        if (storedCount) {
          exactEmployeeCount = Number(storedCount);
          console.log('[DeepDiveFormContainer] Using employee count from session storage:', exactEmployeeCount);
        }
      }
      
      console.log('[DeepDiveFormContainer] Final exact employee count for submission:', exactEmployeeCount);
      
      // Generate access token and construct URL
      const accessToken = uuidv4();
      const generatedUrl = `${window.location.origin}/report/${archetypeId}/${accessToken}`;
      setAccessUrl(generatedUrl); // Store URL for potential display
      
      // Ensure assessment result is properly formatted for database storage
      let formattedAssessmentResult = null;
      if (assessmentResult) {
        formattedAssessmentResult = {
          primaryArchetype: assessmentResult.primaryArchetype,
          secondaryArchetype: assessmentResult.secondaryArchetype,
          tertiaryArchetype: assessmentResult.tertiaryArchetype,
          score: assessmentResult.score,
          percentageMatch: assessmentResult.percentageMatch,
          resultTier: assessmentResult.resultTier,
          exactData: { 
            employeeCount: exactEmployeeCount 
          }
        };
      }

      // Get archetype name for better UX and emails
      let archetypeName = '';
      try {
        // First check if archetypeData already has the name
        if (archetypeData && archetypeData.name) {
          archetypeName = archetypeData.name;
        } else {
          const { data: archetypeInfo } = await supabase
            .from('Core_Archetype_Overview')
            .select('name')
            .eq('id', archetypeId)
            .maybeSingle();
            
          if (archetypeInfo) {
            archetypeName = archetypeInfo.name;
          }
        }
        console.log(`[DeepDiveFormContainer] Using archetype name: ${archetypeName}`);
      } catch (nameError) {
        console.warn('[DeepDiveFormContainer] Could not fetch archetype name:', nameError);
      }
      
      // Create current timestamp
      const now = new Date().toISOString();
      
      const { data: response, error } = await supabase
        .from('report_requests')
        .insert({
          id: reportId,
          archetype_id: archetypeId,
          archetype_name: archetypeName || undefined, // Add archetype name for better emails
          name: data.name,
          email: data.email,
          organization: data.organization || null,
          comments: data.comments || null,
          status: 'active', // Set to 'active' for immediate access and email sending
          access_token: accessToken,
          created_at: now,
          expires_at: addDays(new Date(), 30).toISOString(),
          session_id: data.sessionId || null,
          assessment_result: formattedAssessmentResult,
          assessment_answers: assessmentAnswers || null,
          exact_employee_count: exactEmployeeCount,
          access_url: generatedUrl,
          email_sent_at: null, // Explicitly set to null so email sending function will process it
          email_send_attempts: 0,
          last_attempt_at: null,
          access_count: 0,
          source: 'deep_dive_form' // Add source to track origin
        })
        .select('id, access_token, access_url');

      if (error) {
        console.error('[DeepDiveFormContainer] Error details:', error);
        throw error;
      }
      
      console.log('[DeepDiveFormContainer] Report request created successfully:', response);
      
      // Store submission record in session storage to prevent multiple submissions
      sessionStorage.setItem(REPORT_SUBMITTED_KEY, JSON.stringify({
        archetypeId: archetypeId,
        email: data.email,
        accessUrl: generatedUrl,
        timestamp: now
      }));
      
      // Set the success state
      setSubmitSuccessful(true);
      setSubmittedEmail(data.email);
      
      // Track event
      window.gtag?.('event', 'deep_dive_request', {
        event_category: 'engagement',
        event_label: archetypeId
      });
      
      // Call the email sending function to immediately process the email
      try {
        // This direct invocation can be optional - the email will be sent automatically
        // by the edge function when it runs next
        const emailResponse = await supabase.functions.invoke('send-report-email', {
          method: 'POST',
          body: { trigger: 'form_submission' }
        });
        console.log('[DeepDiveFormContainer] Email sending triggered:', emailResponse);
      } catch (emailError) {
        console.warn('[DeepDiveFormContainer] Could not trigger immediate email sending:', emailError);
        // Not critical - emails will be sent by scheduled runs
      }
      
      toast.success(`Report request submitted successfully. We'll send a link to ${data.email}.`);
      
    } catch (error: any) {
      console.error('[DeepDiveFormContainer] Error submitting report request:', error);
      toast.error(`Error: ${error.message || 'Failed to submit request'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get the archetype name from archetypeData if available
  const archetypeName = archetypeData?.name || '';

  return (
    <FormLayout 
      archetypeName={archetypeName}
      form={form}
      submitSuccessful={submitSuccessful}
      submittedEmail={submittedEmail}
      isSubmitting={isSubmitting}
      onRetakeAssessment={handleRetakeAssessment}
      onResetForm={resetFormSubmission}
      onSubmit={handleSubmit}
      accessUrl={accessUrl}
    />
  );
};

// Use React.memo with custom equality function to prevent unnecessary re-renders
export default React.memo(DeepDiveFormContainer, (prevProps, nextProps) => {
  const prevCount = prevProps.assessmentResult?.exactData?.employeeCount;
  const nextCount = nextProps.assessmentResult?.exactData?.employeeCount;
  return prevProps.archetypeId === nextProps.archetypeId && prevCount === nextCount;
});
