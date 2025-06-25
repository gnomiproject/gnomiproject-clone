
import React from 'react';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UnlockPlaceholderProps {
  name: string;
  onUnlock: () => void;
}

const UnlockPlaceholder: React.FC<UnlockPlaceholderProps> = ({ name, onUnlock }) => (
  <div className="py-16 px-4 text-center">
    <div className="relative inline-block mb-6">
      <div className="absolute w-16 h-16 bg-blue-100 rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      <Lock className="mx-auto h-12 w-12 text-blue-600 relative z-10" />
    </div>
    <h3 className="text-xl font-medium text-gray-800 mb-2">Premium Content Locked</h3>
    <p className="text-gray-600 max-w-md mx-auto mb-6">
      Unlock access to all detailed insights for your {name} archetype by providing a few details. No credit card required.
    </p>
    <Button 
      onClick={onUnlock}
      size="lg"
      className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-105"
    >
      Unlock Full Report
    </Button>
  </div>
);

export default UnlockPlaceholder;
