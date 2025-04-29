
/**
 * Utility for centralized access to gnome images
 * These images should be used across the application for consistency
 */

// Gnome image types with descriptive names
export type GnomeImageType = 
  | 'presentation'   // Gnome with presentation/chart
  | 'clipboard'      // Gnome with clipboard
  | 'welcome'        // Gnome with open arms
  | 'magnifying'     // Gnome with magnifying glass
  | 'charts'         // Gnome with charts/analytics
  | 'profile'        // Gnome portrait style
  | 'report'         // Gnome with report/document
  | 'analysis'       // Gnome analyzing data
  | 'placeholder';   // Fallback image

// Map of gnome image paths - using placeholder for all types to avoid 404s
export const gnomeImages: Record<GnomeImageType, string> = {
  presentation: '/assets/gnomes/placeholder.svg',
  clipboard: '/assets/gnomes/placeholder.svg',
  welcome: '/assets/gnomes/placeholder.svg', 
  magnifying: '/assets/gnomes/placeholder.svg',
  charts: '/assets/gnomes/placeholder.svg',
  profile: '/assets/gnomes/placeholder.svg',
  report: '/assets/gnomes/placeholder.svg',
  analysis: '/assets/gnomes/placeholder.svg',
  placeholder: '/assets/gnomes/placeholder.svg'
};

// Fallback URL to use when an image fails to load
export const fallbackGnomeImage = '/assets/gnomes/placeholder.svg';

/**
 * Get a gnome image by archetype ID
 * @param archetypeId The archetype ID
 * @returns The appropriate gnome image for this archetype
 */
export const getGnomeForArchetype = (archetypeId: string): string => {
  if (!archetypeId) return fallbackGnomeImage;
  
  // For now, return the placeholder for all archetypes to debug
  return fallbackGnomeImage;
};

/**
 * Get a gnome image by section type
 * @param sectionType The report section type
 * @returns The appropriate gnome image for this section
 */
export const getGnomeForSection = (sectionType: string): string => {
  // For now, return the placeholder for all sections to debug
  return fallbackGnomeImage;
};
