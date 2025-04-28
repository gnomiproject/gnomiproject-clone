
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { v4 as uuidv4 } from 'uuid';
import { addDays } from 'date-fns';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ArchetypeId } from '@/types/archetype';

// Add Google Analytics gtag to the Window interface
declare global {
  interface Window {
    gtag?: (command: string, action: string, params: object) => void;
  }
}

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  organization: z.string().optional(),
  comments: z.string().optional(),
  sessionId: z.string().optional()
});

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
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      organization: "",
      comments: "",
      sessionId: localStorage.getItem('session_id') || ''
    },
  });

  const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
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

  return (
    <div className="bg-gray-50 p-6 rounded-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Request a Detailed Report</h3>
      {submitSuccessful ? (
        <div className="text-green-600">
          <p>Your request has been submitted successfully!</p>
          <p className="mt-2">You can access your report <a href={accessUrl} className="text-blue-500 underline">here</a>.</p>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your@email.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="organization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Organization" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comments (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any specific requirements or comments?"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default DeepDiveRequestForm;
