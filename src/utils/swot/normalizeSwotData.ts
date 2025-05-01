
/**
 * Normalizes SWOT data into a string array format
 * This simplifies the various formats that might exist in the database
 */
export const normalizeSwotData = (data: any): string[] => {
  console.log("[normalizeSwotData] Input:", {
    dataType: typeof data,
    isNull: data === null,
    isUndefined: data === undefined,
    isArray: Array.isArray(data),
    isString: typeof data === 'string',
    value: data,
    rawData: JSON.stringify(data) // Show the actual content
  });
  
  // Return empty array if data is null, undefined, or empty
  if (!data) {
    console.log("[normalizeSwotData] Returning empty array for null/undefined data");
    return [];
  }
  
  // If it's already an array of strings, return it
  if (Array.isArray(data) && data.every(item => typeof item === 'string')) {
    console.log("[normalizeSwotData] Already an array of strings, returning as is");
    return data;
  }
  
  // If it's an array of objects with text property (common format in our DB)
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && data[0]?.text) {
    console.log("[normalizeSwotData] Array of objects with text property, extracting text");
    return data.map(item => item?.text || '').filter(Boolean);
  }
  
  // If it's a JSON string, try to parse it
  if (typeof data === 'string' && (data.startsWith('[') || data.startsWith('{'))) {
    try {
      console.log("[normalizeSwotData] Attempting to parse JSON string");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        console.log("[normalizeSwotData] Successfully parsed as array");
        return parsed.map(item => {
          if (typeof item === 'string') return item;
          if (item && typeof item === 'object' && 'text' in item) return item.text;
          return String(item);
        }).filter(Boolean);
      }
      // If it's not an array after parsing, wrap it in an array
      console.log("[normalizeSwotData] Parsed JSON is not an array, wrapping in array");
      return [String(parsed)];
    } catch (e) {
      // If parsing fails, treat as a single string
      console.log("[normalizeSwotData] JSON parsing failed, treating as single string");
      return [data];
    }
  }
  
  // If it's a plain string (not JSON), split by newlines
  if (typeof data === 'string') {
    console.log("[normalizeSwotData] Plain string, splitting by newlines");
    return data.split('\n').filter(Boolean);
  }
  
  // Empty array handling - if data is an empty array
  if (Array.isArray(data) && data.length === 0) {
    console.log("[normalizeSwotData] Empty array received, returning as is");
    return data;
  }
  
  // Fallback: convert to string array
  console.log("[normalizeSwotData] Using fallback conversion to string array");
  const result = Array.isArray(data) ? 
    data.map(item => String(item || '')).filter(Boolean) : 
    [String(data)];
  
  console.log("[normalizeSwotData] Result:", result);
  return result;
};
