
/**
 * Utility for centralized access to gnome images
 * These images should be used across the application for consistency
 */

// Direct image mapping to URLs
export const directImageMap: Record<string, string> = {
  'gnome_chart': 'https://qsecdncdiykzuimtaosp.supabase.co/storage/v1/object/public/gnome-images/gnome_chart.png',
  'charts': 'https://qsecdncdiykzuimtaosp.supabase.co/storage/v1/object/public/gnome-images/gnome_chart.png',
  'clipboard': 'https://qsecdncdiykzuimtaosp.supabase.co/storage/v1/object/public/gnome-images/gnome_clipboard.png',
  'reports': 'https://qsecdncdiykzuimtaosp.supabase.co/storage/v1/object/public/gnome-images/gnome_report.png',
  'welcome': 'https://qsecdncdiykzuimtaosp.supabase.co/storage/v1/object/public/gnome-images/gnome_welcome.png',
  'magnifying_glass': 'https://qsecdncdiykzuimtaosp.supabase.co/storage/v1/object/public/gnome-images/gnome_magnifying_glass.png',
  'magnifying': 'https://qsecdncdiykzuimtaosp.supabase.co/storage/v1/object/public/gnome-images/gnome_magnifying_glass.png', // Add alias for backward compatibility
  'analysis': 'https://qsecdncdiykzuimtaosp.supabase.co/storage/v1/object/public/gnome-images/gnome_analysis.png',
  'profile': 'https://qsecdncdiykzuimtaosp.supabase.co/storage/v1/object/public/gnome-images/gnome_profile.png',
  'report': 'https://qsecdncdiykzuimtaosp.supabase.co/storage/v1/object/public/gnome-images/gnome_report.png',
  'presentation': 'https://qsecdncdiykzuimtaosp.supabase.co/storage/v1/object/public/gnome-images/gnome_presentation.png',
  'healthcare': 'https://qsecdncdiykzuimtaosp.supabase.co/storage/v1/object/public/gnome-images/gnome_healthcare.png',
  'metrics': 'https://qsecdncdiykzuimtaosp.supabase.co/storage/v1/object/public/gnome-images/gnome_metrics.png',
};

// Gnome image types with descriptive names
export type GnomeImageType = 
  | 'charts'       // Gnome with charts/analytics
  | 'reports'      // Gnome with report/document
  | 'healthcare'   // Gnome healthcare related
  | 'metrics'      // Gnome metrics related
  | 'analysis'     // Gnome analyzing data
  | 'placeholder';  // Fallback image

// Map of gnome image names to use with our ImageByName component
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
  magnifying_glass: 'metrics',
  profile: 'analysis',
  placeholder: 'placeholder'
};

// Direct path to the fallback image to use when dynamic loading fails
export const fallbackGnomeImage = 'https://qsecdncdiykzuimtaosp.supabase.co/storage/v1/object/public/gnome-images/gnome_chart.png';

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
