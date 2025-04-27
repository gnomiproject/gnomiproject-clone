
/**
 * Utility for generating and managing secure report access tokens
 */

import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a secure token for accessing a specific archetype report
 * @param archetypeId The ID of the archetype
 * @returns The generated token
 */
export const generateReportAccessToken = (archetypeId: string): string => {
  // Generate a random token using UUID v4 for better security
  const token = uuidv4();
  
  // Store the token in localStorage with archetype ID as key
  const storedTokens = JSON.parse(localStorage.getItem('admin_report_tokens') || '{}');
  storedTokens[archetypeId] = token;
  localStorage.setItem('admin_report_tokens', JSON.stringify(storedTokens));
  
  return token;
};

/**
 * Get the secure URL for viewing a report
 * @param archetypeId The ID of the archetype
 * @returns The secure URL including a token
 */
export const getSecureReportUrl = (archetypeId: string): string => {
  const token = generateReportAccessToken(archetypeId);
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
    const storedTokens = JSON.parse(localStorage.getItem('admin_report_tokens') || '{}');
    return storedTokens[archetypeId] === token;
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
    const storedTokens = JSON.parse(localStorage.getItem('admin_report_tokens') || '{}');
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
  localStorage.removeItem('admin_report_tokens');
};
