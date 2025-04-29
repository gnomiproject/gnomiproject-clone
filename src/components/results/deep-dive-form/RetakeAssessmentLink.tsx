
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface RetakeAssessmentLinkProps {
  onRetakeClick: () => void;
}

const RetakeAssessmentLink = ({ onRetakeClick }: RetakeAssessmentLinkProps) => {
  return (
    <Button 
      onClick={onRetakeClick} 
      variant="ghost" 
      size="sm" 
      className="text-xs flex items-center gap-1 text-muted-foreground"
    >
      <RefreshCw className="h-3 w-3" />
      Retake assessment
    </Button>
  );
};

export default RetakeAssessmentLink;
