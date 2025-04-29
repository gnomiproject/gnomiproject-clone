
import React, { memo, useCallback } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationButtonsProps {
  previousSection: string;
  nextSection: string;
  previousSectionName: string;
  nextSectionName: string;
  onNavigate?: (sectionId: string) => void;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  previousSection,
  nextSection,
  previousSectionName,
  nextSectionName,
  onNavigate
}) => {
  // Using useCallback to prevent recreation of these functions on each render
  const handleNavigatePrevious = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(previousSection);
    }
  }, [onNavigate, previousSection]);

  const handleNavigateNext = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(nextSection);
    }
  }, [onNavigate, nextSection]);

  return (
    <div className="flex justify-between items-center mt-10 print:hidden">
      <Button
        variant="outline"
        onClick={handleNavigatePrevious}
        className="flex items-center gap-2"
        type="button"
      >
        <ArrowLeft className="h-4 w-4" /> 
        {previousSectionName}
      </Button>
      
      <Button
        onClick={handleNavigateNext}
        className="flex items-center gap-2"
        type="button"
      >
        {nextSectionName}
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Export with React.memo to prevent unnecessary re-renders
export default memo(NavigationButtons);
