
import React from 'react';
import { gnomeImages, fallbackGnomeImage, getGnomeForArchetype, getGnomeForSection, GnomeImageType } from '@/utils/gnomeImages';

interface GnomeImageProps {
  /**
   * Specific gnome type to display
   */
  type?: GnomeImageType;
  
  /**
   * Archetype ID to determine gnome type from
   */
  archetypeId?: string;
  
  /**
   * Section type to determine gnome type from
   */
  sectionType?: string;
  
  /**
   * CSS class names
   */
  className?: string;
  
  /**
   * Alt text for accessibility
   */
  alt?: string;
  
  /**
   * Optional additional props
   */
  [key: string]: any;
}

/**
 * Component for consistently displaying gnome images throughout the application
 * with intelligent fallbacks
 */
const GnomeImage: React.FC<GnomeImageProps> = ({ 
  type, 
  archetypeId, 
  sectionType,
  className = 'h-48 object-contain',
  alt = 'Healthcare Gnome',
  ...props 
}) => {
  // Determine the image source with priority:
  // 1. Explicit type
  // 2. Archetype ID based
  // 3. Section type based
  // 4. Default placeholder
  const getImageSource = (): string => {
    if (type && gnomeImages[type]) {
      return gnomeImages[type];
    }
    
    if (archetypeId) {
      return getGnomeForArchetype(archetypeId);
    }
    
    if (sectionType) {
      return getGnomeForSection(sectionType);
    }
    
    return fallbackGnomeImage;
  };
  
  const [src, setSrc] = React.useState<string>(getImageSource());
  const [hasError, setHasError] = React.useState(false);
  
  // Update source if props change
  React.useEffect(() => {
    setSrc(getImageSource());
    setHasError(false);
  }, [type, archetypeId, sectionType]);
  
  const handleError = () => {
    if (!hasError) {
      console.warn(`Failed to load gnome image from source: ${src}`);
      setSrc(fallbackGnomeImage);
      setHasError(true);
    }
  };
  
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

export default GnomeImage;
