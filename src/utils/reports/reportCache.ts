
import { ArchetypeDetailedData } from '@/types/archetype';
import { ProcessedReportData } from './reportDataTransforms';
import { toast } from 'sonner';

// Interface for cached report data
export interface CachedReport {
  data: ProcessedReportData;
  timestamp: number;
  expiresAt: number;
  version: number; // Add version for cache invalidation
}

// Enhanced configuration for cache with version checking
const CACHE_CONFIG = {
  DEFAULT_TTL_MS: 24 * 60 * 60 * 1000, // 24 hours
  WARNING_THRESHOLD_MS: 4 * 60 * 60 * 1000, // 4 hours before expiration
  MINIMUM_VALID_TTL_MS: 30 * 60 * 1000, // 30 minutes minimum validity
  SESSION_STORAGE_KEY: 'report-cache-manifest',
  CURRENT_VERSION: 2, // Increment to invalidate all existing cache
  EXPECTED_AVERAGE_VALUES: {
    costPEPY: 13440,
    riskScore: 0.95,
    emergencyVisits: 135,
    specialistVisits: 2250
  }
};

// Simple in-memory cache for report data
const reportCache = new Map<string, CachedReport>();

// Clear all existing cache on startup if version mismatch
const clearOldVersionCache = () => {
  console.log('[reportCache] Checking for version mismatch and clearing old cache...');
  
  try {
    const savedCache = sessionStorage.getItem(CACHE_CONFIG.SESSION_STORAGE_KEY);
    if (savedCache) {
      const parsedCache = JSON.parse(savedCache);
      let needsClear = false;
      
      // Check if any cached items have old version
      Object.entries(parsedCache).forEach(([key, value]: [string, any]) => {
        if (!value.version || value.version < CACHE_CONFIG.CURRENT_VERSION) {
          needsClear = true;
        }
      });
      
      if (needsClear) {
        console.log('[reportCache] Old version cache detected, clearing all cache');
        sessionStorage.removeItem(CACHE_CONFIG.SESSION_STORAGE_KEY);
        reportCache.clear();
        return;
      }
    }
    
    // Restore valid cache
    if (savedCache) {
      const parsedCache = JSON.parse(savedCache);
      Object.entries(parsedCache).forEach(([key, value]) => {
        reportCache.set(key, value as CachedReport);
      });
      console.log(`[reportCache] Restored ${Object.keys(parsedCache).length} valid cache items`);
    }
  } catch (e) {
    console.warn('[reportCache] Failed to check/restore cache, clearing:', e);
    sessionStorage.removeItem(CACHE_CONFIG.SESSION_STORAGE_KEY);
    reportCache.clear();
  }
};

// Initialize cache cleanup on module load
clearOldVersionCache();

// Helper function to persist cache to sessionStorage
const persistCache = () => {
  try {
    const cacheObject = Object.fromEntries(reportCache.entries());
    sessionStorage.setItem(CACHE_CONFIG.SESSION_STORAGE_KEY, JSON.stringify(cacheObject));
  } catch (e) {
    console.warn('[reportCache] Failed to persist cache to session storage:', e);
  }
};

// Validate cached average data has correct values
const validateAverageData = (cachedData: ProcessedReportData): boolean => {
  if (!cachedData.averageData) {
    console.warn('[reportCache] Cache validation failed: no averageData');
    return false;
  }
  
  const expected = CACHE_CONFIG.EXPECTED_AVERAGE_VALUES;
  const actual = cachedData.averageData;
  
  const costPEPY = actual["Cost_Medical & RX Paid Amount PEPY"];
  const riskScore = actual["Risk_Average Risk Score"];
  const emergencyVisits = actual["Util_Emergency Visits per 1k Members"];
  const specialistVisits = actual["Util_Specialist Visits per 1k Members"];
  
  const isValid = (
    costPEPY === expected.costPEPY &&
    riskScore === expected.riskScore &&
    emergencyVisits === expected.emergencyVisits &&
    specialistVisits === expected.specialistVisits
  );
  
  if (!isValid) {
    console.warn('[reportCache] Cache validation failed: incorrect average values', {
      expected,
      actual: { costPEPY, riskScore, emergencyVisits, specialistVisits }
    });
  }
  
  return isValid;
};

// Check if cached data is still valid
const isCacheValid = (cachedReport: CachedReport | null): boolean => {
  if (!cachedReport) return false;
  
  // Check version
  if (!cachedReport.version || cachedReport.version < CACHE_CONFIG.CURRENT_VERSION) {
    console.warn('[reportCache] Cache invalidated due to version mismatch');
    return false;
  }
  
  const now = Date.now();
  const isTimeValid = cachedReport.expiresAt > now;
  const timeRemaining = cachedReport.expiresAt - now;
  
  if (!isTimeValid) {
    console.warn('[reportCache] Cache expired');
    return false;
  }
  
  // Validate average data correctness
  if (!validateAverageData(cachedReport.data)) {
    console.warn('[reportCache] Cache invalidated due to incorrect average values');
    return false;
  }
  
  // If cache is nearing expiration, log a warning
  if (timeRemaining < CACHE_CONFIG.WARNING_THRESHOLD_MS) {
    console.warn(`[reportCache] Cache will expire soon. ${Math.round(timeRemaining / 60000)} minutes remaining`);
    
    // If less than minimum TTL remaining, invalidate cache
    if (timeRemaining < CACHE_CONFIG.MINIMUM_VALID_TTL_MS) {
      console.warn(`[reportCache] Cache invalidated - too close to expiration`);
      return false;
    }
  }
  
  return true;
};

