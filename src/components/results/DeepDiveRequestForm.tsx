
import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from 'uuid';
import { addDays } from 'date-fns';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ArchetypeId } from '@/types/archetype';
import { useNavigate } from 'react-router-dom';
import DeepDiveFormSection, { FormSchema, FormData } from './deep-dive-form/DeepDiveFormSection';
import DeepDiveBenefits from './deep-dive-form/DeepDiveBenefits';
import DeepDiveSuccessState from './deep-dive-form/DeepDiveSuccessState';
import RetakeAssessmentLink from './deep-dive-form/RetakeAssessmentLink';

// Add Google Analytics gtag to the Window interface
declare global {
  interface Window {
    gtag?: (command: string, action: string, params: object) => void;
  }
}

// Session storage key for submitted report
const REPORT_SUBMITTED_KEY = 'healthcareArchetypeReportSubmitted';

interface DeepDiveRequestFormProps {
  archetypeId: ArchetypeId;
  assessmentResult?: any;
  assessmentAnswers?: any;
  archetypeData?: any;
}

const DeepDiveRequestForm = ({ 
  archetypeId, 
  assessmentResult,
  assessmentAnswers,
  archetypeData 
}: DeepDiveRequestFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccessful, setSubmitSuccessful] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [accessUrl, setAccessUrl] = useState('');
  const navigate = useNavigate();
  
  // Debug logging to track what's being passed to the form
  console.log('DeepDiveRequestForm: Received props', {
    archetypeId,
    assessmentResult,
    assessmentAnswers
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
          id: reportId, // Explicitly set the ID
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
    <div className="py-8 px-6 md:px-10 bg-gray-50">
      {/* Retake Assessment Link */}
      <RetakeAssessmentLink onRetakeAssessment={handleRetakeAssessment} />

      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Want to go deeper on your archetype?</h2>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <DeepDiveBenefits archetypeName={archetypeName} />
              
              {submitSuccessful ? (
                <DeepDiveSuccessState email={submittedEmail} />
              ) : (
                <Button 
                  onClick={form.handleSubmit(handleSubmit)} 
                  className="bg-red-800 hover:bg-red-900 text-white font-medium px-6 py-3 rounded-md w-full md:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Request your full report now"}
                </Button>
              )}

              <div className="md:hidden mt-8">
                {!submitSuccessful && (
                  <DeepDiveFormSection form={form} />
                )}
              </div>
            </div>
            
            {/* Form on desktop */}
            <div className="hidden md:block md:w-96">
              {!submitSuccessful && (
                <DeepDiveFormSection form={form} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeepDiveRequestForm;
