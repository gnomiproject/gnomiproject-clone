
import React from 'react';
import GnomeImage from '@/components/common/GnomeImage';

interface GnomePlaceholderProps {
  type?: string;
}

const GnomePlaceholder = ({ type = 'welcome' }: GnomePlaceholderProps) => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <GnomeImage 
        type={type} 
        className="w-full h-full object-contain" 
        alt={`Healthcare Gnome (${type})`}
      />
    </div>
  );
};

export default GnomePlaceholder;
