
/**
 * Normalizes SWOT data into a string array format
 * This simplifies the various formats that might exist in level4_report_secure
 */
export const normalizeSwotData = (data: any): string[] => {
  console.log("[normalizeSwotData] Input from level4_report_secure:", {
    dataType: typeof data,
    isNull: data === null,
    isUndefined: data === undefined,
    isArray: Array.isArray(data),
    isString: typeof data === 'string',
    value: data,
    rawDataSample: data ? JSON.stringify(data).substring(0, 100) + (JSON.stringify(data).length > 100 ? '...' : '') : 'null' // Show sample of content
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
  
  // If it's an array of objects with text property (common format in level4_report_secure)
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
  
  // Check for specific object formats we might have in level4_report_secure
  if (typeof data === 'object' && data !== null) {
    // If the object itself contains the SWOT elements as properties
    if ('strengths' in data || 'weaknesses' in data || 'opportunities' in data || 'threats' in data) {
      console.log("[normalizeSwotData] Found SWOT structure in object itself - handling inner SWOT objects is handled at component level");
      // This case is handled at the component level - we shouldn't end up here
      // But if we do, return an empty array to avoid errors
      return [];
    }
    
    // If object has entries or items property that is an array
    if (data.entries && Array.isArray(data.entries)) {
      console.log("[normalizeSwotData] Found entries array in object");
      return data.entries.map((entry: any) => {
        if (typeof entry === 'string') return entry;
        if (entry && typeof entry === 'object' && entry.text) return entry.text;
        return String(entry);
      }).filter(Boolean);
    }
    
    if (data.items && Array.isArray(data.items)) {
      console.log("[normalizeSwotData] Found items array in object");
      return data.items.map((item: any) => {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object' && item.text) return item.text;
        return String(item);
      }).filter(Boolean);
    }
    
    // If object has points property that is an array
    if (data.points && Array.isArray(data.points)) {
      console.log("[normalizeSwotData] Found points array in object");
      return data.points.map((point: any) => {
        if (typeof point === 'string') return point;
        if (point && typeof point === 'object' && point.text) return point.text;
        return String(point);
      }).filter(Boolean);
    }
  }
  
  // Fallback: convert to string array
  console.log("[normalizeSwotData] Using fallback conversion to string array");
  const result = Array.isArray(data) ? 
    data.map(item => String(item || '')).filter(Boolean) : 
    [String(data)];
  
  console.log("[normalizeSwotData] Result:", result);
  return result;
};
