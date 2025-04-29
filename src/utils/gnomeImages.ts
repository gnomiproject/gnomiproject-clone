
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

// Local fallback paths for when Supabase storage is not accessible
const LOCAL_IMAGES = {
  presentation: '/lovable-uploads/ffbc016f-5a01-4009-b6d2-d2b1ff146bdc.png',
  clipboard: '/lovable-uploads/c44c4897-43c2-48a4-8e58-df83da99bcb0.png',
  welcome: '/lovable-uploads/12da516f-6471-47a3-9861-9c4d50ab9415.png',
  magnifying: '/lovable-uploads/81530cfd-8e54-4bfc-8fda-6658f15d9b8b.png',
  charts: '/lovable-uploads/a45e4edb-76b0-4c38-8037-eb866148d144.png',
  profile: '/lovable-uploads/1cc408c3-b095-48b1-8087-b96fa079c8be.png',
  report: '/lovable-uploads/c7752575-8c92-44b3-a9ae-8ee62f19c77a.png',
  analysis: '/lovable-uploads/3efcc8b7-0e2d-4a2b-bb23-fa686f18c691.png',
  placeholder: '/assets/gnomes/placeholder.svg'
};

// Default to using local images first to ensure the app loads
export const gnomeImages: Record<GnomeImageType, string> = { ...LOCAL_IMAGES };

// Fallback URL to use when an image fails to load
export const fallbackGnomeImage = LOCAL_IMAGES.placeholder;

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

// Initialize Supabase storage connection - but do this async to not block app loading
(async () => {
  try {
    console.log('Initializing gnome images from Supabase storage...');
    const STORAGE_BUCKET = 'gnome-images';
    const { data: bucketInfo, error: bucketError } = await supabase.storage.getBucket(STORAGE_BUCKET);
    
    if (bucketError || !bucketInfo) {
      console.warn('Failed to access the gnome-images bucket:', bucketError?.message);
      return;
    }
    
    const { data: publicUrl } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl('');
    if (!publicUrl || !publicUrl.publicUrl) {
      console.warn('Failed to get public URL for gnome-images bucket');
      return;
    }
    
    const STORAGE_BASE_URL = publicUrl.publicUrl;
    
    // Update gnome images with Supabase URLs if bucket exists and is accessible
    gnomeImages.presentation = `${STORAGE_BASE_URL}gnome_presentation.png`;
    gnomeImages.clipboard = `${STORAGE_BASE_URL}gnome_clipboard.png`;
    gnomeImages.welcome = `${STORAGE_BASE_URL}gnome_welcome.png`; 
    gnomeImages.magnifying = `${STORAGE_BASE_URL}gnome_magnifying.png`;
    gnomeImages.charts = `${STORAGE_BASE_URL}gnome_charts.png`;
    gnomeImages.profile = `${STORAGE_BASE_URL}gnome_profile.png`;
    gnomeImages.report = `${STORAGE_BASE_URL}gnome_report.png`;
    gnomeImages.analysis = `${STORAGE_BASE_URL}gnome_analysis.png`;
    
    console.log('Gnome images successfully initialized from Supabase storage');
  } catch (error) {
    console.error('Error initializing gnome images from Supabase:', error);
    // App will continue to use local images as fallback
  }
})();
