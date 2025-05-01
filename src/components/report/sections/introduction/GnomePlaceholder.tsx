
import React from 'react';
import ImageByName from '@/components/common/ImageByName';

interface GnomePlaceholderProps {
  type?: string;
}

const GnomePlaceholder = ({ type = 'welcome' }: GnomePlaceholderProps) => {
  return (
    <div className="flex items-center justify-center bg-gray-100 rounded-lg w-full h-full">
      <ImageByName 
        imageName={type} 
        altText={`Gnome ${type} illustration`} 
        className="h-full w-full object-contain p-4" 
        fallbackSrc="/assets/gnomes/placeholder.svg"
      />
    </div>
  );
};

export default GnomePlaceholder;
