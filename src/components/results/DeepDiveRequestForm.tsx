
import React, { useState } from 'react';
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
  const [accessUrl, setAccessUrl] = useState('');
  const navigate = useNavigate();
  
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

  const handleRetakeAssessment = () => {
    navigate('/assessment');
  };

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      console.log('Submitting form with data:', data);
      console.log('Assessment result:', assessmentResult);
      
      // Extract exact employee count from assessment results if available
      const exactEmployeeCount = assessmentResult?.exactData?.employeeCount || null;
      console.log('Extracted exact employee count:', exactEmployeeCount);
      
      const { data: response, error } = await supabase
        .from('report_requests')
        .insert({
          archetype_id: archetypeId,
          name: data.name,
          email: data.email,
          organization: data.organization || null,
          comments: data.comments || null,
          status: 'active',
          access_token: uuidv4(),
          created_at: new Date().toISOString(),
          expires_at: addDays(new Date(), 30).toISOString(),
          session_id: data.sessionId || null,
          assessment_result: assessmentResult || null,
          assessment_answers: assessmentAnswers || null,
          exact_employee_count: exactEmployeeCount
        })
        .select('access_token')
        .single();

      if (error) {
        throw error;
      }
      
      console.log('Report request created:', response);
      
      // Set the URL and show success state
      setSubmitSuccessful(true);
      setAccessUrl(`${window.location.origin}/report/${archetypeId}/${response.access_token}`);
      
      // Track event
      window.gtag?.('event', 'deep_dive_request', {
        event_category: 'engagement',
        event_label: archetypeId
      });
      
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
                <DeepDiveSuccessState accessUrl={accessUrl} />
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
