
/**
 * Utility for centralized access to gnome images
 * These images should be used across the application for consistency
 */

// Gnome image types with descriptive names
export type GnomeImageType = 
  | 'gnome_chart'       // Gnome with charts/analytics
  | 'gnome_clipboard'   // Gnome with clipboard
  | 'gnome_welcome'     // Gnome with open arms
  | 'gnome_magnifying'  // Gnome with magnifying glass
  | 'gnome_presentation' // Gnome with presentation
  | 'gnome_profile'     // Gnome portrait style
  | 'gnome_report'      // Gnome with report/document
  | 'gnome_analysis'    // Gnome analyzing data
  | 'placeholder';       // Fallback image

// Map of gnome image names to use with our ImageByName component
// These should match the image_name values in the gnomi_images table
export const gnomeImages: Record<string, string> = {
  presentation: 'gnome_presentation',
  clipboard: 'gnome_clipboard',
  welcome: 'gnome_welcome', 
  magnifying: 'gnome_magnifying',
  charts: 'gnome_chart',
  profile: 'gnome_profile',
  report: 'gnome_report',
  analysis: 'gnome_analysis',
  placeholder: 'placeholder'
};

// Fallback URL to use when an image fails to load
export const fallbackGnomeImage = '/assets/gnomes/placeholder.svg';

/**
 * Get a gnome image by archetype ID
 * @param archetypeId The archetype ID
 * @returns The appropriate gnome image name for this archetype
 */
export const getGnomeForArchetype = (archetypeId: string): string => {
  if (!archetypeId) return 'placeholder';
  
  // Map specific archetypes to specific gnome types
  const archetypeToGnomeMap: Record<string, string> = {
    // Example mappings
    'C1': 'charts',
    'C2': 'clipboard',
    'C3': 'analysis',
    'F1': 'magnifying',
    'F2': 'profile',
    'P1': 'presentation',
    'P2': 'welcome',
    'P3': 'report'
  };
  
  return archetypeToGnomeMap[archetypeId] || 'placeholder';
};

/**
 * Get a gnome image by section type
 * @param sectionType The report section type
 * @returns The appropriate gnome image name for this section
 */
export const getGnomeForSection = (sectionType: string): string => {
  // Map section types to gnome types
  const sectionToGnomeMap: Record<string, string> = {
    'overview': 'charts',
    'welcome': 'welcome',
    'metrics': 'analysis',
    'swot': 'clipboard',
    'disease': 'magnifying',
    'report': 'report',
    'recommendations': 'presentation'
  };
  
  return sectionToGnomeMap[sectionType] || 'placeholder';
};
