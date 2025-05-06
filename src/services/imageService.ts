
import { getImageUrl, FALLBACK_IMAGE } from '@/utils/imageService';

// Simple in-memory cache to avoid redundant lookups
const imageCache = new Map<string, string>();

/**
 * Fetches an image URL by its name, using direct URL mapping
 * @param imageName The name of the image to lookup
 * @returns The URL of the image or fallback if not found
 */
export const getImageByName = async (imageName: string): Promise<string> => {
  // Check cache first
  if (imageCache.has(imageName)) {
    console.log(`[ImageService] Using cached URL for ${imageName}`);
    return imageCache.get(imageName) || FALLBACK_IMAGE;
  }
  
  try {
    // Use the consolidated getImageUrl function from utils/imageService.ts
    const imageUrl = getImageUrl(imageName);
    
    // Cache the URL
    imageCache.set(imageName, imageUrl);
    console.log(`[ImageService] Caching URL for ${imageName}: ${imageUrl}`);
    return imageUrl;
  } catch (error) {
    console.error('[ImageService] Error getting image:', error);
    return FALLBACK_IMAGE;
  }
};

/**
 * Prefetches multiple images by name and caches them
 * @param imageNames Array of image names to prefetch
 */
export const prefetchImages = async (imageNames: string[]): Promise<void> => {
  if (imageNames.length === 0) return;
  
  try {
    // Process each image name to get its URL and cache it
    for (const name of imageNames) {
      const url = await getImageByName(name);
      imageCache.set(name, url);
    }
    
    console.log(`[ImageService] Prefetched and cached ${imageNames.length} images`);
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
 * Test Database Access - Simplified stub that returns empty array 
 * This is added to satisfy the import in TestImage.tsx without actually
 * accessing the database
 */
export const testDatabaseAccess = async (): Promise<any[]> => {
  console.log('[ImageService] testDatabaseAccess called - database access is now bypassed');
  return [];
};
