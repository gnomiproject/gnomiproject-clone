
import { getImageUrl, FALLBACK_IMAGE } from '@/utils/imageService';

// Simple in-memory cache to avoid redundant lookups
const imageCache = new Map<string, string>();

/**
 * Fetches an image URL by its name, using direct URL mapping
 * @param imageName The name of the image to lookup
 * @returns The URL of the image or fallback if not found
 */
export const getImageByName = async (imageName: string): Promise<string> => {
  // Check cache first - avoid unnecessary lookups
  if (imageCache.has(imageName)) {
    return imageCache.get(imageName) || FALLBACK_IMAGE;
  }
  
  try {
    // Use the consolidated getImageUrl function from utils/imageService.ts
    const imageUrl = getImageUrl(imageName);
    
    // Cache the URL for future use to reduce lookups
    imageCache.set(imageName, imageUrl);
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
    // Process in batches to avoid overwhelming network
    const batchSize = 5;
    for (let i = 0; i < imageNames.length; i += batchSize) {
      const batch = imageNames.slice(i, i + batchSize);
      await Promise.all(batch.map(name => getImageByName(name)));
      
      // Small delay between batches if there are more to process
      if (i + batchSize < imageNames.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
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
  const count = imageCache.size;
  imageCache.clear();
  console.log(`[ImageService] Cleared ${count} cached image URLs`);
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