// Get data from cache with validation
export const getFromCache = (key: string): ProcessedReportData | null => {
  const cachedReport = reportCache.get(key);
  
  // Check if cache is valid, return null if not
  if (!isCacheValid(cachedReport || null)) {
    if (cachedReport) {
      console.log(`[reportCache] Removing invalid cache for ${key}`);
      reportCache.delete(key);
      persistCache();
    }
    console.log(`[reportCache] Cache miss or invalid for ${key}`);
    return null;
  }
  
  console.log(`[reportCache] Cache hit for ${key}, valid for ${Math.round((cachedReport!.expiresAt - Date.now()) / 60000)} more minutes`);
  return cachedReport!.data;
};

// Set data in cache with validation
export const setInCache = (key: string, data: ProcessedReportData, ttlMs: number = CACHE_CONFIG.DEFAULT_TTL_MS): void => {
  // Validate data before caching
  if (!validateAverageData(data)) {
    console.error(`[reportCache] Refusing to cache invalid data for ${key}`);
    return;
  }
  
  const now = Date.now();
  
  const cacheItem: CachedReport = {
    data,
    timestamp: now,
    expiresAt: now + ttlMs,
    version: CACHE_CONFIG.CURRENT_VERSION
  };
  
  reportCache.set(key, cacheItem);
  persistCache();
  console.log(`[reportCache] Set ${key} in cache with version ${CACHE_CONFIG.CURRENT_VERSION}, expires in ${Math.round(ttlMs / 60000)} minutes`);
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
  sessionStorage.removeItem(CACHE_CONFIG.SESSION_STORAGE_KEY);
  console.log(`[reportCache] Cleared all cache entries`);
  
  toast.success('Cache cleared', {
    description: 'All cached report data has been cleared and will be refreshed'
  });
};

// Force clear all problematic cache (for fixing current issue)
export const clearProblematicCache = (): void => {
  console.log('[reportCache] 🧹 Clearing all problematic cache with incorrect averages');
  
  // Clear in-memory cache
  reportCache.clear();
  
  // Clear session storage
  try {
    sessionStorage.removeItem(CACHE_CONFIG.SESSION_STORAGE_KEY);
    console.log('[reportCache] Session storage cache cleared');
  } catch (e) {
    console.error('[reportCache] Error clearing session storage:', e);
  }
  
  // Clear localStorage cache keys that might contain stale data
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('report-') || key.includes('average-data') || key.includes('archetype-'))) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      console.log(`[reportCache] Removed localStorage key: ${key}`);
    });
    
    console.log(`[reportCache] Cleared ${keysToRemove.length} localStorage cache entries`);
  } catch (e) {
    console.error('[reportCache] Error clearing localStorage:', e);
  }
  
  toast.success('Cache Cleared', {
    description: 'All cached data cleared. The page will refresh with correct values.'
  });
};

// Check cache health - returns diagnostic information
export const checkCacheHealth = () => {
  const now = Date.now();
  const cacheEntries = Array.from(reportCache.entries());
  
  const health = {
    totalEntries: cacheEntries.length,
    validEntries: 0,
    expiredEntries: 0,
    warningEntries: 0,
    invalidEntries: 0,
    memoryUsage: cacheEntries.length * 1024, // rough estimate
    currentVersion: CACHE_CONFIG.CURRENT_VERSION
  };
  
  cacheEntries.forEach(([key, cached]) => {
    const timeRemaining = cached.expiresAt - now;
    const versionValid = cached.version >= CACHE_CONFIG.CURRENT_VERSION;
    const dataValid = validateAverageData(cached.data);
    
    if (!versionValid || !dataValid) {
      health.invalidEntries++;
    } else if (timeRemaining <= 0) {
      health.expiredEntries++;
    } else if (timeRemaining < CACHE_CONFIG.WARNING_THRESHOLD_MS) {
      health.warningEntries++;
    } else {
      health.validEntries++;
    }
  });
  
  return health;
};

// Get cache statistics
export const getCacheStats = () => {
  const now = Date.now();
  const entries = Array.from(reportCache.entries()).map(([key, cached]) => ({
    key,
    age: Math.round((now - cached.timestamp) / 60000), // minutes
    timeToExpiry: Math.round((cached.expiresAt - now) / 60000), // minutes
    isExpired: cached.expiresAt <= now,
    version: cached.version || 'unknown',
    isVersionValid: (cached.version || 0) >= CACHE_CONFIG.CURRENT_VERSION,
    hasValidAverageData: validateAverageData(cached.data)
  }));
  
  return {
    totalEntries: reportCache.size,
    entries,
    config: CACHE_CONFIG
  };
};
