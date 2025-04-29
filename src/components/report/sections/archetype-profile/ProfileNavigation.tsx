
import React, { memo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface ProfileNavigationProps {
  onNavigate?: (sectionId: string) => void;
}

const ProfileNavigation: React.FC<ProfileNavigationProps> = ({ onNavigate }) => {
  // Using useCallback to prevent recreation of these functions on each render
  const handleNavigateIntroduction = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('introduction');
    }
  }, [onNavigate]);

  const handleNavigateRecommendations = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('recommendations');
    }
  }, [onNavigate]);

  return (
    <div className="flex justify-between mt-8">
      <Button 
        variant="outline"
        onClick={handleNavigateIntroduction}
        className="flex items-center gap-2"
        type="button"
      >
        <ArrowLeft size={16} />
        <span>Back to Introduction</span>
      </Button>
      
      <Button 
        onClick={handleNavigateRecommendations}
        className="flex items-center gap-2"
        type="button"
      >
        <span>Strategic Recommendations</span>
        <ArrowRight size={16} />
      </Button>
    </div>
  );
};

// Export with React.memo to prevent unnecessary re-renders
export default memo(ProfileNavigation);
