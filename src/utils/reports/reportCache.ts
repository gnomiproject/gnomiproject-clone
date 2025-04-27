
// Simple in-memory cache for report data
const reportCache = new Map();

export const getFromCache = (cacheKey: string) => {
  if (reportCache.has(cacheKey)) {
    return reportCache.get(cacheKey);
  }
  return null;
};

export const setInCache = (cacheKey: string, data: any) => {
  reportCache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
};

export const clearFromCache = (cacheKey: string) => {
  reportCache.delete(cacheKey);
};

