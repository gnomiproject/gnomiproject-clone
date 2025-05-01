
import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DeepDiveFormSection, { FormData } from './DeepDiveFormSection';
import DeepDiveBenefits from './DeepDiveBenefits';
import RetakeAssessmentLink from './RetakeAssessmentLink';
import DeepDiveSuccessState from './DeepDiveSuccessState';

interface FormLayoutProps {
  archetypeName: string;
  form: UseFormReturn<FormData>;
  submitSuccessful: boolean;
  submittedEmail: string;
  isSubmitting: boolean;
  accessUrl?: string;
  onRetakeAssessment: () => void;
  onResetForm: () => void;
  onSubmit: (data: FormData) => Promise<void>;
}

const FormLayout = ({
  archetypeName,
  form,
  submitSuccessful,
  submittedEmail,
  isSubmitting,
  accessUrl = '',
  onRetakeAssessment,
  onResetForm,
  onSubmit
}: FormLayoutProps) => {
  // Always log this, not conditionally
  console.log("[FormLayout] Rendering with submitSuccessful:", submitSuccessful);
  
  return (
    <div className="flex flex-col space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl flex items-center justify-between">
            Get your {archetypeName} Deep Dive Report
            <span className="print:hidden">
              <RetakeAssessmentLink onRetakeClick={onRetakeAssessment} />
            </span>
          </CardTitle>
          <CardDescription>
            Complete the form below to receive your personalized report.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {submitSuccessful ? (
            <DeepDiveSuccessState 
              email={submittedEmail} 
              archetypeName={archetypeName}
              accessUrl={accessUrl}
              onResetForm={onResetForm}
            />
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <DeepDiveFormSection 
                  form={form} 
                  onSubmit={onSubmit}
                  isSubmitting={isSubmitting}
                />
              </div>
              <div>
                <DeepDiveBenefits archetypeName={archetypeName} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FormLayout;
