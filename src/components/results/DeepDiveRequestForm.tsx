import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ReportRequestForm from './premium-report/ReportRequestForm';
import ReportAccessLink from './premium-report/ReportAccessLink';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { ArchetypeDetailedData, ArchetypeId } from '@/types/archetype';

interface DeepDiveRequestFormProps {
  archetypeId: ArchetypeId;
  assessmentResult?: any;
  assessmentAnswers?: any;
  archetypeData?: ArchetypeDetailedData;
}

const DeepDiveRequestForm = ({ 
  archetypeId, 
  assessmentResult, 
  assessmentAnswers,
  archetypeData 
}: DeepDiveRequestFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accessLink, setAccessLink] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const onSubmit = async (values: any) => {
    setIsSubmitting(true);

    try {
      const token = uuidv4();
      
      console.log('Submitting deep dive report request for archetypeId:', archetypeId);
      
      // Store the request in the database to validate it later
      const { error } = await supabase.from('report_requests').insert({
        id: uuidv4(),
        name: values.name,
        email: values.email,
        organization: values.organization,
        archetype_id: archetypeId,
        access_token: token,
        status: 'pending',
        assessment_result: assessmentResult || null,
        assessment_answers: assessmentAnswers || null,
        created_at: new Date().toISOString(),
        // Set expiration to 30 days from now
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });

      if (error) {
        console.error('Error submitting report request:', error);
        throw new Error(error.message);
      }
      
      console.log('Deep dive report request submitted successfully with token:', token);
      
      const baseUrl = window.location.origin;
      // Make sure to use the correct route format for deep dive reports that includes token
      const reportLink = `${baseUrl}/report/${archetypeId}/${token}`;
      
      setAccessToken(token);
      setAccessLink(reportLink);
      
      toast.success("Report request submitted successfully!", {
        description: "Your secure link is ready below",
      });
      
    } catch (error: any) {
      console.error("Error submitting report request:", error);
      toast.error("There was a problem submitting your request", {
        description: error.message || "Please try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check for existing report token in session storage
  React.useEffect(() => {
    const checkExistingToken = async () => {
      try {
        // Check if we have a token for this archetype
        const { data, error } = await supabase
          .from('report_requests')
          .select('access_token')
          .eq('archetype_id', archetypeId)
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (error) {
          console.error('Error checking for existing report:', error);
          return;
        }
        
        // If we found a token, generate the link
        if (data && data.length > 0) {
          const token = data[0].access_token;
          const baseUrl = window.location.origin;
          const reportLink = `${baseUrl}/report/${archetypeId}/${token}`;
          
          setAccessToken(token);
          setAccessLink(reportLink);
          console.log('Using existing deep dive report token:', token);
        }
      } catch (err) {
        console.error('Error checking for existing report:', err);
      }
    };
    
    if (archetypeId && !accessToken) {
      checkExistingToken();
    }
  }, [archetypeId, accessToken]);

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="text-center">
        <CardTitle>Deep Dive Report</CardTitle>
        <CardDescription>
          Get a comprehensive analysis tailored to your organization
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!accessLink && (
          <ReportRequestForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
        )}
        {accessLink && (
          <>
            <Separator className="my-4" />
            <ReportAccessLink accessLink={accessLink} />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DeepDiveRequestForm;
