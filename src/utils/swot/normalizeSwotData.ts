
/**
 * Normalizes SWOT data into a string array format
 * This simplifies the various formats that might exist in the database
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
  
  // If it's a JSON string, try to parse it
  if (typeof data === 'string' && (data.startsWith('[') || data.startsWith('{'))) {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed.map(item => {
          if (typeof item === 'string') return item;
          if (item && typeof item === 'object' && 'text' in item) return item.text;
          return String(item);
        }).filter(Boolean);
      }
      // If it's not an array after parsing, wrap it in an array
      return [String(parsed)];
    } catch (e) {
      // If parsing fails, treat as a single string
      return [data];
    }
  }
  
  // If it's a plain string (not JSON), split by newlines
  if (typeof data === 'string') {
    return data.split('\n').filter(Boolean);
  }
  
  // Fallback: convert to string array
  return Array.isArray(data) ? 
    data.map(item => String(item || '')).filter(Boolean) : 
    [String(data)];
};
