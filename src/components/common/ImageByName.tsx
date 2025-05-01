
import React, { useState, useEffect } from 'react';
import { getImageByName } from '@/services/imageService';
import { Skeleton } from '@/components/ui/skeleton';

interface ImageByNameProps {
  imageName: string;
  altText: string;
  className?: string;
  width?: number;
  height?: number;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const ImageByName: React.FC<ImageByNameProps> = ({
  imageName,
  altText,
  className = '',
  width,
  height,
  fallbackSrc = '/assets/gnomes/placeholder.svg',
  onLoad,
  onError
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      setIsLoading(true);
      setHasError(false);
      
      try {
        const url = await getImageByName(imageName);
        
        if (isMounted) {
          if (url) {
            setImageUrl(url);
          } else {
            console.warn(`[ImageByName] No URL found for image: ${imageName}`);
            setHasError(true);
          }
        }
      } catch (error) {
        console.error(`[ImageByName] Error loading image ${imageName}:`, error);
        if (isMounted) {
          setHasError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadImage();

    return () => {
      isMounted = false;
    };
  }, [imageName]);

  const handleImageError = () => {
    console.error(`[ImageByName] Failed to load image from URL: ${imageUrl}`);
    setHasError(true);
    if (onError) onError();
  };

  const handleImageLoad = () => {
    if (onLoad) onLoad();
  };

  // Show skeleton while loading
  if (isLoading) {
    return (
      <Skeleton
        className={`relative ${className}`}
        style={{ width: width ? `${width}px` : '100%', height: height ? `${height}px` : '200px' }}
      />
    );
  }

  // Show fallback for error state or when no image URL found
  if (hasError || !imageUrl) {
    return (
      <img
        src={fallbackSrc}
        alt={`Fallback for: ${altText}`}
        className={className}
        width={width}
        height={height}
      />
    );
  }

  // Show the requested image
  return (
    <img
      src={imageUrl}
      alt={altText}
      className={className}
      width={width}
      height={height}
      onError={handleImageError}
      onLoad={handleImageLoad}
    />
  );
};

export default ImageByName;
