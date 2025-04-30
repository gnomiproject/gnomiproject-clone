
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeepDiveSuccessStateProps {
  email: string;
  archetypeName: string;
  accessUrl?: string; // Keep the prop for backwards compatibility
  onResetForm: () => void;
}

const DeepDiveSuccessState = ({ 
  email, 
  archetypeName, 
  onResetForm 
}: DeepDiveSuccessStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-8 space-y-6">
      <div className="rounded-full bg-green-100 p-3">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-2xl font-semibold">Request Submitted Successfully!</h3>
        <p className="text-muted-foreground">
          Thank you for your interest in the {archetypeName} archetype.
        </p>
        <p className="font-medium">
          We've sent a confirmation to <span className="text-primary">{email}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Please check your email for information on how to receive your detailed report.
          You'll receive your report within 1-2 business days.
        </p>
      </div>
      
      <Button variant="outline" onClick={onResetForm}>
        Submit Another Request
      </Button>
    </div>
  );
};

export default DeepDiveSuccessState;
