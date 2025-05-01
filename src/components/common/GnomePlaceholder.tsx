
import React from 'react';
import { fallbackGnomeImage } from '@/utils/gnomeImages';
import GnomeImage from './GnomeImage';

interface GnomePlaceholderProps {
  type?: string;
  className?: string;
  alt?: string;
  showDebugInfo?: boolean;
}

const GnomePlaceholder: React.FC<GnomePlaceholderProps> = ({ 
  type = 'charts', 
  className = 'h-full w-full object-contain p-4',
  alt = 'Gnome illustration',
  showDebugInfo = false
}) => {
  return (
    <div className="flex items-center justify-center bg-gray-100 rounded-lg w-full h-full relative">
      <GnomeImage 
        type={type} 
        alt={alt} // Fixed: was using altText which doesn't match the prop in GnomeImage
        className={className} 
        showDebug={showDebugInfo}
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
