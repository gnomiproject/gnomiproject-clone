
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
    
    const { data, error } = await supabase
      .from('gnomi_images')
      .select('image_url')  // Only select the URL for better performance
      .eq('image_name', dbImageName)
      .maybeSingle();
    
    // Get Supabase URL for debugging
    const projectUrl = getSupabaseUrl();
    
    // Log the query result for debugging
    console.log(`[ImageService] Query result:`, { 
      data, 
      error,
      requestedImage: dbImageName,
      supabaseUrl: projectUrl
    });
    
    if (error) {
      console.error('Error fetching image:', error);
      return null;
    }
    
    if (!data) {
      console.warn(`Image with name "${dbImageName}" not found`);
      return null;
    }
    
    // Cache and return
    imageCache.set(dbImageName, data.image_url);
    return data.image_url;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
};

/**
 * Tests database access by querying all records from the gnomi_images table
 * @returns Array of image records or null if error
 */
export const testDatabaseAccess = async (): Promise<GnomeImage[] | null> => {
  try {
    const { data, error } = await supabase
      .from('gnomi_images')
      .select('*');
    
    // Get Supabase URL for debugging
    const projectUrl = getSupabaseUrl();
    
    console.log('All records test:', { 
      data, 
      error,
      count: data ? data.length : 0,
      supabaseUrl: projectUrl
    });
    
    return data;
  } catch (e) {
    console.error('Test query error:', e);
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
      console.error('Error prefetching images:', error);
      return;
    }
    
    if (!data || data.length === 0) {
      console.warn('No images found during prefetch');
      return;
    }
    
    // Add all fetched images to cache
    data.forEach((item: GnomeImage) => {
      imageCache.set(item.image_name, item.image_url);
    });
    
    // Add placeholder to cache
    imageCache.set('placeholder', '/assets/gnomes/placeholder.svg');
    
    console.log(`Prefetched and cached ${data.length} images`);
  } catch (error) {
    console.error('Error during prefetch:', error);
  }
};

/**
 * Clears the image cache
 */
export const clearImageCache = (): void => {
  imageCache.clear();
};
