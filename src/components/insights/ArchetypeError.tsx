
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ArchetypeErrorProps {
  message?: string; // Adding message prop as optional
  onRetry: () => void;
  onRetakeAssessment: () => void;
  isRetrying?: boolean; // Making isRetrying optional
}

const ArchetypeError = ({ 
  message = "We couldn't connect to the database to load your archetype data.", 
  onRetry, 
  onRetakeAssessment, 
  isRetrying = false 
}: ArchetypeErrorProps) => {
  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
      <div className="flex flex-col items-center gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div>
          <h3 className="text-xl font-semibold text-red-700">Connection Error</h3>
          <p className="text-red-600 mb-4">
            {message}
          </p>
        </div>
        
        <div className="flex gap-4 flex-col sm:flex-row">
          <Button 
            variant="outline" 
            onClick={onRetry}
            disabled={isRetrying}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} className={isRetrying ? "animate-spin" : ""} />
            {isRetrying ? "Connecting..." : "Retry Connection"}
          </Button>
          
          <Button 
            onClick={onRetakeAssessment}
            variant="secondary"
          >
            Retake Assessment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArchetypeError;
