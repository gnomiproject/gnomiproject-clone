
/**
 * Consolidated array utilities for consistent data handling
 */

/**
 * Ensures the input is converted to an array regardless of input type
 * This is a memoized version for better performance
 * 
 * @param value Any value that needs to be converted to an array
 * @param debugContext Optional context name for debugging
 * @returns An array representation of the input value
 */
export function ensureArray<T = any>(value: unknown, debugContext?: string): T[] {
  // Early return for null/undefined values
  if (value === null || value === undefined) {
    return [];
  }

  // If already an array, return as is
  if (Array.isArray(value)) {
    return value as T[];
  }

  // If it's a string that looks like a JSON array or object, try to parse it
  if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
    try {
      const parsed = JSON.parse(value);
      
      // If parsing gives us an array, return it
      if (Array.isArray(parsed)) {
        return parsed as T[];
      }
      
      // If parsing gives an object, convert its values to array
      if (typeof parsed === 'object' && parsed !== null) {
        return Object.values(parsed) as T[];
      }
    } catch (e) {
      // If parsing failed, continue to other methods
      console.log(debugContext ? `[${debugContext}] JSON parse failed:` : 'JSON parse failed:', e);
    }
  }

  // For strings not in JSON format, split by newline
  if (typeof value === 'string') {
    if (value.trim() === '') return [];
    
    // Split by common separators
    return value
      .split(/[\n,;]/)
      .map(item => item.trim())
      .filter(Boolean) as unknown as T[];
  }

  // For objects, convert to array of values
  if (typeof value === 'object' && value !== null) {
    return Object.values(value) as T[];
  }

  // For any other type, wrap in array
  return [value] as unknown as T[];
}

/**
 * Ensures the input value is converted to a string array
 * Handles all possible input types safely
 * 
 * @param value Any value that needs to be converted to a string array
 * @param debugContext Optional context name for debugging
 * @returns An array of strings
 */
export function ensureStringArray(value: unknown, debugContext?: string): string[] {
  const array = ensureArray(value, debugContext);
  return array.map(item => String(item));
}

/**
 * Formats an array of strings for display
 * 
 * @param array Array of strings to format
 * @param options Formatting options
 * @returns Properly formatted array of strings
 */
export function formatStringArray(
  array: string[], 
  options: { 
    capitalize?: boolean, 
    trim?: boolean,
    removeEmpty?: boolean
  } = {}
): string[] {
  const { capitalize = true, trim = true, removeEmpty = true } = options;
  
  return array
    .map(str => {
      let result = String(str);
      if (trim) result = result.trim();
      if (capitalize && result.length > 0) {
        result = result.charAt(0).toUpperCase() + result.slice(1);
      }
      return result;
    })
    .filter(str => !removeEmpty || !!str);
}

/**
 * Converts any array-like object to a properly formatted array
 * 
 * @param input Any input that should be transformed to an array
 * @param formatOptions Formatting options
 * @returns Properly formatted array
 */
export function normalizeArray(
  input: unknown, 
  formatOptions: { 
    capitalize?: boolean, 
    trim?: boolean,
    removeEmpty?: boolean
  } = {}
): string[] {
  return formatStringArray(ensureStringArray(input), formatOptions);
}
