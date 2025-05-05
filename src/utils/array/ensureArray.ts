
/**
 * Ensures that the provided data is returned as an array.
 * - If the input is already an array, it's returned as-is
 * - If it's a string that looks like JSON, it attempts to parse it
 * - Otherwise, it wraps the item in an array
 *
 * @param data Any data that needs to be converted to an array
 * @returns An array containing the data, or an empty array if data is null/undefined
 */
export const ensureArray = (data: any): any[] => {
  if (!data) return [];
  
  if (Array.isArray(data)) return data;
  
  if (typeof data === 'string') {
    // Check if it's a JSON string
    if (data.startsWith('[') || data.startsWith('{')) {
      try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [data];
      } catch (e) {
        // If parsing fails, treat it as a regular string
        return [data];
      }
    }
    // Handle newline-separated strings
    if (data.includes('\n')) {
      return data.split('\n').filter(Boolean);
    }
    // Handle comma-separated strings
    if (data.includes(',')) {
      return data.split(',').map(s => s.trim()).filter(Boolean);
    }
    // Single value string
    return [data];
  }
  
  if (typeof data === 'object' && data !== null) {
    // If it's an object with a specific structure we want to extract
    if ('items' in data && Array.isArray(data.items)) {
      return data.items;
    }
    if ('entries' in data && Array.isArray(data.entries)) {
      return data.entries;
    }
  }
  
  // Default: wrap in an array
  return [data];
};
