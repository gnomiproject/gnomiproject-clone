
import React from 'react';
import { gnomeImages, fallbackGnomeImage } from '@/utils/gnomeImages';

interface GnomeImageProps {
  type?: string;
  className?: string;
  alt?: string;
  showDebug?: boolean;
}

const GnomeImage: React.FC<GnomeImageProps> = ({ 
  type = 'placeholder', 
  className = 'h-48 object-contain', 
  alt = 'Healthcare Gnome',
  showDebug = false
}) => {
  // Get image source with fallback
  const getImageSource = () => {
    if (type && gnomeImages[type]) {
      return gnomeImages[type];
    }
    return fallbackGnomeImage;
  };
  
  const [src, setSrc] = React.useState<string>(getImageSource());
  const [hasError, setHasError] = React.useState(false);
  
  const handleError = () => {
    console.error(`Failed to load gnome image: ${src}`);
    if (!hasError) {
      setSrc(fallbackGnomeImage);
      setHasError(true);
    }
  };
  
  return (
    <div className="relative">
      <img
        src={src}
        alt={alt}
        className={className}
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
