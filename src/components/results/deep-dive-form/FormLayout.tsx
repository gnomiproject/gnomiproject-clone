
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormData } from './DeepDiveFormSection';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DeepDiveFormSection from './DeepDiveFormSection';
import DeepDiveBenefits from './DeepDiveBenefits';
import DeepDiveSuccessState from './DeepDiveSuccessState';
import RetakeAssessmentLink from './RetakeAssessmentLink';

interface FormLayoutProps {
  archetypeName: string;
  form: UseFormReturn<FormData>;
  submitSuccessful: boolean;
  submittedEmail: string;
  isSubmitting: boolean;
  accessUrl: string; // Added to properly pass the access URL
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
  accessUrl,
  onRetakeAssessment,
  onResetForm,
  onSubmit,
}: FormLayoutProps) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left column: Form or success message */}
        <div className="md:col-span-7">
          <Card className="p-6 bg-white shadow-sm">
            <div className="space-y-6">
              {submitSuccessful ? (
                <DeepDiveSuccessState 
                  email={submittedEmail} 
                  onRetakeAssessment={onRetakeAssessment}
                  onResetForm={onResetForm} 
                  accessUrl={accessUrl} // Pass the access URL to the success component
                />
              ) : (
                <DeepDiveFormSection
                  form={form}
                  onSubmit={onSubmit}
                  isSubmitting={isSubmitting}
                  archetypeName={archetypeName}
                />
              )}
            </div>
          </Card>
        </div>
        
        {/* Right column: Benefits */}
        <div className="md:col-span-5">
          <div className="sticky top-6">
            <DeepDiveBenefits archetypeName={archetypeName} />
            
            {/* Add retake assessment link at bottom of benefits section */}
            <div className="mt-6 text-center">
              <Button 
                variant="ghost" 
                onClick={onRetakeAssessment}
                className="text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              >
                Retake assessment instead
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormLayout;
