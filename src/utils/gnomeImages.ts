
import { supabase } from '@/integrations/supabase/client';

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

// Base URL for Supabase storage bucket
const STORAGE_BUCKET = 'gnome-images';
const STORAGE_BASE_URL = `${supabase.storage.from(STORAGE_BUCKET).getPublicUrl('').data.publicUrl}/`;
const LOCAL_FALLBACK_PATH = '/assets/gnomes/placeholder.svg';

// Map of gnome image paths
export const gnomeImages: Record<GnomeImageType, string> = {
  presentation: `${STORAGE_BASE_URL}gnome_presentation.png`,
  clipboard: `${STORAGE_BASE_URL}gnome_clipboard.png`,
  welcome: `${STORAGE_BASE_URL}gnome_welcome.png`, 
  magnifying: `${STORAGE_BASE_URL}gnome_magnifying.png`,
  charts: `${STORAGE_BASE_URL}gnome_charts.png`,
  profile: `${STORAGE_BASE_URL}gnome_profile.png`,
  report: `${STORAGE_BASE_URL}gnome_report.png`,
  analysis: `${STORAGE_BASE_URL}gnome_analysis.png`,
  placeholder: LOCAL_FALLBACK_PATH
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
