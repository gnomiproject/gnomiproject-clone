
import React from 'react';
import WebsiteImage from './WebsiteImage';

interface GnomePlaceholderProps {
  type?: string;
  className?: string;
  alt?: string;
  showDebugInfo?: boolean;
}

const GnomePlaceholder: React.FC<GnomePlaceholderProps> = ({ 
  type = 'chart', 
  className = 'h-full w-full object-contain p-4',
  alt = 'Gnome illustration',
  showDebugInfo = false
}) => {
  return (
    <div className="flex items-center justify-center bg-gray-100 rounded-lg w-full h-full relative">
      <WebsiteImage 
        type={type} 
        altText={alt}
        className={className}
      />
      
      {showDebugInfo && (
        <div className="absolute top-0 left-0 right-0 bg-blue-500/70 text-white text-xs p-1">
          GnomePlaceholder: {type}
        </div>
      )}
    </div>
  );
};

export default GnomePlaceholder;
