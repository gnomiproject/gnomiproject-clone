
/**
 * Ensures that the input value is converted to a string array
 * Handles all possible input types safely
 */
export function ensureStringArray(value: unknown): string[] {
  if (value === null || value === undefined) {
    return [];
  }
  
  if (Array.isArray(value)) {
    return value.map(item => String(item));
  }
  
  if (typeof value === 'string') {
    // Handle empty string
    if (value.trim() === '') return [];
    
    // Try to parse as JSON if it looks like an array
    if (value.startsWith('[') && value.endsWith(']')) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed.map(item => String(item));
        }
      } catch {
        // Failed to parse as JSON, continue to other methods
      }
    }
    
    // Split by commas or newlines
    return value.split(/[,\n]/).map(s => s.trim()).filter(Boolean);
  }
  
  // For any other type, return empty array
  return [];
}
