
import { Json } from '@/types/archetype';

/**
 * Normalizes SWOT data from various possible formats into a string array
 * This handles multiple data formats that might exist in different tables
 */
export const normalizeSwotData = (data: any): string[] => {
  // Return empty array if data is null, undefined, or empty
  if (!data) return [];
  
  // If it's already an array of strings, return it
  if (Array.isArray(data) && data.every(item => typeof item === 'string')) {
    return data;
  }
  
  // If it's an array of objects with text property (common format in our DB)
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && data[0]?.text) {
    return data.map(item => item?.text || '').filter(Boolean);
  }
  
  // Handle direct arrays of objects with text or description properties
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
    return data.map(item => {
      if (!item) return '';
      if (typeof item === 'string') return item;
      if (item.text) return item.text;
      if (item.description) return item.description;
      if (typeof item === 'object' && Object.keys(item).length === 0) return '';
      return JSON.stringify(item);
    }).filter(Boolean);
  }
  
  // If it's a JSON string, try to parse it
  if (typeof data === 'string' && (data.startsWith('[') || data.startsWith('{'))) {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed.map(item => {
          if (typeof item === 'string') return item;
          if (item && typeof item === 'object' && 'text' in item) return item.text;
          return JSON.stringify(item);
        }).filter(Boolean);
      }
      // If it's not an array after parsing, wrap it in an array
      return [String(parsed)];
    } catch (e) {
      // If parsing fails, treat as a single string
      console.log('Failed to parse JSON string in normalizeSwotData:', e);
      return [data];
    }
  }
  
  // If it's a plain string (not JSON), treat as a single item
  if (typeof data === 'string') {
    return [data];
  }
  
  // For Json type from Supabase, convert to string array
  if (typeof data === 'object' && data !== null) {
    if (Array.isArray(data)) {
      return data.map(item => {
        if (typeof item === 'string') return item;
        if (typeof item === 'object' && item !== null) {
          if ('text' in item) return item.text;
          if ('description' in item) return item.description;
        }
        return JSON.stringify(item);
      }).filter(Boolean); // Remove any possible null or undefined values
    }
  }
  
  // Fallback: convert whatever we have to string array
  console.log('Using fallback conversion in normalizeSwotData for:', data);
  return Array.isArray(data) ? data.map(item => String(item || '')).filter(Boolean) : [String(data)];
};
