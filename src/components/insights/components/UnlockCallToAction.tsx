
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UnlockCallToActionProps {
  name: string;
  onUnlock: () => void;
}

const UnlockCallToAction: React.FC<UnlockCallToActionProps> = ({ name, onUnlock }) => (
  <div className="mt-8 p-4 border border-blue-100 bg-blue-50 rounded-lg flex flex-col md:flex-row md:items-center gap-4">
    <div className="flex-1">
      <h3 className="text-blue-800 font-medium flex items-center gap-2">
        <AlertCircle className="w-5 h-5" />
        Unlock your complete {name} archetype insights
      </h3>
      <p className="text-blue-700 mt-1">
        Get access to detailed metrics and strategic insights by providing a few details.
      </p>
    </div>
    <Button 
      onClick={onUnlock}
      className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-105"
    >
      Unlock Full Report
    </Button>
  </div>
);

export default UnlockCallToAction;
