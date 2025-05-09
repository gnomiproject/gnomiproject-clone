
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
  
  // Always use "chart" for family-specific requests to avoid 404s
  let normalizedType = type;
  
  // If the type is a single letter (a, b, c) or looks like family ID, use chart instead
  if (/^[a-c]$/.test(type) || /^family-[a-c]$/.test(type)) {
    normalizedType = 'chart';
    console.debug(`[WebsiteImage] Converting family identifier "${type}" to "chart"`);
  }
  
  // Handle aliases for backward compatibility
  if (normalizedType === 'magnifying') {
    normalizedType = 'magnifying_glass';
  }
  
  // Get the image URL from Supabase storage
  const imageUrl = getImageUrl(normalizedType);
  
  // Handle image loading errors
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Only log the first failure to reduce console noise
    if (!hasError) {
      console.warn(`[WebsiteImage] Failed to load image: ${type}`, {
        attemptedUrl: e.currentTarget.src,
        fallbackUrl: FALLBACK_IMAGE,
        normalizedType,
        timestamp: new Date().toISOString()
      });
    }
    
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
