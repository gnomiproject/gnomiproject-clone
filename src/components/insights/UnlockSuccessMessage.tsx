
import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface UnlockSuccessMessageProps {
  archetypeName: string;
}

const UnlockSuccessMessage: React.FC<UnlockSuccessMessageProps> = ({ archetypeName }) => {
  return (
    <div className="mt-6 mb-4 p-4 bg-green-50 border border-green-100 rounded-lg">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
        <div>
          <h3 className="font-medium text-green-800">Full report unlocked!</h3>
          <p className="text-green-700 text-sm mt-1">
            You now have complete access to all {archetypeName} insights. 
            A copy of your report will also be delivered to your email shortly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnlockSuccessMessage;
