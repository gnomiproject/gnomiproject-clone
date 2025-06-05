// Type definitions for better type safety
export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// Helper function to safely convert JSON to SWOT Analysis
export const convertJsonToSwotAnalysis = (data: any): SwotAnalysis | undefined => {
  if (!data) return undefined;
  
  // If it's already a proper SWOT object
  if (typeof data === 'object' && !Array.isArray(data) && data.strengths) {
    return {
      strengths: convertJsonToStringArray(data.strengths) || [],
      weaknesses: convertJsonToStringArray(data.weaknesses) || [],
      opportunities: convertJsonToStringArray(data.opportunities) || [],
      threats: convertJsonToStringArray(data.threats) || []
    };
  }
  
  // If it's a JSON string
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      return convertJsonToSwotAnalysis(parsed);
    } catch {
      return undefined;
    }
  }
  
  return undefined;
};

// Helper function to safely convert JSON to distinctive metrics array with improved property handling
export const convertJsonToDistinctiveMetrics = (data: any): Array<any> => {
  if (!data) return [];
  
  // Handle array data
  if (Array.isArray(data)) {
    return data.map(metric => normalizeMetricProperties(metric));
  }
  
  // Handle string data
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed.map(metric => normalizeMetricProperties(metric));
      }
    } catch {
      return [];
    }
  }
  
  // Handle object data
  if (typeof data === 'object') {
    return [normalizeMetricProperties(data)];
  }
  
  return [];
};

// Helper function to normalize metric property names for consistency
const normalizeMetricProperties = (metric: any): any => {
  if (!metric || typeof metric !== 'object') return metric;
  
  return {
    // Keep all original properties
    ...metric,
    // Normalize property names - ensure both naming conventions are available
    metric: metric.metric || metric.Metric || '',
    category: metric.category || metric.Category || '',
    value: metric.value ?? metric.archetype_value ?? metric['Archetype Value'] ?? 0,
    average: metric.average ?? metric.archetype_average ?? metric['Archetype Average'] ?? 0,
    difference: metric.difference ?? metric.Difference ?? 0,
    significance: metric.significance || metric.Significance || '',
    // Also keep the original property names for backward compatibility
    archetype_value: metric.archetype_value ?? metric.value ?? metric['Archetype Value'] ?? 0,
    archetype_average: metric.archetype_average ?? metric.average ?? metric['Archetype Average'] ?? 0
  };
};

// Helper function to safely convert JSON to string array
export const convertJsonToStringArray = (data: any): string[] => {
  if (!data) return [];
  
  if (Array.isArray(data)) {
    return data.filter(item => typeof item === 'string' || typeof item === 'number')
               .map(item => String(item));
  }
  
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      return convertJsonToStringArray(parsed);
    } catch {
      // If it's not JSON, treat as a single string or split by newlines
      return data.split('\n').filter(Boolean);
    }
  }
  
  return [];
};

// Helper function to safely convert JSON to strategic recommendations
export const convertJsonToStrategicRecommendations = (data: any): Array<any> => {
  if (!data) return [];
  
  if (Array.isArray(data)) {
    return data;
  }
  
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  
  return [];
};
