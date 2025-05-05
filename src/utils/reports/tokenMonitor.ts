
/**
 * Token monitoring utilities to track access and validation over time
 */

interface TokenCheckRecord {
  timestamp: number;
  archetype: string;
  token: string;
  success: boolean;
  expiresAt?: string | null;
  error?: string;
}

// In-memory store of recent token checks
const tokenChecks: TokenCheckRecord[] = [];

// Maximum number of checks to store in memory
const MAX_TOKEN_CHECKS = 100;

/**
 * Records a token check event
 */
export const recordTokenCheck = (
  archetypeId: string,
  token: string,
  success: boolean,
  expiresAt?: string | null,
  error?: string
): void => {
  // Add new check at the beginning
  tokenChecks.unshift({
    timestamp: Date.now(),
    archetype: archetypeId,
    token: token.substring(0, 5) + '...',
    success,
    expiresAt,
    error
  });
  
  // Trim if exceeding max size
  if (tokenChecks.length > MAX_TOKEN_CHECKS) {
    tokenChecks.length = MAX_TOKEN_CHECKS;
  }
  
  // Log the check for debugging
  console.log(`[TokenMonitor] Token check recorded: ${success ? 'SUCCESS' : 'FAILURE'} for ${archetypeId}`);
  if (error) {
    console.warn(`[TokenMonitor] Token check error: ${error}`);
  }
};

/**
 * Get token check history
 */
export const getTokenChecks = (limit = 20): TokenCheckRecord[] => {
  return tokenChecks.slice(0, limit);
};

/**
 * Check if a token has recently failed validation
 */
export const hasRecentFailure = (
  archetypeId: string,
  token: string,
  timeWindowMs = 60000 // 1 minute
): boolean => {
  const now = Date.now();
  const recentChecks = tokenChecks.filter(check => 
    check.archetype === archetypeId && 
    check.token.startsWith(token.substring(0, 5)) &&
    now - check.timestamp < timeWindowMs
  );
  
  return recentChecks.some(check => !check.success);
};

/**
 * Returns a summary of token check statistics
 */
export const getTokenCheckStats = () => {
  if (tokenChecks.length === 0) {
    return { total: 0, success: 0, failure: 0, failureRate: 0 };
  }
  
  const total = tokenChecks.length;
  const success = tokenChecks.filter(check => check.success).length;
  const failure = total - success;
  const failureRate = (failure / total) * 100;
  
  return {
    total,
    success,
    failure,
    failureRate: Math.round(failureRate * 10) / 10
  };
};
