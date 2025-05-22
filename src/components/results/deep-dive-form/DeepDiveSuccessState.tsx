
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeepDiveSuccessStateProps {
  email: string;
  accessUrl: string; // Make sure accessUrl is required
  onRetakeAssessment: () => void;
  onResetForm: () => void;
}

const DeepDiveSuccessState = ({ 
  email, 
  accessUrl, 
  onRetakeAssessment, 
  onResetForm 
}: DeepDiveSuccessStateProps) => {
  return (
    <div className="text-center py-4">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      
      <h3 className="text-xl font-semibold mb-2">Success! Your report is ready</h3>
      
      <p className="text-gray-600 mb-6">
        Thank you for requesting your detailed healthcare archetype report. 
        We've sent a confirmation email to <span className="font-medium">{email}</span>.
      </p>
      
      {/* Display the access URL with a link */}
      {accessUrl && (
        <div className="mb-6 p-4 bg-blue-50 rounded-md">
          <p className="text-blue-700 font-medium mb-2">
            Your report is accessible now:
          </p>
          <a 
            href={accessUrl}
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800 break-all"
          >
            {accessUrl}
          </a>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
        <Button
          variant="outline"
          onClick={onRetakeAssessment}
          className="w-full sm:w-auto"
        >
          Retake Assessment
        </Button>
        
        <Button
          variant="ghost"
          onClick={onResetForm}
          className="w-full sm:w-auto text-gray-600"
        >
          Reset Form
        </Button>
      </div>
    </div>
  );
};

export default DeepDiveSuccessState;
