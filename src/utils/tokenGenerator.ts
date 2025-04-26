
/**
 * Utility for generating and managing secure report access tokens
 */

/**
 * Generate a secure token for accessing a specific archetype report
 * @param archetypeId The ID of the archetype
 * @returns The generated token
 */
export const generateReportAccessToken = (archetypeId: string): string => {
  // Generate a random token using current timestamp and a random component
  const timestamp = Date.now().toString();
  const randomComponent = Math.random().toString(36).substring(2, 15);
  const token = `${timestamp}-${randomComponent}`;
  
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
 * Clear all stored tokens
 */
export const clearAllReportTokens = (): void => {
  localStorage.removeItem('admin_report_tokens');
};
