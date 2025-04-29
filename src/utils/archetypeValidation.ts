
/**
 * Check if a given ID is a valid archetype ID
 * Archetypes IDs can be any string that matches our known formats
 */
export const isValidArchetypeId = (id: string | null | undefined): boolean => {
  if (!id) return false;
  
  // Allow standard UUID format
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  
  // Allow short codes like 'c3', 'b2', etc.
  const shortCodeRegex = /^[a-zA-Z][0-9]+$/;
  
  // Allow special values 
  const specialValues = ['All_Average'];
  
  return (
    uuidRegex.test(id) || 
    shortCodeRegex.test(id) || 
    specialValues.includes(id)
  );
};

/**
 * Normalize archetype ID to standard format if needed
 */
export const normalizeArchetypeId = (id: string): string => {
  return id.toLowerCase();
};
