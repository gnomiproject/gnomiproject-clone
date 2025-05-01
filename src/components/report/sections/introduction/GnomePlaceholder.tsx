
import React from 'react';
import WebsiteImage from '@/components/common/WebsiteImage';

interface GnomePlaceholderProps {
  type?: string;
  className?: string;
  altText?: string;
  showDebug?: boolean;
}

const GnomePlaceholder = ({ 
  type = 'chart', 
  className = 'h-full w-full object-contain p-4',
  altText,
  showDebug = false
}: GnomePlaceholderProps) => {
  return (
    <div className="flex items-center justify-center bg-gray-100 rounded-lg w-full h-full">
      <WebsiteImage 
        type={type} 
        className={className} 
        altText={altText || `Gnome ${type} illustration`}
      />
      {showDebug && (
        <div className="absolute top-0 left-0 bg-blue-500/80 text-white text-xs px-2 py-1 rounded-br">
          {type}
        </div>
      )}
    </div>
  );
};

export default GnomePlaceholder;
