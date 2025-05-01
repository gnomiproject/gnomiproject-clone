
import { supabase } from '@/integrations/supabase/client';

// Type definitions for our image data
export interface GnomeImage {
  id: number;
  image_name: string;
  image_url: string;
}

// Simple in-memory cache to avoid redundant queries
const imageCache = new Map<string, string>();

/**
 * Fetches an image URL by its name from the gnomi_images table
 * @param imageName The name of the image to lookup
 * @returns The URL of the image or null if not found
 */
export const getImageByName = async (imageName: string): Promise<string | null> => {
  // Check if image URL is already in cache
  if (imageCache.has(imageName)) {
    console.log(`[ImageService] Using cached URL for ${imageName}`);
    return imageCache.get(imageName) || null;
  }
  
  try {
    console.log(`[ImageService] Fetching image URL for "${imageName}"`);
    
    const { data, error } = await supabase
      .from('gnomi_images')
      .select('image_url')
      .eq('image_name', imageName)
      .maybeSingle();
    
    if (error) {
      console.error('[ImageService] Error fetching image:', error);
      return null;
    }
    
    if (!data) {
      console.warn(`[ImageService] Image with name "${imageName}" not found`);
      return null;
    }
    
    // Store in cache for future requests
    imageCache.set(imageName, data.image_url);
    
    return data.image_url;
  } catch (error) {
    console.error('[ImageService] Unexpected error:', error);
    return null;
  }
};

/**
 * Prefetches multiple images by name and caches them
 * @param imageNames Array of image names to prefetch
 */
export const prefetchImages = async (imageNames: string[]): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('gnomi_images')
      .select('image_name, image_url')
      .in('image_name', imageNames);
    
    if (error) {
      console.error('[ImageService] Error prefetching images:', error);
      return;
    }
    
    if (!data || data.length === 0) {
      console.warn('[ImageService] No images found during prefetch');
      return;
    }
    
    // Add all fetched images to cache
    data.forEach((item: GnomeImage) => {
      imageCache.set(item.image_name, item.image_url);
    });
    
    console.log(`[ImageService] Prefetched and cached ${data.length} images`);
  } catch (error) {
    console.error('[ImageService] Error during prefetch:', error);
  }
};

/**
 * Clears the image cache
 */
export const clearImageCache = (): void => {
  imageCache.clear();
};
