
import { Json } from '@/integrations/supabase/types';
import { SwotAnalysis, DistinctiveMetric } from '@/types/archetype';

/**
 * Safely converts Json to SwotAnalysis with proper validation and fallbacks
 */
export function convertJsonToSwotAnalysis(json: Json): SwotAnalysis {
  if (!json || typeof json !== 'object' || Array.isArray(json)) {
    return {
      strengths: [],
      weaknesses: [],
      opportunities: [],
      threats: []
    };
  }

  const obj = json as { [key: string]: Json };
  
  return {
    strengths: convertJsonToStringArray(obj.strengths || []),
    weaknesses: convertJsonToStringArray(obj.weaknesses || []),
    opportunities: convertJsonToStringArray(obj.opportunities || []),
    threats: convertJsonToStringArray(obj.threats || [])
  };
}

/**
 * Safely converts Json to DistinctiveMetric array with proper validation and fallbacks
 */
export function convertJsonToDistinctiveMetrics(json: Json): DistinctiveMetric[] {
  if (!json || !Array.isArray(json)) {
    return [];
  }

  return json
    .filter((item): item is { [key: string]: Json } => 
      item && typeof item === 'object' && !Array.isArray(item)
    )
    .map(item => ({
      metric: typeof item.metric === 'string' ? item.metric : '',
      category: typeof item.category === 'string' ? item.category : '',
      archetype_value: typeof item.archetype_value === 'number' ? item.archetype_value : 0,
      archetype_average: typeof item.archetype_average === 'number' ? item.archetype_average : 0,
      difference: typeof item.difference === 'number' ? item.difference : 0,
      significance: typeof item.significance === 'string' ? item.significance : undefined
    }));
}

/**
 * Safely converts Json to string array with proper validation and fallbacks
 */
export function convertJsonToStringArray(json: Json): string[] {
  if (!json) {
    return [];
  }

  // If it's already an array
  if (Array.isArray(json)) {
    return json
      .filter((item): item is string => typeof item === 'string')
      .filter(item => item.trim().length > 0);
  }

  // If it's a string, try to parse it or split it
  if (typeof json === 'string') {
    // Try to parse as JSON first
    try {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed)) {
        return parsed
          .filter((item): item is string => typeof item === 'string')
          .filter(item => item.trim().length > 0);
      }
    } catch {
      // If JSON parsing fails, treat as single string or comma-separated
      if (json.includes(',')) {
        return json.split(',').map(s => s.trim()).filter(s => s.length > 0);
      }
      return json.trim() ? [json.trim()] : [];
    }
  }

  return [];
}

/**
 * Safely converts Json to strategic recommendations array
 */
export function convertJsonToStrategicRecommendations(json: Json): Array<{
  recommendation_number: number;
  title: string;
  description: string;
  metrics_references?: any[];
}> {
  if (!json || !Array.isArray(json)) {
    return [];
  }

  return json
    .filter((item): item is { [key: string]: Json } => 
      item && typeof item === 'object' && !Array.isArray(item)
    )
    .map((item, index) => ({
      recommendation_number: typeof item.recommendation_number === 'number' ? item.recommendation_number : index + 1,
      title: typeof item.title === 'string' ? item.title : '',
      description: typeof item.description === 'string' ? item.description : '',
      metrics_references: Array.isArray(item.metrics_references) ? item.metrics_references : []
    }));
}
