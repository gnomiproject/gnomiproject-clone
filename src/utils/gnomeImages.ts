
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

// Map of gnome image paths
export const gnomeImages: Record<GnomeImageType, string> = {
  presentation: '/assets/gnomes/gnome_presentation.png',
  clipboard: '/assets/gnomes/gnome_clipboard.png',
  welcome: '/assets/gnomes/gnome_welcome.png', 
  magnifying: '/assets/gnomes/gnome_magnifying.png',
  charts: '/assets/gnomes/gnome_charts.png',
  profile: '/assets/gnomes/gnome_profile.png',
  report: '/assets/gnomes/gnome_report.png',
  analysis: '/assets/gnomes/gnome_analysis.png',
  placeholder: '/assets/gnomes/placeholder.svg'
};

// Fallback URL to use when an image fails to load
export const fallbackGnomeImage = gnomeImages.placeholder;

/**
 * Get a gnome image by archetype ID
 * @param archetypeId The archetype ID
 * @returns The appropriate gnome image for this archetype
 */
export const getGnomeForArchetype = (archetypeId: string): string => {
  if (!archetypeId) return gnomeImages.placeholder;
  
  // Map archetype families to specific gnomes
  if (archetypeId.startsWith('a')) return gnomeImages.presentation;
  if (archetypeId.startsWith('b')) return gnomeImages.clipboard;
  if (archetypeId.startsWith('c')) return gnomeImages.magnifying;
  if (archetypeId.startsWith('d')) return gnomeImages.charts;
  if (archetypeId.startsWith('e')) return gnomeImages.profile;
  if (archetypeId.startsWith('f')) return gnomeImages.welcome;
  
  return gnomeImages.placeholder;
};

/**
 * Get a gnome image by section type
 * @param sectionType The report section type
 * @returns The appropriate gnome image for this section
 */
export const getGnomeForSection = (sectionType: string): string => {
  const sectionMap: Record<string, GnomeImageType> = {
    'profile': 'profile',
    'cost': 'charts',
    'metrics': 'charts',
    'demographics': 'clipboard',
    'utilization': 'analysis',
    'disease': 'magnifying',
    'care': 'clipboard', 
    'gaps': 'clipboard',
    'risk': 'magnifying',
    'recommendations': 'report',
    'overview': 'presentation',
    'executive': 'presentation',
    'introduction': 'welcome'
  };
  
  const imageType = Object.keys(sectionMap).find(key => 
    sectionType.toLowerCase().includes(key)
  );
  
  return imageType ? gnomeImages[sectionMap[imageType]] : gnomeImages.placeholder;
};

/**
 * React component props for displaying a gnome image
 */
export interface GnomeImageProps {
  type?: GnomeImageType;
  archetypeId?: string;
  sectionType?: string;
  className?: string;
  alt?: string;
}

