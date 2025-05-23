import { ArchetypeDetailedData } from '@/types/archetype';
import { AverageData } from './reportDataTransforms';
import { ProcessedReportData } from './reportDataTransforms';
import { toast } from 'sonner';

// Interface for cached report data
export interface CachedReport {
  data: ProcessedReportData;
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

// Get data from cache
export const getFromCache = (key: string): ProcessedReportData | null => {
  const cachedReport = reportCache.get(key);
  
  // Check if cache is valid, return null if not
  if (!isCacheValid(cachedReport || null)) {
    console.log(`[reportCache] Cache miss or expired for ${key}`);
    return null;
  }
  
  console.log(`[reportCache] Cache hit for ${key}, valid for ${Math.round((cachedReport!.expiresAt - Date.now()) / 60000)} more minutes`);
  return cachedReport!.data;
};

// Set data in cache
export const setInCache = (key: string, data: ProcessedReportData, ttlMs: number = CACHE_CONFIG.DEFAULT_TTL_MS): void => {
  const now = Date.now();
  
  const cacheItem: CachedReport = {
    data,
    timestamp: now,
    expiresAt: now + ttlMs
  };
  
  reportCache.set(key, cacheItem);
  persistCache();
  console.log(`[reportCache] Set ${key} in cache, expires in ${Math.round(ttlMs / 60000)} minutes`);
};

// Clear data from cache
export const clearFromCache = (key: string): void => {
  reportCache.delete(key);
  persistCache();
  console.log(`[reportCache] Cleared ${key} from cache`);
};

// Clear all cache
export const clearAllCache = (): void => {
  reportCache.clear();
  persistCache();
  console.log(`[reportCache] Cleared all cache entries`);
  
  toast.success('Cache cleared', {
    description: 'All cached report data has been cleared'
  });
};
