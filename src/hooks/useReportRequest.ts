
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

interface ReportRequestFormData {
  name: string;
  email: string;
  organization: string;
  archetype_id: string;
  comments?: string;
  exact_employee_count?: number;
  assessment_result?: any;
  assessment_answers?: any;
  session_id?: string;
}

interface UseReportRequestResult {
  submitRequest: (data: ReportRequestFormData) => Promise<{ success: boolean; requestId?: string }>;
  isSubmitting: boolean;
  error: Error | null;
}

/**
 * Hook to handle report request form submissions
 * Creates a report request in the database with "pending" status
 * The scheduled edge function will pick it up and send the email
 */
export function useReportRequest(): UseReportRequestResult {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submitRequest = async (formData: ReportRequestFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Generate a random access token (this is what the user will use to access the report)
      const accessToken = crypto.randomUUID().replace(/-/g, '');
      
      // Set expiration date to 30 days from now
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);
      
      // Create the report request in the database
      const { data, error } = await supabase
        .from('report_requests')
        .insert({
          name: formData.name,
          email: formData.email,
          organization: formData.organization,
          archetype_id: formData.archetype_id,
          comments: formData.comments || '',
          exact_employee_count: formData.exact_employee_count,
          assessment_result: formData.assessment_result,
          assessment_answers: formData.assessment_answers,
          session_id: formData.session_id || null,
          access_token: accessToken,
          status: 'pending', // This will be picked up by the scheduled function
          created_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
          source: 'report_request_form' // Add source to track origin
        })
        .select('id')
        .single();
      
      if (error) {
        throw new Error(`Failed to submit report request: ${error.message}`);
      }
      
      toast.success('Report request submitted successfully!', {
        description: 'You will receive an email once your report is ready.'
      });
      
      return { 
        success: true,
        requestId: data?.id
      };
    } catch (err: any) {
      const errorMessage = err.message || 'An unknown error occurred';
      console.error('Error submitting report request:', err);
      setError(err);
      
      toast.error('Failed to submit report request', {
        description: errorMessage
      });
      
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitRequest,
    isSubmitting,
    error
  };
}
