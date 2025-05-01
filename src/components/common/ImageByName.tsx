
import React, { useState, useEffect } from 'react';
import { getImageByName } from '@/services/imageService';
import { fallbackGnomeImage } from '@/utils/gnomeImages';

interface ImageByNameProps {
  imageName: string;
  altText?: string;
  className?: string;
  fallbackSrc?: string;
}

const ImageByName: React.FC<ImageByNameProps> = ({
  imageName,
  altText = 'Gnome Image',
  className = 'h-40 w-40 object-contain',
  fallbackSrc = fallbackGnomeImage
}) => {
  const [src, setSrc] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    let isMounted = true;
    
    const loadImage = async () => {
      if (!imageName) {
        if (isMounted) {
          setSrc(fallbackSrc);
          setLoading(false);
        }
        return;
      }
      
      try {
        setLoading(true);
        const imageUrl = await getImageByName(imageName);
        
        if (isMounted) {
          if (imageUrl) {
            setSrc(imageUrl);
            setError(false);
          } else {
            setSrc(fallbackSrc);
            setError(true);
            console.warn(`ImageByName: No image found for '${imageName}', using fallback`);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error(`ImageByName: Error loading '${imageName}':`, err);
          setSrc(fallbackSrc);
          setError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    loadImage();
    
    return () => {
      isMounted = false;
    };
  }, [imageName, fallbackSrc]);
  
  const handleError = () => {
    console.warn(`ImageByName: Error displaying image '${imageName}', falling back to placeholder`);
    setError(true);
    setSrc(fallbackSrc);
  };
  
  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100`}>
        <div className="animate-pulse bg-gray-200 rounded-lg w-3/4 h-3/4"></div>
      </div>
    );
  }
  
  return (
    <img 
      src={src || fallbackSrc}
      alt={altText}
      className={className}
      onError={handleError}
    />
  );
};

export default ImageByName;
