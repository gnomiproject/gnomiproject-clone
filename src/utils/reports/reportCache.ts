
import { ArchetypeDetailedData } from '@/types/archetype';
import { AverageData } from './reportDataTransforms';

// Interface for cached report data
export interface CachedReport {
  data: {
    reportData: ArchetypeDetailedData | null;
    userData: any;
    averageData: AverageData;
  };
  timestamp: number;
}

// Simple in-memory cache for report data
const reportCache = new Map<string, CachedReport>();

export const getFromCache = (cacheKey: string): CachedReport | null => {
  if (reportCache.has(cacheKey)) {
    return reportCache.get(cacheKey) || null;
  }
  return null;
};

export const setInCache = (cacheKey: string, data: CachedReport['data']): void => {
  reportCache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
};

export const clearFromCache = (cacheKey: string): void => {
  reportCache.delete(cacheKey);
};
