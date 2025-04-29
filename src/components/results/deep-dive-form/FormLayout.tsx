
import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import DeepDiveFormSection, { FormData } from './DeepDiveFormSection';
import DeepDiveBenefits from './DeepDiveBenefits';
import DeepDiveSuccessState from './DeepDiveSuccessState';
import RetakeAssessmentLink from './RetakeAssessmentLink';

interface FormLayoutProps {
  archetypeName: string;
  form: UseFormReturn<FormData>;
  submitSuccessful: boolean;
  submittedEmail: string;
  isSubmitting: boolean;
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
  onRetakeAssessment,
  onResetForm,
  onSubmit
}: FormLayoutProps) => {
  return (
    <div className="py-8 px-6 md:px-10 bg-gray-50">
      {/* Retake Assessment Link */}
      <RetakeAssessmentLink onRetakeAssessment={onRetakeAssessment} />

      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Want to go deeper on your archetype?</h2>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <DeepDiveBenefits archetypeName={archetypeName} />
              
              {submitSuccessful ? (
                <div className="space-y-4">
                  <DeepDiveSuccessState email={submittedEmail} />
                  
                  {/* Reset button (only shown after successful submission) */}
                  <Button 
                    onClick={onResetForm}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-6 py-3 rounded-md w-full md:w-auto"
                  >
                    Reset Form (Testing Only)
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={form.handleSubmit(onSubmit)} 
                  className="bg-red-800 hover:bg-red-900 text-white font-medium px-6 py-3 rounded-md w-full md:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Request your full report now"}
                </Button>
              )}

              <div className="md:hidden mt-8">
                {!submitSuccessful && (
                  <DeepDiveFormSection form={form} />
                )}
              </div>
            </div>
            
            {/* Form on desktop */}
            <div className="hidden md:block md:w-96">
              {!submitSuccessful && (
                <DeepDiveFormSection form={form} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormLayout;
