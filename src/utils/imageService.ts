import { supabase } from '@/integrations/supabase/client';

// Common image types used throughout the site
export type WebsiteImageType = 
  | 'chart'
  | 'clipboard'
  | 'lefthand'
  | 'magnifying_glass'
  | 'magnifying'  // Add alias for backward compatibility
  | 'overlook'
  | 'favicon'
  | 'righthand'
  | 'logo';

// Fallback image if storage access fails
export const FALLBACK_IMAGE = 'https://qsecdncdiykzuimtaosp.supabase.co/storage/v1/object/public/gnome-images/gnome_chart.png';

// Direct mapping of images to URLs - use this as the source of truth
const IMAGE_URL_MAP: Record<string, string> = {
  'chart': 'https://qsecdncdiykzuimtaosp.supabase.co/storage/v1/object/public/gnome-images/gnome_chart.png',
  'clipboard': 'https://qsecdncdiykzuimtaosp.supabase.co/storage/v1/object/public/gnome-images/gnome_clipboard.png',
  'lefthand': 'https://qsecdncdiykzuimtaosp.supabase.co/storage/v1/object/public/gnome-images/gnome_lefthand.png',
  'magnifying_glass': 'https://qsecdncdiykzuimtaosp.supabase.co/storage/v1/object/public/gnome-images/gnome_magnifying_glass.png',
  'magnifying': 'https://qsecdncdiykzuimtaosp.supabase.co/storage/v1/object/public/gnome-images/gnome_magnifying_glass.png',
  'overlook': 'https://qsecdncdiykzuimtaosp.supabase.co/storage/v1/object/public/gnome-images/gnome_overlook.png',
  'report': 'https://qsecdncdiykzuimtaosp.supabase.co/storage/v1/object/public/gnome-images/gnome_report.png',
  'welcome': 'https://qsecdncdiykzuimtaosp.supabase.co/storage/v1/object/public/gnome-images/gnome_welcome.png',
  'healthcare': 'https://qsecdncdiykzuimtaosp.supabase.co/storage/v1/object/public/gnome-images/gnome_healthcare.png',
  'metrics': 'https://qsecdncdiykzuimtaosp.supabase.co/storage/v1/object/public/gnome-images/gnome_metrics.png',
  'analysis': 'https://qsecdncdiykzuimtaosp.supabase.co/storage/v1/object/public/gnome-images/gnome_analysis.png',
  'profile': 'https://qsecdncdiykzuimtaosp.supabase.co/storage/v1/object/public/gnome-images/gnome_profile.png',
  'favicon': 'https://qsecdncdiykzuimtaosp.supabase.co/storage/v1/object/public/gnome-images/gnomi_favicon.png',
  'logo': 'https://qsecdncdiykzuimtaosp.supabase.co/storage/v1/object/public/gnome-images/g.nomi_logo.png',
  'righthand': 'https://qsecdncdiykzuimtaosp.supabase.co/storage/v1/object/public/gnome-images/gnome_righthand.png',
};

/**
 * Get public URL for any image in our storage
 * @param imageName - Image name (can include prefix or not)
 * @returns The public URL to the image or fallback if not found
 */
export const getImageUrl = (imageName: string): string => {
  try {
    // First check if we have a direct mapping for this image
    if (IMAGE_URL_MAP[imageName]) {
      return IMAGE_URL_MAP[imageName];
    }
    
    // Next check if we have a mapping for this image with gnome_ prefix
    const withPrefix = `gnome_${imageName}`;
    if (IMAGE_URL_MAP[withPrefix]) {
      return IMAGE_URL_MAP[withPrefix];
    }
    
    // If not found in mapping, generate a URL based on consistent pattern
    const fileName = imageName.startsWith('gnome_') 
      ? `${imageName}.png` 
      : `gnome_${imageName}.png`;
    
    // Get the URL directly from storage without database queries
    const { data } = supabase
      .storage
      .from('gnome-images')
      .getPublicUrl(fileName);
    
    return data?.publicUrl || FALLBACK_IMAGE;
  } catch (error) {
    console.error('[ImageService] Error generating image URL:', error);
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

// Legacy functions for backward compatibility
export const getImageByName = async (imageName: string): Promise<string> => {
  return getImageUrl(imageName);
};

export const prefetchImages = async (imageNames: string[]): Promise<void> => {
  console.log('[ImageService] Prefetch is now a no-op with direct URL approach');
};

export const clearImageCache = (): void => {
  console.log('[ImageService] Cache clearing is now a no-op with direct URL approach');
};

export const testDatabaseAccess = async (): Promise<any[]> => {
  console.log('[ImageService] testDatabaseAccess called - database access is now bypassed');
  return [];
};
