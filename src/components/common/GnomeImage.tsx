
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
  const [imageName, setImageName] = React.useState(type);
  
  // Normalize image type
  React.useEffect(() => {
    // This ensures we're always using a valid image name
    setImageName(type || 'placeholder');
  }, [type]);
  
  const handleError = () => {
    console.error(`[GnomeImage] Failed to load gnome image: ${type}`);
    setHasError(true);
  };

  return (
    <div className="relative">
      <ImageByName
        imageName={imageName}
        altText={alt}
        className={className}
        width={width}
        height={height}
        fallbackSrc={fallbackGnomeImage}
        onError={handleError}
      />
      
      {(showDebug || hasError) && (
        <div className={`absolute bottom-0 left-0 right-0 ${hasError ? 'bg-red-800/70' : 'bg-black/70'} text-white p-1 text-xs`}>
          {hasError ? `Failed: ${type} (using fallback)` : `Type: ${type}`}
        </div>
      )}
    </div>
  );
};

export default GnomeImage;
