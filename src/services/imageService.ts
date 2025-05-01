
import { directImageMap, gnomeImages, fallbackGnomeImage } from '@/utils/gnomeImages';

// Simple in-memory cache to avoid redundant lookups
const imageCache = new Map<string, string>();

/**
 * Fetches an image URL by its name, using direct URL mapping
 * @param imageName The name of the image to lookup
 * @returns The URL of the image or fallback if not found
 */
export const getImageByName = async (imageName: string): Promise<string> => {
  // Check if we need to translate from short name to lookup name
  const lookupName = gnomeImages[imageName] || imageName;
  
  // Special case for placeholder - return the local path directly
  if (lookupName === 'placeholder') {
    return fallbackGnomeImage;
  }
  
  // Check cache first
  if (imageCache.has(lookupName)) {
    console.log(`[ImageService] Using cached URL for ${lookupName}`);
    return imageCache.get(lookupName) || fallbackGnomeImage;
  }
  
  try {
    // Try direct image map first
    if (directImageMap[lookupName]) {
      const imageUrl = directImageMap[lookupName];
      console.log(`[ImageService] Found direct URL for ${lookupName}: ${imageUrl}`);
      // Cache the URL
      imageCache.set(lookupName, imageUrl);
      return imageUrl;
    }
    
    // Try with gnome_ prefix if not found directly
    const prefixedName = `gnome_${lookupName}`;
    if (directImageMap[prefixedName]) {
      const imageUrl = directImageMap[prefixedName];
      console.log(`[ImageService] Found URL for ${prefixedName}: ${imageUrl}`);
      // Cache the URL
      imageCache.set(lookupName, imageUrl);
      return imageUrl;
    }
    
    // Try generating a URL based on naming pattern
    const generatedUrl = `https://qsecdncdiykzuimtaosp.supabase.co/storage/v1/object/public/gnome-images/gnome_${lookupName}.png`;
    console.log(`[ImageService] Generated URL for ${lookupName}: ${generatedUrl}`);
    // Cache the URL
    imageCache.set(lookupName, generatedUrl);
    return generatedUrl;
    
  } catch (error) {
    console.error('[ImageService] Error getting image:', error);
    return fallbackGnomeImage;
  }
};

/**
 * Prefetches multiple images by name and caches them
 * @param imageNames Array of image names to prefetch
 */
export const prefetchImages = async (imageNames: string[]): Promise<void> => {
  // Filter out placeholder as it doesn't need prefetching
  const imagesToFetch = imageNames.filter(name => name !== 'placeholder');
  
  if (imagesToFetch.length === 0) return;
  
  try {
    // Process each image name to get its URL and cache it
    for (const name of imagesToFetch) {
      const url = await getImageByName(name);
      imageCache.set(name, url);
    }
    
    console.log(`[ImageService] Prefetched and cached ${imagesToFetch.length} images`);
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
