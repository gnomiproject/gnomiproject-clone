
import React from 'react';
import GnomeImage from '@/components/common/GnomeImage';

interface GnomePlaceholderProps {
  type?: string;
  className?: string;
  altText?: string;
  showDebug?: boolean;
}

const GnomePlaceholder = ({ 
  type = 'welcome', 
  className = 'h-full w-full object-contain p-4',
  altText,
  showDebug = false
}: GnomePlaceholderProps) => {
  return (
    <div className="flex items-center justify-center bg-gray-100 rounded-lg w-full h-full">
      <GnomeImage 
        type={type} 
        className={className} 
        alt={altText || `Gnome ${type} illustration`} // Changed from altText to alt to match expected prop
        showDebug={showDebug}
      />
    </div>
  );
};

export default GnomePlaceholder;
