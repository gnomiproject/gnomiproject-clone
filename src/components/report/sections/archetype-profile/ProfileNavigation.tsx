
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const ProfileNavigation: React.FC = () => {
  return (
    <div className="flex justify-between mt-8">
      <Button 
        variant="outline"
        onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })}
        className="flex items-center gap-2"
      >
        <ArrowLeft size={16} />
        <span>Back to Introduction</span>
      </Button>
      
      <Button 
        onClick={() => document.getElementById('recommendations')?.scrollIntoView({ behavior: 'smooth' })}
        className="flex items-center gap-2"
      >
        <span>Strategic Recommendations</span>
        <ArrowRight size={16} />
      </Button>
    </div>
  );
};

export default ProfileNavigation;
