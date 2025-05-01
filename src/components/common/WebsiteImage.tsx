
import React from 'react';
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
  // Get the image URL from Supabase storage
  const imageUrl = getImageUrl(type);
  
  // Handle image loading errors
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.warn(`Failed to load image: ${type}`);
    
    // Set fallback image
    if (e.currentTarget.src !== FALLBACK_IMAGE) {
      e.currentTarget.src = FALLBACK_IMAGE;
    }
    
    if (onError) onError();
  };
  
  return (
    <img
      src={imageUrl}
      alt={altText || `${type} image`}
      className={className}
      width={width}
      height={height}
      onLoad={onLoad}
      onError={handleError}
    />
  );
};

export default WebsiteImage;
