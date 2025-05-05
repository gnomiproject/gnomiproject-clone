
import { ArchetypeDetailedData } from '@/types/archetype';
import { AverageData } from './reportDataTransforms';
import { toast } from 'sonner';

// Interface for cached report data
export interface CachedReport {
  data: {
    reportData: ArchetypeDetailedData | null;
    userData: any;
    averageData: AverageData;
  };
  timestamp: number;
  expiresAt: number;
}

// Configuration for cache
const CACHE_CONFIG = {
  DEFAULT_TTL_MS: 60 * 60 * 1000, // 60 minutes in milliseconds
  WARNING_THRESHOLD_MS: 50 * 60 * 1000, // 50 minutes in milliseconds
  MINIMUM_VALID_TTL_MS: 5 * 60 * 1000 // 5 minutes in milliseconds
};

// Simple in-memory cache for report data
const reportCache = new Map<string, CachedReport>();

// Check if cached data is still valid
const isCacheValid = (cachedReport: CachedReport | null): boolean => {
  if (!cachedReport) return false;
  
  const now = Date.now();
  const isValid = cachedReport.expiresAt > now;
  const timeRemaining = cachedReport.expiresAt - now;
  
  // If cache is nearing expiration, log a warning
  if (isValid && timeRemaining < CACHE_CONFIG.WARNING_THRESHOLD_MS) {
    console.warn(`[reportCache] Cache for report will expire soon. ${Math.round(timeRemaining / 60000)} minutes remaining`);
    
    // If less than minimum TTL remaining, invalidate cache
    if (timeRemaining < CACHE_CONFIG.MINIMUM_VALID_TTL_MS) {
      console.warn(`[reportCache] Cache invalidated - too close to expiration (${Math.round(timeRemaining / 60000)} minutes remaining)`);
      return false;
    }
  }
  
  return isValid;
};

export const getFromCache = (cacheKey: string): CachedReport | null => {
  const cachedReport = reportCache.get(cacheKey) || null;
  
  // Log cache hit/miss
  if (cachedReport) {
    console.log(`[reportCache] Cache hit for key: ${cacheKey.substring(0, 15)}...`);
  } else {
    console.log(`[reportCache] Cache miss for key: ${cacheKey.substring(0, 15)}...`);
    return null;
  }
  
  // Check if cache is still valid
  if (!isCacheValid(cachedReport)) {
    console.log(`[reportCache] Cache expired for key: ${cacheKey.substring(0, 15)}...`);
    reportCache.delete(cacheKey);
    return null;
  }
  
  // Calculate remaining TTL in minutes
  const remainingMinutes = Math.round((cachedReport.expiresAt - Date.now()) / 60000);
  console.log(`[reportCache] Using cached data with ~${remainingMinutes} minutes TTL remaining`);
  
  return cachedReport;
};

export const setInCache = (cacheKey: string, data: CachedReport['data']): void => {
  const now = Date.now();
  const expiresAt = now + CACHE_CONFIG.DEFAULT_TTL_MS;
  
  reportCache.set(cacheKey, {
    data,
    timestamp: now,
    expiresAt
  });
  
  console.log(`[reportCache] Data cached with key: ${cacheKey.substring(0, 15)}... (expires in ${CACHE_CONFIG.DEFAULT_TTL_MS / 60000} minutes)`);
};

export const clearFromCache = (cacheKey: string): void => {
  if (reportCache.has(cacheKey)) {
    console.log(`[reportCache] Clearing cache for key: ${cacheKey.substring(0, 15)}...`);
    reportCache.delete(cacheKey);
  } else {
    console.log(`[reportCache] No cache found for key: ${cacheKey.substring(0, 15)}...`);
  }
};

// New function to clear all cache
export const clearAllCache = (): void => {
  const itemCount = reportCache.size;
  reportCache.clear();
  console.log(`[reportCache] Cleared all cached data (${itemCount} items)`);
  toast.info(`Cache cleared (${itemCount} reports)`, {
    description: "All report data will be re-fetched from the server"
  });
};

// New function to get cache stats for debugging
export const getCacheStats = (): {
  size: number;
  keys: string[];
  oldestTimestamp: number | null;
  newestTimestamp: number | null;
} => {
  let oldestTimestamp = null;
  let newestTimestamp = null;
  const keys: string[] = [];
  
  reportCache.forEach((value, key) => {
    keys.push(key);
    
    if (oldestTimestamp === null || value.timestamp < oldestTimestamp) {
      oldestTimestamp = value.timestamp;
    }
    
    if (newestTimestamp === null || value.timestamp > newestTimestamp) {
      newestTimestamp = value.timestamp;
    }
  });
  
  return {
    size: reportCache.size,
    keys,
    oldestTimestamp,
    newestTimestamp
  };
};

// New function to check if any items in cache are nearing expiration
export const checkCacheHealth = (): {
  healthy: boolean;
  nearingExpiration: number;
  expired: number;
  total: number;
} => {
  let nearingExpiration = 0;
  let expired = 0;
  const now = Date.now();
  
  reportCache.forEach(cachedReport => {
    const timeRemaining = cachedReport.expiresAt - now;
    
    if (timeRemaining <= 0) {
      expired++;
    } else if (timeRemaining < CACHE_CONFIG.WARNING_THRESHOLD_MS) {
      nearingExpiration++;
    }
  });
  
  return {
    healthy: (nearingExpiration === 0 && expired === 0),
    nearingExpiration,
    expired,
    total: reportCache.size
  };
};
