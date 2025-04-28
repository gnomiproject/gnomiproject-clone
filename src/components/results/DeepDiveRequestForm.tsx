
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
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  
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

  const handleRetakeAssessment = () => {
    navigate('/assessment');
  };

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

  // Get the archetype name from archetypeData if available
  const archetypeName = archetypeData?.name || '';

  return (
    <div className="py-8 px-6 md:px-10 bg-gray-50">
      {/* Retake Assessment Link */}
      <div className="max-w-5xl mx-auto mb-8 text-center">
        <p className="text-lg">
          Want to try again?{" "}
          <button 
            onClick={handleRetakeAssessment} 
            className="text-blue-600 font-medium hover:underline inline-flex items-center"
          >
            Retake the assessment
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
              <path d="m13 5 7 7-7 7"></path>
              <path d="M5 12h15"></path>
            </svg>
          </button>
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Want to go deeper on your archetype?</h2>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-4">
                <div className="text-red-600 font-bold">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" x2="8" y1="13" y2="13"></line>
                    <line x1="16" x2="8" y1="17" y2="17"></line>
                    <line x1="10" x2="8" y1="9" y2="9"></line>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Get the Full {archetypeName} Report</h3>
                  <div className="bg-red-50 text-red-800 text-xs font-semibold px-3 py-1 rounded-full inline-block mt-1">FREE</div>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">Deep Dive into This Archetype</p>
              
              <ul className="space-y-4 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 pt-1">✓</span>
                  <span>Comprehensive profile of the {archetypeName} archetype</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 pt-1">✓</span>
                  <span>Detailed analysis of healthcare utilization, cost trends, and condition prevalence</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 pt-1">✓</span>
                  <span>Key behaviors, strengths, and blind spots that define this group</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 pt-1">✓</span>
                  <span>Strategic opportunities to optimize care, access, and spend</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 pt-1">✓</span>
                  <span>Insight into the methodology behind the archetype model</span>
                </li>
              </ul>
              
              <p className="text-gray-700 mb-6">Unlock a richer understanding of your population—delivered straight to your inbox.</p>
              
              {submitSuccessful ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-green-800">
                  <h4 className="font-semibold text-lg mb-2">Thank You!</h4>
                  <p className="mb-3">Your request has been submitted successfully!</p>
                  <p>You can access your report <a href={accessUrl} className="text-blue-600 underline font-medium">here</a>.</p>
                </div>
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
                  <Form {...form}>
                    <form className="space-y-4">
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
                    </form>
                  </Form>
                )}
              </div>
            </div>
            
            {/* Form on desktop */}
            <div className="hidden md:block md:w-96">
              {!submitSuccessful && (
                <Form {...form}>
                  <form className="space-y-4">
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
                  </form>
                </Form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeepDiveRequestForm;
