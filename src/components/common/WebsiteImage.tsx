
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
  const [loadedImage, setLoadedImage] = useState<string | null>(null);
  
  // Normalize image type to handle aliases like "magnifying" -> "magnifying_glass"
  const normalizedType = type === 'magnifying' ? 'magnifying_glass' : type;
  
  // Get the image URL from Supabase storage
  const imageUrl = getImageUrl(normalizedType);
  
  // Handle image loading errors
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.warn(`Failed to load image: ${type}`, {
      attemptedUrl: e.currentTarget.src,
      fallbackUrl: FALLBACK_IMAGE,
      normalizedType
    });
    
    setHasError(true);
    
    // Set fallback image
    if (e.currentTarget.src !== FALLBACK_IMAGE) {
      e.currentTarget.src = FALLBACK_IMAGE;
    }
    
    if (onError) onError();
  };
  
  const handleLoad = () => {
    setLoadedImage(imageUrl);
    if (onLoad) onLoad();
  };
  
  return (
    <img
      src={imageUrl}
      alt={altText || `${type} image`}
      className={className}
      width={width}
      height={height}
      onLoad={handleLoad}
      onError={handleError}
    />
  );
};

export default WebsiteImage;
