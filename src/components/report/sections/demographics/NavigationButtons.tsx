
import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationButtonsProps {
  previousSection: string;
  nextSection: string;
  previousSectionName: string;
  nextSectionName: string;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  previousSection,
  nextSection,
  previousSectionName,
  nextSectionName
}) => {
  return (
    <div className="flex justify-between items-center mt-10 print:hidden">
      <Button
        variant="outline"
        onClick={() => {
          const element = document.getElementById(previousSection);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> 
        {previousSectionName}
      </Button>
      
      <Button
        onClick={() => {
          const element = document.getElementById(nextSection);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        className="flex items-center gap-2"
      >
        {nextSectionName}
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default NavigationButtons;
