
import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { addDays } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ArchetypeId } from '@/types/archetype';
import DeepDiveFormSection, { FormSchema, FormData } from './DeepDiveFormSection';
import DeepDiveBenefits from './DeepDiveBenefits';
import DeepDiveSuccessState from './DeepDiveSuccessState';
import RetakeAssessmentLink from './RetakeAssessmentLink';
import FormLayout from './FormLayout';

// Add Google Analytics gtag to the Window interface
declare global {
  interface Window {
    gtag?: (command: string, action: string, params: object) => void;
  }
}

// Session storage key for submitted report
const REPORT_SUBMITTED_KEY = 'healthcareArchetypeReportSubmitted';

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
  const navigate = useNavigate();
  
  // Debug logging to track what's being passed to the form
  console.log('DeepDiveFormContainer: Received props', {
    archetypeId,
    assessmentResult,
    assessmentAnswers,
    exactEmployeeCount: assessmentResult?.exactData?.employeeCount || null
  });
  
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
    setIsSubmitting(true);
    
    try {
      console.log('Submitting form with data:', data);
      console.log('Assessment result:', assessmentResult);
      console.log('Assessment answers:', assessmentAnswers);
      
      // Generate a unique ID for the report request
      const reportId = uuidv4();
      
      // Extract exact employee count from assessment results if available
      const exactEmployeeCount = assessmentResult?.exactData?.employeeCount || null;
      console.log('Extracted exact employee count:', exactEmployeeCount);
      
      // Generate access token and construct URL
      const accessToken = uuidv4();
      const generatedUrl = `${window.location.origin}/report/${archetypeId}/${accessToken}`;
      setAccessUrl(generatedUrl); // Store URL for potential display
      
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
          assessment_result: assessmentResult || null,
          assessment_answers: assessmentAnswers || null,
          exact_employee_count: exactEmployeeCount,
          access_url: generatedUrl
        })
        .select('id, access_token')
        .single();

      if (error) {
        console.error('Error details:', error);
        throw error;
      }
      
      console.log('Report request created successfully:', response);
      
      // Store submission record in session storage to prevent multiple submissions
      sessionStorage.setItem(REPORT_SUBMITTED_KEY, JSON.stringify({
        archetypeId: archetypeId,
        email: data.email,
        timestamp: new Date().toISOString()
      }));
      
      // Set the success state
      setSubmitSuccessful(true);
      setSubmittedEmail(data.email);
      
      // Track event
      window.gtag?.('event', 'deep_dive_request', {
        event_category: 'engagement',
        event_label: archetypeId
      });
      
      toast.success(`Report request submitted successfully. We've sent a link to ${data.email}.`);
      
    } catch (error: any) {
      console.error('Error submitting report request:', error);
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
    />
  );
};

export default DeepDiveFormContainer;
