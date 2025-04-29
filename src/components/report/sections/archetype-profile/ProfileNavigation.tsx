
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface ProfileNavigationProps {
  onNavigate?: (sectionId: string) => void;
}

const ProfileNavigation: React.FC<ProfileNavigationProps> = ({ onNavigate }) => {
  const handleNavigation = (e: React.MouseEvent<HTMLButtonElement>, sectionId: string) => {
    e.preventDefault();
    
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
    <div className="flex justify-between mt-8">
      <Button 
        variant="outline"
        onClick={(e) => handleNavigation(e, 'introduction')}
        className="flex items-center gap-2"
        type="button"
      >
        <ArrowLeft size={16} />
        <span>Back to Introduction</span>
      </Button>
      
      <Button 
        onClick={(e) => handleNavigation(e, 'recommendations')}
        className="flex items-center gap-2"
        type="button"
      >
        <span>Strategic Recommendations</span>
        <ArrowRight size={16} />
      </Button>
    </div>
  );
};

export default ProfileNavigation;
