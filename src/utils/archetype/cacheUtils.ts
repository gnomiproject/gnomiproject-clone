
// In-memory cache for archetype data
const archetypeCache = new Map();

/**
 * Get data from the archetype cache
 */
export const getCachedArchetype = (archetypeId: string, skipCache: boolean = false) => {
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
  const cacheKey = `archetype-${archetypeId}`;
  if (data) {
    archetypeCache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
  }
};

/**
 * Clear a specific archetype from the cache
 */
export const clearArchetypeFromCache = (archetypeId: string) => {
  const cacheKey = `archetype-${archetypeId}`;
  archetypeCache.delete(cacheKey);
};
