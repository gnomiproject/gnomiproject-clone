
/**
 * Utility function to ensure a value is an array
 * Handles various input formats and converts them safely to arrays
 * 
 * @param value Any value that needs to be converted to an array
 * @returns Safely converted array
 */
export function ensureArray<T>(value: any): T[] {
  // Return immediately for common cases to avoid unnecessary processing
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  
  // Special case for objects with iterable properties
  if (typeof value === 'object' && Symbol.iterator in Object(value)) {
    return Array.from(value as Iterable<T>);
  }
  
  // Handle string JSON arrays
  if (typeof value === 'string') {
    value = value.trim();
    if ((value.startsWith('[') && value.endsWith(']')) || 
        (value.startsWith('{') && value.endsWith('}'))) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed;
        return [parsed as T]; // Single object from JSON
      } catch (e) {
        // Failed JSON parsing, treat as a regular string
      }
    }
    // For non-JSON strings or parsing failures, split by newlines if they exist
    if (value.includes('\n')) {
      return value.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0) as unknown as T[];
    }
    return [value as unknown as T]; // Single string as array item
  }
  
  // If it's an object with values (like from Supabase), convert to array
  if (typeof value === 'object' && value !== null) {
    return Object.values(value);
  }
  
  // Default: wrap in array
  return [value as T];
}

/**
 * A memoized version of ensureArray that caches results for repeated inputs
 * Use for expensive transformations of the same data
 */
export const memoizedEnsureArray = (() => {
  const cache = new Map<string, any[]>();
  const MAX_CACHE_SIZE = 50; // Prevent memory leaks
  
  return <T>(value: any, cacheKey?: string): T[] => {
    // Skip caching for null/undefined or already array values
    if (value === null || value === undefined || Array.isArray(value)) {
      return ensureArray<T>(value);
    }
    
    // Generate cache key (use provided key or stringify simple values)
    const key = cacheKey || (typeof value === 'object' ? 
      Object.keys(value).join('-') : String(value));
    
    if (cache.has(key)) {
      return cache.get(key) as T[];
    }
    
    const result = ensureArray<T>(value);
    
    // Implement LRU-like behavior by clearing oldest entries when cache gets too big
    if (cache.size >= MAX_CACHE_SIZE) {
      const oldestKey = cache.keys().next().value;
      cache.delete(oldestKey);
    }
    
    cache.set(key, result);
    return result;
  };
})();
