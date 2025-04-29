
import React from 'react';
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
  const handleNavigation = (e: React.MouseEvent<HTMLButtonElement>, sectionId: string) => {
    e.preventDefault();
    
    if (onNavigate) {
      onNavigate(sectionId);
    } else {
      // Fallback to direct DOM manipulation if no onNavigate provided
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="flex justify-between items-center mt-10 print:hidden">
      <Button
        variant="outline"
        onClick={(e) => handleNavigation(e, previousSection)}
        className="flex items-center gap-2"
        type="button"
      >
        <ArrowLeft className="h-4 w-4" /> 
        {previousSectionName}
      </Button>
      
      <Button
        onClick={(e) => handleNavigation(e, nextSection)}
        className="flex items-center gap-2"
        type="button"
      >
        {nextSectionName}
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default NavigationButtons;
