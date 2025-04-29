
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface DeepDiveSuccessStateProps {
  accessUrl?: string; // Make this optional since we won't display it directly
  email?: string; // Add email prop to personalize the message
}

const DeepDiveSuccessState = ({ email }: DeepDiveSuccessStateProps) => {
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-emerald-200 rounded-lg p-6 text-emerald-800 shadow-sm">
      <div className="flex flex-col items-center text-center mb-2">
        <CheckCircle className="h-12 w-12 text-emerald-500 mb-3" />
        <h4 className="font-semibold text-xl mb-2">Thank You!</h4>
      </div>
      
      <div className="space-y-3">
        <p className="text-center">Your request has been submitted successfully!</p>
        
        <div className="bg-white rounded-md p-4 border border-emerald-100">
          <p className="text-gray-700">
            {email ? (
              <>We've sent details on how to access your full report to <span className="font-medium">{email}</span>.</>
            ) : (
              <>Please check your email for information about how to access your report.</>
            )}
          </p>
        </div>
        
        <p className="text-sm text-gray-600 text-center">
          Your personalized report is being prepared and will be ready shortly.
        </p>
      </div>
    </div>
  );
};

export default DeepDiveSuccessState;
