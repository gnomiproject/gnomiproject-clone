
/**
 * Utility for centralized access to gnome images
 * These images should be used across the application for consistency
 */
export const gnomeImages = {
  presentation: '/lovable-uploads/59457bb6-3645-40f3-a6f4-511dac08bb68.png', // Gnome with chart/presentation
  clipboard: '/lovable-uploads/53d88d5c-51d8-471a-a8d4-6821283c0d48.png', // Gnome with clipboard
  welcome: '/lovable-uploads/a9a90967-d910-43d8-b821-3c4d9cc6d67c.png', // Gnome with open arms
  magnifying: '/lovable-uploads/c2bdaff1-11e2-4eaa-94ca-748fb236ac18.png', // Gnome with magnifying glass
  lefthand: '/lovable-uploads/59457bb6-3645-40f3-a6f4-511dac08bb68.png', // Gnome with left hand up
  placeholder: '/assets/gnomes/placeholder.svg' // Fallback image
};

/**
 * Get a gnome image by archetype ID
 * @param archetypeId The archetype ID
 * @returns The appropriate gnome image for this archetype
 */
export const getGnomeForArchetype = (archetypeId: string): string => {
  if (archetypeId.startsWith('a')) return gnomeImages.presentation;
  if (archetypeId.startsWith('b')) return gnomeImages.clipboard;
  if (archetypeId.startsWith('c')) return gnomeImages.magnifying;
  return gnomeImages.placeholder;
};
