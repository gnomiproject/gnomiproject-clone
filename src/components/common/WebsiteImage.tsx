
import React, { useState } from 'react';
import { getImageUrl, WebsiteImageType, FALLBACK_IMAGE } from '@/utils/imageService';

interface WebsiteImageProps {
  type: WebsiteImageType | string;
  altText?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  onLoad?: () => void;
  onError?: () => void;
}

const WebsiteImage: React.FC<WebsiteImageProps> = ({
  type,
  altText,
  className = '',
  width,
  height,
  onLoad,
  onError
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Normalize image type to handle aliases like "magnifying" -> "magnifying_glass"
  const normalizedType = type === 'magnifying' ? 'magnifying_glass' : type;
  
  // Get the image URL from Supabase storage
  const imageUrl = getImageUrl(normalizedType);
  
  // Handle image loading errors
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.warn(`[WebsiteImage] Failed to load image: ${type}`, {
      attemptedUrl: e.currentTarget.src,
      fallbackUrl: FALLBACK_IMAGE,
      normalizedType,
      timestamp: new Date().toISOString()
    });
    
    setHasError(true);
    
    // Set fallback image
    if (e.currentTarget.src !== FALLBACK_IMAGE) {
      e.currentTarget.src = FALLBACK_IMAGE;
    }
    
    if (onError) onError();
  };
  
  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };
  
  return (
    <img
      src={imageUrl}
      alt={altText || `${type} image`}
      className={`${className} ${hasError ? 'opacity-80' : ''} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      width={width}
      height={height}
      onLoad={handleLoad}
      onError={handleError}
      style={{ transition: 'opacity 0.2s ease-in' }}
    />
  );
};

export default WebsiteImage;
