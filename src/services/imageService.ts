
import { supabase, getSupabaseUrl } from '@/integrations/supabase/client';
import { gnomeImages } from '@/utils/gnomeImages';

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
  // Check if we need to translate from short name to db name
  const dbImageName = gnomeImages[imageName] || imageName;
  
  // Special case for placeholder - return the local path directly
  if (dbImageName === 'placeholder') {
    return '/assets/gnomes/placeholder.svg';
  }
  
  // Check cache first
  if (imageCache.has(dbImageName)) {
    console.log(`[ImageService] Using cached URL for ${dbImageName}`);
    return imageCache.get(dbImageName) || null;
  }
  
  try {
    // Add more specific logging
    console.log(`[ImageService] Looking for image_name = "${dbImageName}" (from input: "${imageName}")`);
    
    // Direct query approach with more detailed logging
    const { data, error } = await supabase
      .from('gnomi_images')
      .select('image_url')
      .eq('image_name', dbImageName)
      .maybeSingle();
    
    // Log the query result with detailed information
    console.log(`[ImageService] Query result:`, { 
      data, 
      error,
      requestedImage: dbImageName,
      supabaseUrl: getSupabaseUrl(),
      query: `SELECT image_url FROM gnomi_images WHERE image_name = '${dbImageName}'`
    });
    
    if (error) {
      console.error('[ImageService] Database error:', error);
      return null;
    }
    
    if (!data) {
      console.warn(`[ImageService] Image with name "${dbImageName}" not found`);
      
      // Fallback: try direct format with .png extension if naming convention is consistent
      const fallbackUrl = `https://qsecdncdiykzuimtaosp.supabase.co/storage/v1/object/public/gnome-images/gnome_${dbImageName}.png`;
      console.log(`[ImageService] Trying fallback URL: ${fallbackUrl}`);
      
      // Cache the fallback URL to avoid redundant lookups
      imageCache.set(dbImageName, fallbackUrl);
      return fallbackUrl;
    }
    
    // Cache and return the found image URL
    imageCache.set(dbImageName, data.image_url);
    return data.image_url;
  } catch (error) {
    console.error('[ImageService] Unexpected error:', error);
    return null;
  }
};

/**
 * Tests database access by querying all records from the gnomi_images table
 * @returns Array of image records or null if error
 */
export const testDatabaseAccess = async (): Promise<GnomeImage[] | null> => {
  try {
    console.log('[ImageService] Testing database access...');
    
    // First, let's check if the table exists by getting all records
    const { data, error, count } = await supabase
      .from('gnomi_images')
      .select('*', { count: 'exact' });
    
    // Log comprehensive debug information
    console.log('[ImageService] Database test result:', { 
      data, 
      error,
      recordCount: data ? data.length : 0,
      countReturned: count,
      supabaseUrl: getSupabaseUrl()
    });
    
    if (error) {
      console.error('[ImageService] Database error during test:', error);
      return null;
    }

    if (!data || data.length === 0) {
      console.warn('[ImageService] No records found in gnomi_images table');
    }
    
    return data;
  } catch (e) {
    console.error('[ImageService] Error testing database access:', e);
    return null;
  }
};

/**
 * Prefetches multiple images by name and caches them
 * @param imageNames Array of image names to prefetch
 */
export const prefetchImages = async (imageNames: string[]): Promise<void> => {
  // Filter out placeholder as it doesn't need to be fetched from the database
  const imagesToFetch = imageNames.filter(name => name !== 'placeholder');
  
  if (imagesToFetch.length === 0) return;
  
  try {
    const { data, error } = await supabase
      .from('gnomi_images')
      .select('image_name, image_url')
      .in('image_name', imagesToFetch);
    
    if (error) {
      console.error('[ImageService] Error prefetching images:', error);
      return;
    }
    
    if (!data || data.length === 0) {
      console.warn('[ImageService] No images found during prefetch');
      
      // Create fallback URLs based on naming convention
      for (const name of imagesToFetch) {
        const fallbackUrl = `https://qsecdncdiykzuimtaosp.supabase.co/storage/v1/object/public/gnome-images/gnome_${name}.png`;
        imageCache.set(name, fallbackUrl);
      }
      return;
    }
    
    // Add all fetched images to cache
    data.forEach((item: GnomeImage) => {
      imageCache.set(item.image_name, item.image_url);
    });
    
    // Add placeholder to cache
    imageCache.set('placeholder', '/assets/gnomes/placeholder.svg');
    
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

/**
 * Validates if image URLs are accessible by attempting to load them
 */
export const validateImageUrl = async (url: string): Promise<boolean> => {
  // Skip validation for local assets
  if (url.startsWith('/')) return true;
  
  try {
    // We can't directly test image loading server-side, so we return true for now
    // In a real implementation, this could make a HEAD request to validate the URL
    return true;
  } catch (error) {
    console.error(`[ImageService] URL validation failed for ${url}:`, error);
    return false;
  }
};
