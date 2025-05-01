
import React from 'react';
import ImageByName from './ImageByName';
import { fallbackGnomeImage } from '@/utils/gnomeImages';

interface GnomeImageProps {
  type?: string;
  className?: string;
  alt?: string;
  showDebug?: boolean;
  width?: number;
  height?: number;
}

const GnomeImage: React.FC<GnomeImageProps> = ({ 
  type = 'placeholder', 
  className = 'h-48 object-contain', 
  alt = 'Healthcare Gnome',
  showDebug = false,
  width,
  height
}) => {
  const [hasError, setHasError] = React.useState(false);
  
  const handleError = () => {
    console.error(`Failed to load gnome image: ${type}`);
    setHasError(true);
  };
  
  return (
    <div className="relative">
      <ImageByName
        imageName={type}
        altText={alt}
        className={className}
        width={width}
        height={height}
        fallbackSrc={fallbackGnomeImage}
        onError={handleError}
      />
      
      {showDebug && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-1 text-xs">
          {hasError ? 'Using fallback' : `Type: ${type}`}
        </div>
      )}
    </div>
  );
};

export default GnomeImage;
