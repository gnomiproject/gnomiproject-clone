
/**
 * Utility function to ensure a value is an array
 * Handles cases where the value might be:
 * - Already an array
 * - A string that contains JSON array
 * - A single value that should be wrapped in an array
 * - null/undefined which returns an empty array
 */
export function ensureArray<T>(value: unknown): T[] {
  if (!value) return [];
  
  if (Array.isArray(value)) return value as T[];
  
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [value as T];
    } catch (e) {
      // If parsing fails, treat the string as a single value
      return [value as T];
    }
  }
  
  // For any other type, wrap it in an array
  return [value as T];
}
