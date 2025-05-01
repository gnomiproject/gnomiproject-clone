
/**
 * Utility for centralized access to gnome images
 * These images should be used across the application for consistency
 */

// Gnome image types with descriptive names
export type GnomeImageType = 
  | 'charts'       // Gnome with charts/analytics
  | 'reports'      // Gnome with report/document
  | 'healthcare'   // Gnome healthcare related
  | 'metrics'      // Gnome metrics related
  | 'analysis'     // Gnome analyzing data
  | 'placeholder';  // Fallback image

// Map of gnome image names to use with our ImageByName component
// These should match the image_name values in the gnomi_images table
export const gnomeImages: Record<string, string> = {
  // Direct mappings (same name in UI as in DB)
  charts: 'charts',
  reports: 'reports',
  healthcare: 'healthcare',
  metrics: 'metrics', 
  analysis: 'analysis',
  
  // Legacy aliases for backward compatibility
  presentation: 'charts',
  clipboard: 'reports',
  welcome: 'healthcare',
  magnifying: 'metrics',
  profile: 'analysis',
  placeholder: 'placeholder'
};

// Direct path to the fallback image to use when dynamic loading fails
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
    'C2': 'reports',
    'C3': 'analysis',
    'F1': 'metrics',
    'F2': 'healthcare',
    'P1': 'charts',
    'P2': 'healthcare',
    'P3': 'reports',
    'B1': 'charts',
    'B2': 'charts'
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
    'welcome': 'healthcare',
    'metrics': 'metrics',
    'swot': 'reports',
    'disease': 'metrics',
    'report': 'reports',
    'recommendations': 'charts'
  };
  
  return sectionToGnomeMap[sectionType] || 'placeholder';
};
