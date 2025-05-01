
import React, { useState, useEffect } from 'react';
import { getImageByName } from '@/services/imageService';
import { fallbackGnomeImage } from '@/utils/gnomeImages';

interface ImageByNameProps {
  imageName: string;
  altText?: string;
  className?: string;
  fallbackSrc?: string;
  width?: number;
  height?: number;
  onError?: () => void;
}

const ImageByName: React.FC<ImageByNameProps> = ({
  imageName,
  altText = 'Gnome Image',
  className = 'h-40 w-40 object-contain',
  fallbackSrc = fallbackGnomeImage,
  width,
  height,
  onError
}) => {
  const [src, setSrc] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadAttempts, setLoadAttempts] = useState<number>(0);
  
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
        setError(false);
        const imageUrl = await getImageByName(imageName);
        
        if (isMounted) {
          if (imageUrl) {
            console.log(`[ImageByName] Successfully retrieved URL for '${imageName}': ${imageUrl}`);
            setSrc(imageUrl);
            setError(false);
          } else {
            // If no image URL is returned, use the direct fallback path
            console.warn(`[ImageByName] No image found for '${imageName}', using fallback`);
            setSrc(fallbackSrc);
            setError(true);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error(`[ImageByName] Error loading '${imageName}':`, err);
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
  }, [imageName, fallbackSrc, loadAttempts]);
  
  const handleError = () => {
    console.warn(`[ImageByName] Error displaying image '${imageName}', falling back to placeholder`);
    setError(true);
    setSrc(fallbackSrc);
    
    // Retry loading the image once if it fails, but with a short delay
    if (loadAttempts < 1) {
      setTimeout(() => {
        setLoadAttempts(prev => prev + 1);
      }, 1000);
    }
    
    // Call the onError callback if provided
    if (onError) {
      onError();
    }
  };
  
  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-50 animate-pulse`}>
        <div className="animate-pulse rounded-lg w-3/4 h-3/4 bg-gray-200"></div>
      </div>
    );
  }
  
  return (
    <img 
      src={src || fallbackSrc}
      alt={altText}
      className={`${className} ${error ? 'opacity-80' : ''}`}
      width={width}
      height={height}
      onError={handleError}
    />
  );
};

export default ImageByName;
