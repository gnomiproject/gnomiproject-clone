
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
  const handleNavigation = (sectionId: string) => {
    if (onNavigate) {
      onNavigate(sectionId);
    } else {
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
        onClick={() => handleNavigation(previousSection)}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> 
        {previousSectionName}
      </Button>
      
      <Button
        onClick={() => handleNavigation(nextSection)}
        className="flex items-center gap-2"
      >
        {nextSectionName}
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default NavigationButtons;
