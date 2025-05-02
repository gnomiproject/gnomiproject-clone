
/**
 * Utility for generating and managing secure report access tokens
 */

import { v4 as uuidv4 } from 'uuid';

// Key for storing admin tokens in localStorage
const ADMIN_TOKENS_KEY = 'admin_report_tokens';

/**
 * Generate a secure token for accessing a specific archetype report
 * @param archetypeId The ID of the archetype
 * @returns The generated token
 */
export const generateReportAccessToken = (archetypeId: string): string => {
  // Generate a random token using UUID v4 for better security
  const token = uuidv4();
  
  try {
    // Store the token in localStorage with archetype ID as key
    const storedTokens = JSON.parse(localStorage.getItem(ADMIN_TOKENS_KEY) || '{}');
    storedTokens[archetypeId] = token;
    localStorage.setItem(ADMIN_TOKENS_KEY, JSON.stringify(storedTokens));
    console.log(`Token generated for ${archetypeId}:`, token);
  } catch (error) {
    console.error('Error storing token:', error);
  }
  
  return token;
};

/**
 * Get the secure URL for viewing a report
 * @param archetypeId The ID of the archetype
 * @returns The secure URL including a token
 */
export const getSecureReportUrl = (archetypeId: string): string => {
  // Use existing token if available, generate a new one otherwise
  const token = getReportToken(archetypeId) || generateReportAccessToken(archetypeId);
  return `/report/${archetypeId}/${token}`;
};

/**
 * Validate an access token for a report
 * @param archetypeId The ID of the archetype
 * @param token The token to validate
 * @returns Boolean indicating if the token is valid
 */
export const validateReportToken = (archetypeId: string, token: string): boolean => {
  try {
    // If no token is provided, validation fails
    if (!token) {
      console.log('No token provided for validation');
      return false;
    }

    const storedTokens = JSON.parse(localStorage.getItem(ADMIN_TOKENS_KEY) || '{}');
    const storedToken = storedTokens[archetypeId];
    
    // Log validation attempt for debugging
    console.log(`Validating token for ${archetypeId}:`, { 
      provided: token, 
      stored: storedToken,
      match: storedToken === token,
      timestamp: new Date().toISOString()
    });
    
    return storedToken === token;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

/**
 * Get the token for a specific archetype report
 * @param archetypeId The ID of the archetype
 * @returns The token if it exists, or null
 */
export const getReportToken = (archetypeId: string): string | null => {
  try {
    const storedTokens = JSON.parse(localStorage.getItem(ADMIN_TOKENS_KEY) || '{}');
    return storedTokens[archetypeId] || null;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

/**
 * Clear all stored tokens
 */
export const clearAllReportTokens = (): void => {
  localStorage.removeItem(ADMIN_TOKENS_KEY);
  console.log('All report tokens cleared');
};

/**
 * Check if a token exists for a specific archetype
 * @param archetypeId The ID of the archetype
 * @returns Boolean indicating if a token exists
 */
export const hasReportToken = (archetypeId: string): boolean => {
  return !!getReportToken(archetypeId);
};

