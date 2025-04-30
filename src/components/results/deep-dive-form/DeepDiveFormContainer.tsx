
import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { addDays } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ArchetypeId } from '@/types/archetype';
import { FormSchema, FormData } from './DeepDiveFormSection';
import FormLayout from './FormLayout';

// Add Google Analytics gtag to the Window interface
declare global {
  interface Window {
    gtag?: (command: string, action: string, params: object) => void;
  }
}

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccessful, setSubmitSuccessful] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [accessUrl, setAccessUrl] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Extended debug logging to trace the data flow
  useEffect(() => {
    console.log('[DeepDiveFormContainer] Assessment data received', {
      archetypeId,
      hasAssessmentResult: !!assessmentResult,
      assessmentResultKeys: assessmentResult ? Object.keys(assessmentResult) : null,
      hasExactData: assessmentResult?.exactData ? 'Yes' : 'No',
      exactEmployeeCount: assessmentResult?.exactData?.employeeCount,
    });
  }, [assessmentResult, archetypeId]);
  
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

  // Check if user has already submitted a report in this session
  useEffect(() => {
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
    setFormError(null);
    
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
    setFormError(null);
    
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
      
      console.log('[DeepDiveFormContainer] About to insert into Supabase with data:', {
        reportId,
        archetypeId,
        accessToken,
        name: data.name,
        email: data.email,
        organization: data.organization || null,
        employeeCount: exactEmployeeCount,
        accessUrl: generatedUrl
      });
      
      const { data: response, error } = await supabase
        .from('report_requests')
        .insert({
          id: reportId,
          archetype_id: archetypeId,
          name: data.name,
          email: data.email,
          organization: data.organization || null,
          comments: data.comments || null,
          status: 'active',
          access_token: accessToken,
          created_at: new Date().toISOString(),
          expires_at: addDays(new Date(), 30).toISOString(),
          session_id: data.sessionId || null,
          assessment_result: formattedAssessmentResult,
          assessment_answers: assessmentAnswers || null,
          exact_employee_count: exactEmployeeCount,
          access_url: generatedUrl
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
        timestamp: new Date().toISOString()
      }));
      
      // Set the success state
      setSubmitSuccessful(true);
      setSubmittedEmail(data.email);
      
      // Track event
      if (window.gtag) {
        window.gtag('event', 'deep_dive_request', {
          event_category: 'engagement',
          event_label: archetypeId
        });
      }
      
      toast.success(`Report request submitted successfully. We've sent a link to ${data.email}.`);
      
    } catch (error: any) {
      console.error('[DeepDiveFormContainer] Error submitting report request:', error);
      setFormError(error.message || 'Failed to submit request. Please try again.');
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
      formError={formError}
    />
  );
};

export default DeepDiveFormContainer;
