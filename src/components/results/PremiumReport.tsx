
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { ArchetypeDetailedData, ArchetypeId } from '@/types/archetype';
import ReportRequestForm, { FormData } from './premium-report/ReportRequestForm';
import ReportAccessLink from './premium-report/ReportAccessLink';

interface PremiumReportProps {
  archetypeId: ArchetypeId;
  assessmentResult?: any;
  assessmentAnswers?: any;
  archetypeData?: ArchetypeDetailedData;
}

const PremiumReport = ({ archetypeId, assessmentResult, assessmentAnswers, archetypeData }: PremiumReportProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accessLink, setAccessLink] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { toast } = useToast();

  const onSubmit = async (values: FormData) => {
    setIsSubmitting(true);

    try {
      const token = uuidv4();
      
      console.log('Requesting full report:', {
        ...values,
        archetypeId,
        assessmentResult,
        assessmentAnswers,
        accessToken: token,
      });
      
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Full Report - Free & Comprehensive</CardTitle>
        <CardDescription>
          Unlock Deep Insights at No Cost - Packed with Strategic Recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
          <p className="text-blue-800 font-semibold">
            🔍 Full Report: Completely Free & Insight-Packed
          </p>
          <p className="text-blue-700 text-sm mt-2">
            Gain actionable strategic insights tailored to your organization's unique profile
          </p>
        </div>
        <ReportRequestForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
      </CardContent>
      {accessLink && (
        <>
          <Separator className="my-4" />
          <ReportAccessLink accessLink={accessLink} />
        </>
      )}
      <CardFooter>
        <p className="text-xs text-gray-500 text-center w-full">
          Your detailed, personalized report will be delivered directly to your email
        </p>
      </CardFooter>
    </Card>
  );
};

export default PremiumReport;
