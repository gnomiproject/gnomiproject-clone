
import React from 'react';
import { CheckCircle, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface DeepDiveSuccessStateProps {
  email: string;
  archetypeName: string;
  accessUrl?: string;
  onResetForm: () => void;
}

const DeepDiveSuccessState = ({ 
  email, 
  archetypeName, 
  accessUrl = '',
  onResetForm 
}: DeepDiveSuccessStateProps) => {
  const copyUrlToClipboard = () => {
    if (accessUrl) {
      navigator.clipboard.writeText(accessUrl)
        .then(() => {
          toast.success('Report URL copied to clipboard');
        })
        .catch(() => {
          toast.error('Failed to copy URL');
        });
    }
  };
  
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
          You'll receive your detailed report within 1-2 business days.
        </p>
      </div>
      
      {accessUrl && (
        <div className="w-full max-w-lg mt-6 bg-gray-50 p-4 rounded-md border">
          <div className="text-left mb-2 text-sm font-medium">Test your report with this URL:</div>
          <div className="flex gap-2 items-center">
            <input 
              type="text" 
              value={accessUrl} 
              readOnly 
              className="w-full px-3 py-2 border rounded-md text-sm bg-white"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={copyUrlToClipboard}
              className="flex-shrink-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            This URL will be active once your report is processed.
          </div>
        </div>
      )}
      
      <Button variant="outline" onClick={onResetForm}>
        Submit Another Request
      </Button>
    </div>
  );
};

export default DeepDiveSuccessState;
