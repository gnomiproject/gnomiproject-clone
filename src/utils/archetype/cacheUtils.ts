
// In-memory cache for archetype data
const archetypeCache = new Map();

/**
 * Get data from the archetype cache
 */
export const getCachedArchetype = (archetypeId: string, skipCache: boolean = false) => {
  if (!archetypeId) return null;
  
  const cacheKey = `archetype-${archetypeId}`;
  if (!skipCache && archetypeCache.has(cacheKey)) {
    console.log(`Using cached data for archetype ${archetypeId}`);
    return archetypeCache.get(cacheKey).data;
  }
  return null;
};

/**
 * Store data in the archetype cache
 */
export const cacheArchetype = (archetypeId: string, data: any) => {
  if (!archetypeId || !data) return;
  
  const cacheKey = `archetype-${archetypeId}`;
  archetypeCache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
  console.log(`Stored archetype ${archetypeId} in cache`);
};

/**
 * Clear a specific archetype from the cache
 */
export const clearArchetypeFromCache = (archetypeId: string) => {
  if (!archetypeId) return;
  
  const cacheKey = `archetype-${archetypeId}`;
  if (archetypeCache.has(cacheKey)) {
    archetypeCache.delete(cacheKey);
    console.log(`Cleared archetype ${archetypeId} from cache`);
  }
};

/**
 * Debug function to get cache status
 */
export const getCacheStatus = () => {
  const keys = Array.from(archetypeCache.keys());
  return {
    size: archetypeCache.size,
    keys
  };
};
