
import React, { useEffect, useState } from 'react';
import { gnomeImages, fallbackGnomeImage, fetchGnomeImages } from '@/utils/gnomeImages';

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
  const [src, setSrc] = useState<string>(fallbackGnomeImage);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch gnome images when component mounts
  useEffect(() => {
    const loadImages = async () => {
      try {
        await fetchGnomeImages();
        const imageSrc = getImageSource();
        console.log(`GnomeImage: Loading image for type "${type}" from source:`, imageSrc);
        setSrc(imageSrc);
      } catch (error) {
        console.error('Error loading gnome images:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadImages();
  }, [type]);
  
  // Get image source with fallback
  const getImageSource = () => {
    if (type && gnomeImages[type as any]) {
      return gnomeImages[type as any];
    }
    console.warn(`GnomeImage: Unknown type "${type}", using fallback`);
    return fallbackGnomeImage;
  };
  
  const handleError = () => {
    console.error(`Failed to load gnome image: ${src}`);
    if (!hasError) {
      setSrc(fallbackGnomeImage);
      setHasError(true);
    }
  };
  
  return (
    <div className="relative">
      {isLoading ? (
        <div className={`${className} bg-gray-100 animate-pulse flex items-center justify-center`}>
          <span className="text-gray-400">Loading...</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={className}
          onError={handleError}
        />
      )}
      {showDebug && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-1 text-xs">
          {hasError ? 'Using fallback' : `Type: ${type}, URL: ${src}`}
        </div>
      )}
    </div>
  );
};

export default GnomeImage;
