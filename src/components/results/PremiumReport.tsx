
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Copy } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { v4 as uuidv4 } from 'uuid';

interface PremiumReportProps {
  archetypeId: string;
  assessmentResult?: any;
  assessmentAnswers?: any;
  archetypeData?: any;  // Adding archetypeData prop to match usage in AssessmentResultsCard
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  organization: z.string().min(2, {
    message: "Organization must be at least 2 characters.",
  }),
  comments: z.string().optional(),
});

const PremiumReport = ({ archetypeId, assessmentResult, assessmentAnswers, archetypeData }: PremiumReportProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accessLink, setAccessLink] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      organization: "",
      comments: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      // Generate a unique access token
      const token = uuidv4();
      
      console.log('Requesting full report:', {
        ...values,
        archetypeId,
        assessmentResult,
        assessmentAnswers,
        accessToken: token,
      });
      
      // In a real implementation, this would be inserted into the report_requests table
      // But since we're working with existing tables, we'll just simulate it
      
      // Create an access link that would normally come from the database
      const baseUrl = window.location.origin;
      const reportLink = `${baseUrl}/archetype-report/${archetypeId}?token=${token}`;
      
      setAccessToken(token);
      setAccessLink(reportLink);
      
      toast({
        title: "Report Request Submitted",
        description: "Your request for a detailed report has been received.",
      });
      
    } catch (error) {
      console.error("Error submitting report request:", error);
      toast({
        title: "Error",
        description: "There was a problem submitting your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    if (accessLink) {
      navigator.clipboard.writeText(accessLink);
      toast({
        title: "Copied to clipboard",
        description: "The access link has been copied to your clipboard.",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Request Full Report</CardTitle>
        <CardDescription>
          Provide your details to receive a comprehensive report.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
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
                    <Input placeholder="johndoe@example.com" {...field} />
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
                    <Input placeholder="Acme Corp" {...field} />
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
                  <FormLabel>Comments</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any specific requirements?"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Request Report
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      {accessLink && (
        <>
          <Separator className="my-4" />
          <CardContent>
            <CardTitle>Access Your Report</CardTitle>
            <CardDescription>
              Use the link below to access your full report.
            </CardDescription>
            <div className="mt-4 flex items-center">
              <Input
                type="text"
                value={accessLink}
                readOnly
                className="mr-2"
              />
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Please save this link as it is unique to your request.
            </p>
          </CardContent>
        </>
      )}
      <CardFooter></CardFooter>
    </Card>
  );
};

export default PremiumReport;
