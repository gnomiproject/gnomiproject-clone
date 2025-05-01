
import { supabase } from '@/integrations/supabase/client';

// Common image types used throughout the site
export type WebsiteImageType = 
  | 'chart'
  | 'clipboard'
  | 'lefthand'
  | 'magnifying_glass'
  | 'overlook'
  | 'favicon'
  | 'logo';

// Fallback image if storage access fails
export const FALLBACK_IMAGE = 'https://qsecdncdiykzuimtaosp.supabase.co/storage/v1/object/public/gnome-images/gnome_chart.png';

/**
 * Get public URL for any image in our storage
 * @param imageName - Image name (can include prefix or not)
 * @returns The public URL to the image or fallback if not found
 */
export const getImageUrl = (imageName: string): string => {
  try {
    let fileName;
    
    // Handle special cases for certain images with different naming patterns
    if (imageName === 'favicon') {
      fileName = 'gnomi_favicon.png';
    } else if (imageName === 'logo') {
      fileName = 'g.nomi_logo.png';
    } else {
      // Handle gnome images - add prefix if needed
      fileName = imageName.startsWith('gnome_') 
        ? `${imageName}.png` 
        : `gnome_${imageName}.png`;
    }
    
    // Get the URL directly from storage without database queries
    const { data } = supabase
      .storage
      .from('gnome-images')
      .getPublicUrl(fileName);
    
    return data?.publicUrl || FALLBACK_IMAGE;
  } catch (error) {
    console.error('Error generating image URL:', error);
    return FALLBACK_IMAGE;
  }
};

/**
 * Maps archetype IDs to appropriate image types
 * @param archetypeId The archetype ID
 * @returns The appropriate image type for this archetype
 */
export const getImageForArchetype = (archetypeId: string): WebsiteImageType => {
  // Using chart for all archetypes
  return 'chart';
};

/**
 * Maps section types to appropriate image types
 * @param sectionType The section type
 * @returns The appropriate image type for this section
 */
export const getImageForSection = (sectionType: string): WebsiteImageType => {
  // Map different section types to appropriate images
  const sectionToImageMap: Record<string, WebsiteImageType> = {
    'overview': 'chart',
    'swot': 'clipboard',
    'metrics': 'chart',
    // Add more mappings as needed
  };
  
  return sectionToImageMap[sectionType] || 'chart';
};

// Stub for backward compatibility
export const testDatabaseAccess = async (): Promise<any[]> => {
  console.log('[ImageService] testDatabaseAccess called - database access is now bypassed');
  return [];
};

// Legacy function for backward compatibility
export const getImageByName = async (imageName: string): Promise<string> => {
  return getImageUrl(imageName);
};

// Legacy functions for backward compatibility
export const prefetchImages = async (imageNames: string[]): Promise<void> => {
  console.log('[ImageService] Prefetch is now a no-op with direct URL approach');
};

export const clearImageCache = (): void => {
  console.log('[ImageService] Cache clearing is now a no-op with direct URL approach');
};
