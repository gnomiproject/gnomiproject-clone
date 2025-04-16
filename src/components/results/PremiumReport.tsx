
import React, { useState } from 'react';
import Button from '@/components/shared/Button';
import { ArchetypeDetailedData } from '@/types/archetype';
import { FileText, Link as LinkIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from 'react-router-dom';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Storage key for assessment answers
const SESSION_ANSWERS_KEY = 'healthcareArchetypeAnswers';
const SESSION_EXACT_EMPLOYEE_COUNT_KEY = 'healthcareArchetypeExactEmployeeCount';

interface PremiumReportProps {
  archetypeData: ArchetypeDetailedData;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  organization: z.string().min(2, { message: "Organization name must be at least 2 characters." }),
  comments: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const PremiumReport = ({ archetypeData }: PremiumReportProps) => {
  const color = `archetype-${archetypeData.id}`;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { toast } = useToast();
  const location = useLocation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      organization: "",
      comments: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Get assessment result from location state
      const assessmentResult = location.state?.result;
      // Get assessment answers from sessionStorage using the correct key
      const answersString = sessionStorage.getItem(SESSION_ANSWERS_KEY);
      const answers = answersString ? JSON.parse(answersString) : {};
      
      // Get exact employee count from sessionStorage
      const exactEmployeeCountString = sessionStorage.getItem(SESSION_EXACT_EMPLOYEE_COUNT_KEY);
      const exactEmployeeCount = exactEmployeeCountString ? Number(exactEmployeeCountString) : null;
      
      console.log('Submitting report request with answers:', answers);
      console.log('Assessment result:', assessmentResult);
      console.log('Exact employee count:', exactEmployeeCount);

      const { data: insertedData, error } = await supabase
        .from('report_requests')
        .insert({
          name: data.name,
          email: data.email,
          organization: data.organization,
          comments: data.comments,
          archetype_id: archetypeData.id,
          assessment_answers: {
            ...answers,
            exactEmployeeCount: exactEmployeeCount
          },
          assessment_result: assessmentResult
        })
        .select('access_token')
        .single();

      if (error) throw error;
      
      // Store the access token for displaying the link
      if (insertedData && insertedData.access_token) {
        setAccessToken(insertedData.access_token);
      }

      setIsSubmitted(true);
      toast({
        title: "Report Request Submitted",
        description: "We'll send your full archetype report to your email shortly.",
      });
    } catch (error) {
      console.error('Error submitting report request:', error);
      toast({
        title: "Error",
        description: "There was a problem submitting your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    form.reset();
    setIsSubmitted(false);
    setAccessToken(null);
    setIsDialogOpen(false);
  };

  // Generate deep report URL (for development purposes)
  const getDeepReportUrl = () => {
    if (!accessToken) return '';
    const baseUrl = window.location.origin;
    return `${baseUrl}/deep-report?token=${accessToken}`;
  };

  return (
    <div className="bg-gray-50 px-8 py-12 border-t">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Want to go deeper on your archetype?</h2>
        
        <div className="bg-white rounded-lg border p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <FileText className={`text-${color} h-6 w-6`} />
                <h3 className="text-xl font-bold">
                  Get the Full Engaged {archetypeData.name} Report
                </h3>
                <span className={`bg-${color}/10 text-${color} text-xs px-3 py-1 rounded-full font-medium`}>FREE</span>
              </div>
              
              <p className="text-gray-700 mb-6 text-left">
                Deep Dive into This Archetype
              </p>

              <ul className="space-y-6 text-left mb-6">
                <li className="flex items-start">
                  <span className={`text-${color} mr-3 flex-shrink-0 text-lg`}>✓</span>
                  <span>Comprehensive profile of the {archetypeData.name} archetype</span>
                </li>
                <li className="flex items-start">
                  <span className={`text-${color} mr-3 flex-shrink-0 text-lg`}>✓</span>
                  <span>Detailed analysis of healthcare utilization, cost trends, and condition prevalence</span>
                </li>
                <li className="flex items-start">
                  <span className={`text-${color} mr-3 flex-shrink-0 text-lg`}>✓</span>
                  <span>Key behaviors, strengths, and blind spots that define this group</span>
                </li>
                <li className="flex items-start">
                  <span className={`text-${color} mr-3 flex-shrink-0 text-lg`}>✓</span>
                  <span>Strategic opportunities to optimize care, access, and spend</span>
                </li>
                <li className="flex items-start">
                  <span className={`text-${color} mr-3 flex-shrink-0 text-lg`}>✓</span>
                  <span>Insight into the methodology behind the archetype model</span>
                </li>
              </ul>
              
              <p className="text-gray-600 mb-6 text-left">
                Unlock a richer understanding of your population—delivered straight to your inbox.
              </p>
              
              <Button 
                className={`bg-${color} hover:bg-${color}/90 text-white w-full lg:w-auto px-8`}
                onClick={() => setIsDialogOpen(true)}
              >
                Request your full report now
              </Button>
            </div>
            
            <div className="hidden lg:flex flex-col justify-center items-center">
              <img 
                src="/lovable-uploads/a1c0aade-d5e8-4602-b139-27202ba32c31.png" 
                alt="Data gnome" 
                className="w-48 h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {isSubmitted ? "Thank You!" : `Request Your Full ${archetypeData.name} Report`}
            </DialogTitle>
            <DialogDescription>
              {isSubmitted 
                ? "Your report request has been received. We'll send it to your email shortly." 
                : "Please fill out the form below to receive your comprehensive archetype report."}
            </DialogDescription>
          </DialogHeader>
          
          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-center text-gray-600 mb-6">
                Thanks for your interest in the {archetypeData.name} archetype! We'll email your report to you shortly.
              </p>
              
              {/* For development: Show secure access link */}
              {accessToken && (
                <div className="w-full bg-gray-50 p-4 rounded-lg mb-6 border border-dashed">
                  <p className="text-sm text-gray-500 mb-2">For development purposes only:</p>
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-blue-500" />
                    <a 
                      href={getDeepReportUrl()}
                      className="text-blue-500 hover:underline text-sm break-all"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {getDeepReportUrl()}
                    </a>
                  </div>
                </div>
              )}
              
              <Button 
                className={`bg-${color} hover:bg-${color}/90 text-white px-8`}
                onClick={resetForm}
              >
                Close
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
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
                        <Input type="email" placeholder="your.email@company.com" {...field} />
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
                      <FormLabel>Organization</FormLabel>
                      <FormControl>
                        <Input placeholder="Your company or organization" {...field} />
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
                      <FormLabel>Additional Comments (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any specific aspects of the archetype you're interested in..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="mr-2"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className={`bg-${color} hover:bg-${color}/90 text-white`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PremiumReport;
