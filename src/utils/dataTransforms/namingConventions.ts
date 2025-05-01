
/**
 * Utility functions to handle naming convention inconsistencies
 * between database column names (snake_case) and TypeScript interfaces (camelCase)
 */

/**
 * Convert snake_case string to camelCase
 * Example: 'hello_world' -> 'helloWorld'
 */
export const snakeToCamel = (str: string): string => {
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace('-', '').replace('_', '')
  );
};

/**
 * Convert camelCase string to snake_case
 * Example: 'helloWorld' -> 'hello_world'
 */
export const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

/**
 * Recursively transforms object keys from snake_case to camelCase
 */
export const transformKeysToCamelCase = <T extends Record<string, any>>(
  obj: Record<string, any>
): T => {
  if (typeof obj !== 'object' || obj === null) {
    return obj as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => transformKeysToCamelCase(item)) as unknown as T;
  }

  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = snakeToCamel(key);
    const value = obj[key];
    acc[camelKey] = typeof value === 'object' && value !== null 
      ? transformKeysToCamelCase(value) 
      : value;
    return acc;
  }, {} as Record<string, any>) as T;
};

/**
 * Recursively transforms object keys from camelCase to snake_case
 */
export const transformKeysToSnakeCase = <T extends Record<string, any>>(
  obj: Record<string, any>
): T => {
  if (typeof obj !== 'object' || obj === null) {
    return obj as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => transformKeysToSnakeCase(item)) as unknown as T;
  }

  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = camelToSnake(key);
    const value = obj[key];
    acc[snakeKey] = typeof value === 'object' && value !== null 
      ? transformKeysToSnakeCase(value) 
      : value;
    return acc;
  }, {} as Record<string, any>) as T;
};

/**
 * Maps object properties from a database response (snake_case)
 * to their TypeScript interface equivalents (camelCase)
 * Also keeps original properties for backward compatibility
 */
export const mapDatabaseResponseToInterface = <T extends Record<string, any>>(
  data: Record<string, any>
): T => {
  if (!data) return data as T;
  
  const result = { ...data } as Record<string, any>;
  
  // Map common snake_case properties to camelCase
  if (result.hex_color !== undefined && result.hexColor === undefined) {
    result.hexColor = result.hex_color;
  }
  
  if (result.family_id !== undefined && result.familyId === undefined) {
    result.familyId = result.family_id;
  }
  
  if (result.family_name !== undefined && result.familyName === undefined) {
    result.familyName = result.family_name;
  }
  
  if (result.short_description !== undefined && result.shortDescription === undefined) {
    result.shortDescription = result.short_description;
  }
  
  if (result.long_description !== undefined && result.longDescription === undefined) {
    result.longDescription = result.long_description;
  }
  
  if (result.archetype_id !== undefined && result.archetypeId === undefined) {
    result.archetypeId = result.archetype_id;
  }
  
  if (result.archetype_name !== undefined && result.archetypeName === undefined) {
    result.archetypeName = result.archetype_name;
  }
  
  if (result.key_characteristics !== undefined && result.keyCharacteristics === undefined) {
    result.keyCharacteristics = result.key_characteristics;
  }
  
  return result as T;
};
