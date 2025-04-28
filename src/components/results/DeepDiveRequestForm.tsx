
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ReportRequestForm from './premium-report/ReportRequestForm';
import RetakeAssessmentLink from '../insights/RetakeAssessmentLink';
import { FileText } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import GnomeImage from '@/components/common/GnomeImage';
import { Badge } from '@/components/ui/badge';

interface DeepDiveRequestFormProps {
  archetypeId: string;
  archetypeData: any;
  assessmentResult?: any;
  assessmentAnswers?: any;
}

const DeepDiveRequestForm = ({ 
  archetypeId, 
  archetypeData,
  assessmentResult,
  assessmentAnswers 
}: DeepDiveRequestFormProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onSubmit = async (values: any) => {
    setIsSubmitting(true);
    
    try {
      const token = uuidv4();
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      
      const { error } = await supabase.from('report_requests').insert({
        id: uuidv4(),
        name: values.name,
        email: values.email,
        organization: values.organization,
        comments: values.comments,
        archetype_id: archetypeId,
        access_token: token,
        status: 'pending',
        assessment_result: assessmentResult || null,
        assessment_answers: assessmentAnswers || null,
        created_at: new Date().toISOString(),
        expires_at: expiryDate.toISOString()
      });

      if (error) throw error;
      
      toast.success("Request submitted successfully!", {
        description: "Please check your email for the report access information.",
      });
      
    } catch (error: any) {
      console.error("Error submitting report request:", error);
      toast.error("There was a problem submitting your request", {
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <RetakeAssessmentLink />
      <Card className="border-0 shadow-none">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-bold mb-2">Want to go deeper on your archetype?</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 space-y-6">
                <div className="flex items-start gap-3">
                  <FileText className="h-6 w-6 mt-1 flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">
                        Get the Full {archetypeData.name} Report
                      </h3>
                      <Badge variant="secondary" className="bg-pink-100 text-pink-800 hover:bg-pink-100">
                        FREE
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-4">Deep Dive into This Archetype</p>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-2 text-gray-700">
                        <span className="text-red-500">✓</span>
                        Comprehensive profile of the {archetypeData.name} archetype
                      </li>
                      <li className="flex items-center gap-2 text-gray-700">
                        <span className="text-red-500">✓</span>
                        Detailed analysis of healthcare utilization, cost trends, and condition prevalence
                      </li>
                      <li className="flex items-center gap-2 text-gray-700">
                        <span className="text-red-500">✓</span>
                        Key behaviors, strengths, and blind spots that define this group
                      </li>
                      <li className="flex items-center gap-2 text-gray-700">
                        <span className="text-red-500">✓</span>
                        Strategic opportunities to optimize care, access, and spend
                      </li>
                      <li className="flex items-center gap-2 text-gray-700">
                        <span className="text-red-500">✓</span>
                        Insight into the methodology behind the archetype model
                      </li>
                    </ul>
                    <p className="text-gray-600 mt-6">
                      Unlock a richer understanding of your population—delivered straight to your inbox.
                    </p>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/3 flex-shrink-0">
                <GnomeImage 
                  type="presentation"
                  className="w-full h-auto"
                  alt="Healthcare gnome with presentation"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <ReportRequestForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default DeepDiveRequestForm;
