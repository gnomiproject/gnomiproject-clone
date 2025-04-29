
/**
 * Utility function to ensure a value is an array
 * Handles various input formats and converts them safely to arrays
 */
export function ensureArray<T>(value: any): T[] {
  // If it's already an array, return it
  if (Array.isArray(value)) return value;
  
  // If it's null or undefined, return empty array
  if (value === null || value === undefined) return [];
  
  // If it's a string, try to parse it as JSON
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
      return [parsed as T]; // If it's a single object, wrap it
    } catch (e) {
      // If it's not valid JSON, return it as a single item
      return [value as T];
    }
  }
  
  // If it's an object with values (like from Supabase), convert to array
  if (typeof value === 'object') {
    return Object.values(value);
  }
  
  // Default: wrap in array
  return [value as T];
}
