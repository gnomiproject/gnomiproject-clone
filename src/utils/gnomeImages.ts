
/**
 * Utility for centralized access to gnome images
 * These images should be used across the application for consistency
 */

import { supabase } from '@/integrations/supabase/client';

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

// Map of gnome image paths - default paths that will be updated with data from the database
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

// Store fetched images to avoid repeated database calls
let fetchedGnomeImages = false;

/**
 * Fetch gnome images from the database
 */
export const fetchGnomeImages = async (): Promise<void> => {
  if (fetchedGnomeImages) return;
  
  try {
    const { data, error } = await supabase
      .from('gnomi_images')
      .select('name, url');
    
    if (error) {
      console.error('Error fetching gnome images:', error);
      return;
    }
    
    if (data && data.length > 0) {
      console.log('Fetched gnome images from database:', data.length);
      
      // Update the gnome images map with the fetched URLs
      data.forEach(image => {
        // Map database names to our type names (e.g. gnome_chart -> charts)
        if (image.name === 'gnome_chart') {
          gnomeImages.charts = image.url;
        }
        if (image.name === 'gnome_report') {
          gnomeImages.report = image.url;
        }
        if (image.name === 'gnome_presentation') {
          gnomeImages.presentation = image.url;
        }
        if (image.name === 'gnome_profile') {
          gnomeImages.profile = image.url;
        }
        if (image.name === 'gnome_welcome') {
          gnomeImages.welcome = image.url;
        }
        if (image.name === 'gnome_clipboard') {
          gnomeImages.clipboard = image.url;
        }
        if (image.name === 'gnome_analysis') {
          gnomeImages.analysis = image.url;
        }
        if (image.name === 'gnome_magnifying') {
          gnomeImages.magnifying = image.url;
        }
      });
      
      fetchedGnomeImages = true;
    }
  } catch (err) {
    console.error('Exception fetching gnome images:', err);
  }
};

/**
 * Get a gnome image by archetype ID
 * @param archetypeId The archetype ID
 * @returns The appropriate gnome image for this archetype
 */
export const getGnomeForArchetype = (archetypeId: string): string => {
  if (!archetypeId) return fallbackGnomeImage;
  
  // For now, return the charts gnome for all archetypes
  return gnomeImages.charts;
};

/**
 * Get a gnome image by section type
 * @param sectionType The report section type
 * @returns The appropriate gnome image for this section
 */
export const getGnomeForSection = (sectionType: string): string => {
  switch (sectionType) {
    case 'overview': 
      return gnomeImages.presentation;
    case 'metrics': 
      return gnomeImages.charts;
    case 'swot': 
      return gnomeImages.analysis;
    case 'introduction': 
      return gnomeImages.welcome;
    default:
      return gnomeImages.placeholder;
  }
};
