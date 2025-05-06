
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

// Enhanced configuration for cache
const CACHE_CONFIG = {
  DEFAULT_TTL_MS: 24 * 60 * 60 * 1000, // 24 hours (increased from 60 minutes)
  WARNING_THRESHOLD_MS: 4 * 60 * 60 * 1000, // 4 hours before expiration to show warning
  MINIMUM_VALID_TTL_MS: 30 * 60 * 1000, // 30 minutes minimum validity (increased from 5 min)
  SESSION_STORAGE_KEY: 'report-cache-manifest'
};

// Simple in-memory cache for report data
const reportCache = new Map<string, CachedReport>();

// Initialize cache from sessionStorage if available
try {
  const savedCache = sessionStorage.getItem(CACHE_CONFIG.SESSION_STORAGE_KEY);
  if (savedCache) {
    const parsedCache = JSON.parse(savedCache);
    console.log(`[reportCache] Restoring ${Object.keys(parsedCache).length} cache items from session storage`);
    
    Object.entries(parsedCache).forEach(([key, value]) => {
      reportCache.set(key, value as CachedReport);
    });
  }
} catch (e) {
  console.warn('[reportCache] Failed to restore cache from session storage:', e);
}

// Helper function to persist cache to sessionStorage
const persistCache = () => {
  try {
    const cacheObject = Object.fromEntries(reportCache.entries());
    sessionStorage.setItem(CACHE_CONFIG.SESSION_STORAGE_KEY, JSON.stringify(cacheObject));
  } catch (e) {
    console.warn('[reportCache] Failed to persist cache to session storage:', e);
  }
};

// Check if cached data is still valid
const isCacheValid = (cachedReport: CachedReport | null): boolean => {
  if (!cachedReport) return false;
  
  const now = Date.now();
  const isValid = cachedReport.expiresAt > now;
  const timeRemaining = cachedReport.expiresAt - now;
  
  // If cache is nearing expiration, log a warning
  if (isValid && timeRemaining < CACHE_CONFIG.WARNING_THRESHOLD_MS) {
    console.warn(`[reportCache] Cache will expire soon. ${Math.round(timeRemaining / 60000)} minutes remaining`);
    
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
    persistCache();
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
  
  const entry = {
    data,
    timestamp: now,
    expiresAt
  };
  
  reportCache.set(cacheKey, entry);
  persistCache();
  
  console.log(`[reportCache] Data cached with key: ${cacheKey.substring(0, 15)}... (expires in ${CACHE_CONFIG.DEFAULT_TTL_MS / 60000} minutes)`);
};

export const clearFromCache = (cacheKey: string): void => {
  if (reportCache.has(cacheKey)) {
    console.log(`[reportCache] Clearing cache for key: ${cacheKey.substring(0, 15)}...`);
    reportCache.delete(cacheKey);
    persistCache();
  } else {
    console.log(`[reportCache] No cache found for key: ${cacheKey.substring(0, 15)}...`);
  }
};

// New function to clear all cache
export const clearAllCache = (): void => {
  const itemCount = reportCache.size;
  reportCache.clear();
  sessionStorage.removeItem(CACHE_CONFIG.SESSION_STORAGE_KEY);
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
  oldestKey: string | null;
  newestKey: string | null;
  averageTtlMinutes: number;
} => {
  let oldestTimestamp = null;
  let newestTimestamp = null;
  let oldestKey = null;
  let newestKey = null;
  let totalTtl = 0;
  const keys: string[] = [];
  const now = Date.now();
  
  reportCache.forEach((value, key) => {
    keys.push(key);
    
    if (oldestTimestamp === null || value.timestamp < oldestTimestamp) {
      oldestTimestamp = value.timestamp;
      oldestKey = key;
    }
    
    if (newestTimestamp === null || value.timestamp > newestTimestamp) {
      newestTimestamp = value.timestamp;
      newestKey = key;
    }
    
    totalTtl += value.expiresAt - now;
  });
  
  const averageTtlMinutes = reportCache.size > 0 ? Math.round((totalTtl / reportCache.size) / 60000) : 0;
  
  return {
    size: reportCache.size,
    keys,
    oldestTimestamp,
    newestTimestamp,
    oldestKey,
    newestKey,
    averageTtlMinutes
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
